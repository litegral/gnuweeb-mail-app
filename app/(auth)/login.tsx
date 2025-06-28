import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to tabs after successful login
      router.replace('/(tabs)/home');
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-1 justify-center px-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full max-w-sm mx-auto">
            {/* Logo/Title Section */}
            <View className="items-center mb-8">
              <Text className="text-4xl font-bold text-foreground mb-2 leading-tight">
                GNU/Weeb Mail Portal
              </Text>
              <Text className="text-muted-foreground text-center">
                Proceed to sign in to manage your email account.
              </Text>
            </View>

            {/* Login Form */}
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <View className="space-y-2">
                  <Text className="text-sm font-medium text-foreground">
                    Username or Email
                  </Text>
                  <Input
                    placeholder="username@gnuweeb.org"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>

                <View className="space-y-2">
                  <Text className="text-sm font-medium text-foreground">
                    Password
                  </Text>
                  <Input
                    placeholder="password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoComplete="current-password"
                  />
                </View>

                <Button
                  onPress={handleLogin}
                  disabled={isLoading || !email || !password}
                  className="w-full mt-6"
                >
                  <Text>
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </Text>
                </Button>
              </CardContent>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
