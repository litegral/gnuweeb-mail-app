import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Text } from '~/components/ui/text';

export default function AccountScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl font-medium text-foreground">
          Account Screen
        </Text>
      </View>
    </SafeAreaView>
  );
}
