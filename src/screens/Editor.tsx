import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Modal, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import ShadowBox from '../components/ShadowBox';
import { loadData, saveData } from '../store/storage';
import { AppData, Card } from '../types';

// Edit mode: add new cards and change the text of existing cards.
export default function Editor() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const [data, setData] = useState<AppData | null>(null);
  const [open, setOpen] = useState(false);       // is the popup open?
  const [editingId, setEditingId] = useState<string | null>(null); // null = adding a new card
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [wrong1, setWrong1] = useState('');
  const [wrong2, setWrong2] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadData().then(setData);
    }, [])
  );

  if (!data) return <Screen />;
  const course = data.courses.find((c) => c.id === courseId)!;

  // Opens the popup. If a card is given we edit it, otherwise it is empty (new card).
  function openForm(card: Card | null) {
    setEditingId(card ? card.id : null);
    setQuestion(card ? card.question : '');
    setAnswer(card ? card.answer : '');
    setWrong1(card ? card.wrong[0] : '');
    setWrong2(card ? card.wrong[1] : '');
    setOpen(true);
  }

  // Saves the new card or the changes to an existing card.
  async function saveCard() {
    if (!question.trim() || !answer.trim() || !wrong1.trim() || !wrong2.trim()) {
      Alert.alert('Missing text', 'Please fill in all 4 boxes.');
      return;
    }
    const fresh = await loadData();
    const cards = fresh.courses.find((c) => c.id === courseId)!.cards;
    const info = { question: question.trim(), answer: answer.trim(), wrong: [wrong1.trim(), wrong2.trim()] };

    if (editingId) {
      Object.assign(cards.find((c) => c.id === editingId)!, info);
    } else {
      cards.push({ id: 'q' + Date.now(), ...info, status: 'unanswered' });
    }
    await saveData(fresh);
    setData(fresh);
    setOpen(false);
  }

  // Deletes the card being edited.
  async function deleteCard() {
    const fresh = await loadData();
    const c = fresh.courses.find((x) => x.id === courseId)!;
    c.cards = c.cards.filter((card) => card.id !== editingId);
    await saveData(fresh);
    setData(fresh);
    setOpen(false);
  }

  return (
    <Screen>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <ShadowBox color="#FB8C8C" radius={0} offset={3}>
          <Ionicons name="arrow-undo" size={28} color="#000" />
        </ShadowBox>
      </TouchableOpacity>

      <Text style={styles.title}>{course.name}</Text>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        {course.cards.map((card) => (
          <TouchableOpacity key={card.id} onPress={() => openForm(card)} style={{ marginBottom: 16 }}>
            <ShadowBox radius={20} offset={8}>
              <View style={{ padding: 18 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{card.question}</Text>
                <Text style={{ marginTop: 6, color: '#2E9E2E' }}>{card.answer}</Text>
              </View>
            </ShadowBox>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={() => openForm(null)} style={{ marginTop: 10, alignSelf: 'center', width: 220 }}>
          <ShadowBox color="#C1FF72" radius={40} offset={5}>
            <Text style={styles.addText}>+ Add Card</Text>
          </ShadowBox>
        </TouchableOpacity>
      </ScrollView>

      {/* Popup: same card layout, but with text boxes */}
      <Modal visible={open} transparent animationType="fade">
        <View style={styles.overlay}>
          <ShadowBox radius={20} offset={8} style={{ width: '88%' }}>
            <View style={{ padding: 20 }}>
              <Text style={styles.label}>Question</Text>
              <TextInput style={styles.input} value={question} onChangeText={setQuestion} multiline />
              <Text style={styles.label}>Correct answer</Text>
              <TextInput style={styles.input} value={answer} onChangeText={setAnswer} />
              <Text style={styles.label}>Wrong answer 1</Text>
              <TextInput style={styles.input} value={wrong1} onChangeText={setWrong1} />
              <Text style={styles.label}>Wrong answer 2</Text>
              <TextInput style={styles.input} value={wrong2} onChangeText={setWrong2} />

              <TouchableOpacity style={styles.saveBtn} onPress={saveCard}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Save</Text>
              </TouchableOpacity>
              {editingId ? (
                <TouchableOpacity onPress={deleteCard} style={{ alignItems: 'center', marginTop: 12 }}>
                  <Text style={{ color: '#D61F1F' }}>Delete card</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity onPress={() => setOpen(false)} style={{ alignItems: 'center', marginTop: 12 }}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ShadowBox>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { position: 'absolute', top: 50, left: 24, zIndex: 2 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 55, marginBottom: 10, paddingHorizontal: 80 },
  addText: { textAlign: 'center', paddingVertical: 16, fontSize: 18, fontWeight: '600' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 13, marginBottom: 4 },
  input: { borderWidth: 2, borderColor: '#000', padding: 10, fontSize: 16, marginBottom: 12 },
  saveBtn: { backgroundColor: '#C1FF72', borderWidth: 2, borderColor: '#000', padding: 12, alignItems: 'center', marginTop: 4 },
});
