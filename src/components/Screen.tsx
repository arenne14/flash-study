import React from "react";
import {
    Dimensions,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

// Screen background with the light grid from the design.
export default function Screen({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const rows = Math.ceil(height / 30);
  const cols = Math.ceil(width / 30);
  return (
    <SafeAreaView edges={["bottom"]} style={[styles.screen, style]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {Array.from({ length: rows }).map((_, i) => (
          <View key={"r" + i} style={[styles.hLine, { top: i * 30 }]} />
        ))}
        {Array.from({ length: cols }).map((_, i) => (
          <View key={"c" + i} style={[styles.vLine, { left: i * 30 }]} />
        ))}
      </View>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  hLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#EBEBEB",
  },
  vLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "#EBEBEB",
  },
});
