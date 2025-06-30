import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { Eye } from '~/lib/icons/Eye';
import { EyeOff } from '~/lib/icons/EyeOff';
import { useAuth } from '~/services/auth-context';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      // Navigate to tabs after successful login
      router.replace('/(tabs)/home');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setError(errorMessage);
      
      // Show alert for error
      Alert.alert(
        'Login Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
                {/* {error ? (
                  <View className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                    <Text className="text-destructive text-sm text-center">
                      {error}
                    </Text>
                  </View>
                ) : null} */}

                <View className="space-y-2">
                  <Text className="text-sm font-medium text-foreground">
                    Username or Email
                  </Text>
                  <Input
                    placeholder="username@gnuweeb.org"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (error) setError(''); // Clear error when user starts typing
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    editable={!isLoading}
                  />
                </View>

                <View className="space-y-2">
                  <Text className="text-sm font-medium text-foreground">
                    Password
                  </Text>
                  <View className="relative">
                    <Input
                      placeholder="password"
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (error) setError(''); // Clear error when user starts typing
                      }}
                      secureTextEntry={!showPassword}
                      autoComplete="current-password"
                      editable={!isLoading}
                      className="pr-12"
                    />
                    <TouchableOpacity
                      onPress={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Eye className="w-5 h-5 text-muted-foreground" />
                      )}
                    </TouchableOpacity>
                  </View>
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
