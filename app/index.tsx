import { useAuth } from "@/hooks/AuhtProvider";
import { Redirect } from "expo-router";
import React from "react";

const App = () => {
  const { auth } = useAuth();
  const { isLogin } = auth;
  if (isLogin) {
    return <Redirect href="/(tabs)" />;
  }
  return <Redirect href="/sign-in" />;
};

export default App;
