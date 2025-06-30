import { router } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/services/auth-context";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      // Still loading authentication state
      return;
    }

    if (isAuthenticated) {
      // User is authenticated, redirect to main app
      router.replace("/(tabs)/home");
    } else {
      // User is not authenticated, redirect to login
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, isLoading]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-lg text-foreground">Loading...</Text>
      </View>
    );
  }

  return null;
}
