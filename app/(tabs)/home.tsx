import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Text } from '~/components/ui/text';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl font-medium text-foreground">
          Home Screen
        </Text>
      </View>
    </SafeAreaView>
  );
}
