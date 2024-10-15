import AuthProvider from "@/hooks/AuhtProvider";
import { Slot } from "expo-router";
import { Stack } from "expo-router/stack";
import { SafeAreaView } from "react-native-safe-area-context";

const RootLayout = () => {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
};

export default RootLayout;
