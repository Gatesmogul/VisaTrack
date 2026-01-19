import { Stack } from "expo-router";

export default function RootLayout() {
  console.log("🟦 ROOT LAYOUT RENDERED");
  return <Stack screenOptions={{ headerShown: false }} />;
}
