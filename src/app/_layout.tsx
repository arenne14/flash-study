import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="name" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="course-menu" />
      <Stack.Screen name="quiz" />
      <Stack.Screen name="editor" />
    </Stack>
  );
}