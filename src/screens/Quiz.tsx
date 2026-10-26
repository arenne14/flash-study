import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Screen from "../components/Screen";
import ShadowBox from "../components/ShadowBox";
import { loadData, saveData } from "../store/storage";
import { AppData, Card, Course } from "../types";

// ====================================================================
// STACK
//
// A stack is LIFO: Last In, First Out, like a pile of cards.
// You can only add or remove at the TOP of the pile.
//   push(x) -> put x on the TOP        (array.push(x))
//   pop()   -> take the TOP item off   (array.pop())
//   peek    -> look at the TOP only    (array[array.length - 1])
//
// WHY IT IS A STACK:
// 1. deck    = the questions still to answer. The top card is the current
//              question. When it is answered we POP it off the deck.
// 2. history = the answers already given. Each answered card is PUSHED on
//              top. The back button POPS the last answer and PUSHES that
//              card back on the deck, so the LAST answer is undone FIRST.
// 3. recentStack (in data.json) = recent courses. The newest is on TOP,
//              so the Home screen just peeks at the top.
// ====================================================================

// One answer in the history stack.
type HistoryItem = { card: Card; isCorrect: boolean };

// Mixes up a list in random order so answer choices are not memorized by position.
function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 3 choices (1 correct + 2 wrong) in random order.
function makeChoices(card: Card): string[] {
  return shuffle([card.answer, ...card.wrong]);
}

// Turns a score (0-100) into a word.
function getPerformance(score: number): string {
  if (score >= 90) return "Excellent!";
  if (score >= 75) return "Good!";
  if (score >= 50) return "Fair";
  return "Keep Practicing";
}

export default function Quiz() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();

  const dataRef = useRef<AppData | null>(null); // the whole save file
  const [data, setData] = useState<AppData | null>(null);
  const [deck, setDeck] = useState<Card[]>([]); // STACK of questions left (top = last item)
  const [history, setHistory] = useState<HistoryItem[]>([]); // STACK of answers given (top = last item)
  const [choices, setChoices] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null); // null, 'correct' or 'wrong'
  const [finished, setFinished] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const [total, setTotal] = useState(0);

  // Finds this course inside the save file.
  function getCourse(): Course {
    return dataRef.current!.courses.find((c) => c.id === courseId)!;
  }

  // Builds the deck stack. If everything was already answered, start over.
  function startQuiz(resetAll: boolean) {
    const course = getCourse();
    if (resetAll || course.cards.every((c) => c.status !== "unanswered")) {
      course.cards.forEach((c) => (c.status = "unanswered"));
    }
    const newDeck: Card[] = [];
    course.cards
      .filter((c) => c.status === "unanswered")
      .forEach((c) => newDeck.push(c)); // PUSH in the saved card order
    setDeck(newDeck);
    setHistory([]);
    setTotal(course.cards.length);
    setFinished(newDeck.length === 0);
    setFeedback(null);
    setSeconds(0);
    if (newDeck.length > 0)
      setChoices(makeChoices(newDeck[newDeck.length - 1])); // PEEK
  }

  // Load the data when the screen opens.
  useEffect(() => {
    loadData().then((data) => {
      dataRef.current = data;
      setData(data);
      startQuiz(false);
    });
  }, []);

  // Simple timer: counts seconds unless paused or finished.
  useEffect(() => {
    const timer = setInterval(() => {
      if (!paused && !finished) setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [paused, finished]);

  // Called when the user taps a choice.
  async function answer(choice: string) {
    if (paused || feedback || finished) return;

    const card = deck[deck.length - 1]; // PEEK the top card
    const isCorrect = choice === card.answer;

    const newDeck = [...deck];
    newDeck.pop(); // POP it off the deck
    const newHistory = [...history];
    newHistory.push({ card, isCorrect }); // PUSH it on the history

    setDeck(newDeck);
    setHistory(newHistory);
    setFeedback(isCorrect ? "correct" : "wrong");

    // Save the result in data.json.
    getCourse().cards.find((c) => c.id === card.id)!.status = isCorrect
      ? "correct"
      : "wrong";
    // This course goes on TOP of the recentStack (push).
    const recent = dataRef.current!.recentStack.filter((id) => id !== courseId);
    recent.push(courseId);
    dataRef.current!.recentStack = recent;
    await saveData(dataRef.current!);

    // Show CORRECT / WRONG for 1 second, then the next card.
    setTimeout(() => {
      setFeedback(null);
      if (newDeck.length === 0) {
        setFinished(true);
      } else {
        setChoices(makeChoices(newDeck[newDeck.length - 1]));
      }
    }, 1000);
  }

  // Back button: undo the LAST answer (pop history, push back on deck).
  async function undo() {
    if (feedback) return;
    if (history.length === 0) {
      router.back();
      return;
    }
    const newHistory = [...history];
    const last = newHistory.pop()!; // POP the last answer
    const newDeck = [...deck];
    newDeck.push(last.card); // PUSH the card back on the deck

    getCourse().cards.find((c) => c.id === last.card.id)!.status = "unanswered";
    await saveData(dataRef.current!);

    setHistory(newHistory);
    setDeck(newDeck);
    setChoices(makeChoices(last.card));
    setFinished(false);
  }

  // Try Again: reset all cards and start a new deck.
  async function tryAgain() {
    startQuiz(true);
    await saveData(dataRef.current!);
  }

  if (!data) return <Screen />;
  const course = data.courses.find((item) => item.id === courseId)!;

  // ---------- SCORE BOARD ----------
  if (finished) {
    const correct = course.cards.filter((c) => c.status === "correct").length;
    const score = total === 0 ? 0 : Math.round((correct / total) * 100);
    return (
      <Screen style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.boardTitle}>Score Board</Text>
        <ShadowBox
          color="#DCC8FF"
          radius={30}
          offset={10}
          style={{ width: "85%" }}
        >
          <View style={styles.boardRow}>
            <View style={{ alignItems: "center" }}>
              <ShadowBox color="#D9FBFF" radius={0} offset={6}>
                <Text style={styles.scoreNumber}>{score}</Text>
              </ShadowBox>
              <Text style={{ fontSize: 20, marginTop: 4 }}>Score</Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                Performance
              </Text>
              <Text style={{ fontSize: 22 }}>{getPerformance(score)}</Text>
            </View>
          </View>
        </ShadowBox>

        <TouchableOpacity onPress={tryAgain} style={styles.boardBtn}>
          <ShadowBox color="#C1FF72" radius={40} offset={5}>
            <Text style={styles.boardBtnText}>Try Again</Text>
          </ShadowBox>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace("/home")}
          style={styles.boardBtn}
        >
          <ShadowBox color="#FFE8EA" radius={40} offset={5}>
            <Text style={styles.boardBtnText}>Back to Home</Text>
          </ShadowBox>
        </TouchableOpacity>
      </Screen>
    );
  }

  // ---------- QUESTION SCREEN ----------
  // While CORRECT/WRONG shows, the question we just answered is on top of history.
  const current = feedback
    ? history[history.length - 1].card
    : deck[deck.length - 1];
  const answered = total - deck.length;

  return (
    <Screen>
      <TouchableOpacity onPress={undo} style={styles.back}>
        <ShadowBox color="#FB8C8C" radius={0} offset={3}>
          <Ionicons name="arrow-undo" size={28} color="#000" />
        </ShadowBox>
      </TouchableOpacity>

      <ShadowBox radius={30} offset={14} style={styles.questionBox}>
        <View style={styles.questionInner}>
          <Text style={styles.questionText}>{current.question}</Text>
        </View>
      </ShadowBox>

      <View style={{ alignItems: "center", marginTop: 40 }}>
        {choices.map((choice) => (
          <TouchableOpacity
            key={choice}
            onPress={() => answer(choice)}
            style={styles.choiceWrap}
          >
            <ShadowBox radius={40} offset={5}>
              <Text style={styles.choiceText}>{choice}</Text>
            </ShadowBox>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottom}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => setPaused(true)}
            style={[styles.circle, { backgroundColor: "#FF3131" }]}
          >
            <Ionicons name="pause" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPaused(false)}
            style={[styles.circle, { backgroundColor: "#7ED957" }]}
          >
            <Ionicons name="play" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {feedback === "correct" ? (
          <Text style={[styles.feedback, { color: "#2E9E2E" }]}>CORRECT</Text>
        ) : feedback === "wrong" ? (
          <Text style={[styles.feedback, { color: "#D61F1F" }]}>WRONG</Text>
        ) : (
          <Text style={styles.timer}>{paused ? "Paused" : seconds + "s"}</Text>
        )}

        <View style={styles.barOuter}>
          <View
            style={[
              styles.barInner,
              {
                width:
                  `${total === 0 ? 0 : (answered / total) * 100}%` as `${number}%`,
              },
            ]}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { position: "absolute", top: 50, left: 24, zIndex: 2 },
  questionBox: { marginTop: 130, marginHorizontal: 30 },
  questionInner: {
    height: 190,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  questionText: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  choiceWrap: { width: "64%", marginBottom: 14 },
  choiceText: {
    textAlign: "center",
    paddingVertical: 24,
    paddingHorizontal: 10,
    fontSize: 18,
  },
  bottom: {
    position: "absolute",
    bottom: 40,
    left: 30,
    right: 30,
    alignItems: "center",
  },
  circle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  feedback: {
    fontSize: 26,
    fontWeight: "900",
    marginVertical: 6,
    letterSpacing: 1,
  },
  timer: { fontSize: 18, marginVertical: 10 },
  barOuter: {
    width: "100%",
    height: 26,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#222",
    backgroundColor: "#FFF",
    padding: 2,
  },
  barInner: {
    height: "100%",
    backgroundColor: "#FFD60A",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#222",
  },
  boardTitle: { fontSize: 36, marginBottom: 20 },
  boardRow: { flexDirection: "row", alignItems: "center", padding: 20 },
  scoreNumber: { fontSize: 32, paddingVertical: 20, paddingHorizontal: 30 },
  boardBtn: { width: 200, marginTop: 24 },
  boardBtnText: {
    textAlign: "center",
    paddingVertical: 18,
    fontSize: 18,
    fontWeight: "600",
  },
});
