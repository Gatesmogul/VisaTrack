//app/_layout.tsx
import { Stack } from "expo-router";
import _layout from "./(tabs)/_layout";
import app from ".";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
