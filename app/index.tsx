import { router } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    // Redirect to login screen on app start
    router.replace("/(auth)/login");
  }, []);

  return null;
}
