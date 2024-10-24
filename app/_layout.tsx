import AuthProvider from "@/hooks/AuhtProvider";
import { Slot } from "expo-router";


const RootLayout = () => {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
};

export default RootLayout;
