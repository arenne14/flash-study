import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Folder colors the user can pick from (back = darker, front = lighter).
export const FOLDER_COLORS: Record<string, { back: string; front: string }> = {
  yellow: { back: "#EE9B0A", front: "#FFD60A" },
  pink: { back: "#FFA6DC", front: "#FB8C8C" },
  green: { back: "#7ED957", front: "#C1FF72" },
  red: { back: "#FF5757", front: "#FF3131" },
  cyan: { back: "#0CC0DF", front: "#75FBFD" },
  purple: { back: "#8C52FF", front: "#B99AF4" },
  orange: { back: "#FF751F", front: "#FF914D" },
  magenta: { back: "#FF66C4", front: "#E0A8F0" },
};

// A folder icon drawn with Views so the color can change. Shows the course name below.
type Props = {
  color?: string;
  name: string;
  plus?: boolean;
  onPress: () => void;
};

export default function Folder({
  color = "yellow",
  name,
  plus,
  onPress,
}: Props) {
  const c = FOLDER_COLORS[color] || FOLDER_COLORS.yellow;
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.icon}>
        <View style={[styles.tab, { backgroundColor: c.back }]} />
        <View style={[styles.back, { backgroundColor: c.back }]} />
        <View style={styles.paper} />
        <View style={[styles.front, { backgroundColor: c.front }]}>
          {plus ? <Text style={styles.plus}>+</Text> : null}
        </View>
      </View>
      <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
        {name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    width: "50%",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  icon: { width: 130, height: 105 },
  tab: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 50,
    height: 24,
    borderWidth: 3,
    borderColor: "#000",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 14,
  },
  back: {
    position: "absolute",
    top: 14,
    left: 0,
    width: 112,
    height: 80,
    borderWidth: 3,
    borderColor: "#000",
    borderRadius: 10,
  },
  paper: {
    position: "absolute",
    top: 26,
    left: 12,
    width: 92,
    height: 50,
    backgroundColor: "#F6F4FA",
    borderWidth: 3,
    borderColor: "#000",
    borderRadius: 8,
  },
  front: {
    position: "absolute",
    top: 36,
    left: 8,
    width: 118,
    height: 62,
    borderWidth: 3,
    borderColor: "#000",
    borderRadius: 12,
    transform: [{ skewX: "-10deg" }],
    justifyContent: "center",
    alignItems: "center",
  },
  plus: { fontSize: 48, fontWeight: "200" },
  name: {
    marginTop: 6,
    fontSize: 12,
    textAlign: "center",
    width: "100%",
    maxWidth: 120,
    flexShrink: 1,
  },
});
