import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { Alert, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { mailConfig } from '~/constants/mail-config';

export default function HomeScreen() {
  const copyToClipboard = async (value: string | number, label: string) => {
    await Clipboard.setStringAsync(value.toString());
    Alert.alert('Copied!', `${label}: ${value} copied to clipboard`);
  };

  const ConfigRow = ({ label, value }: { label: string; value: string | number }) => (
    <View className="flex-row justify-between items-center mb-2">
      <Text className="text-sm text-muted-foreground font-medium">{label}</Text>
      <TouchableOpacity onPress={() => copyToClipboard(value, label)}>
        <Text className="text-sm text-foreground font-mono">
          {value}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const ConfigSection = ({ title, config }: { title: string; config: typeof mailConfig.incoming }) => (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-foreground mb-3">[{title}]</Text>
      <View className="space-y-2">
        <ConfigRow label="Server" value={config.server} />
        <ConfigRow label="Protocol" value={config.protocol} />
        <ConfigRow label="Port" value={config.port} />
        <ConfigRow label="SSL" value={config.ssl} />
        <ConfigRow label="Auth" value={config.auth} />
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center items-center px-4">
        <ScrollView 
          contentContainerStyle={{ 
            flexGrow: 1, 
            justifyContent: 'center',
            paddingVertical: 20 
          }}
          showsVerticalScrollIndicator={false}
        >
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Mail Client Config</CardTitle>
              <CardDescription>
                Configure your email client using this config. Tap any value to copy it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConfigSection title="Incoming" config={mailConfig.incoming} />
              <ConfigSection title="Outgoing" config={mailConfig.outgoing} />
            </CardContent>
          </Card>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
