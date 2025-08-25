import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PasswordInput } from '~/components/PasswordInput';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { useAuth } from '~/services/auth-context';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  const { login } = useAuth();
  const insets = useSafeAreaInsets();
  const scrollViewRef = React.useRef<ScrollView>(null);

  // Handle keyboard visibility for Android
  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardVisible(true);
      // Auto-scroll to focused input on Android
      if (Platform.OS === 'android') {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

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

  const handleInputFocus = () => {
    if (Platform.OS === 'android' && keyboardVisible) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          contentContainerStyle={{ 
            flexGrow: 1, 
            justifyContent: 'center', 
            paddingHorizontal: 24,
            paddingBottom: Platform.OS === 'android' && keyboardVisible ? 200 : 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
          keyboardDismissMode="interactive"
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
              <CardContent className="gap-5">
                {/* {error ? (
                  <View className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                    <Text className="text-destructive text-sm text-center">
                      {error}
                    </Text>
                  </View>
                ) : null} */}

                <View className="gap-5">
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
                    onFocus={handleInputFocus}
                  />
                </View>

                <View className="gap-5">
                  <Text className="text-sm font-medium text-foreground">
                    Password
                  </Text>
                  <PasswordInput
                    placeholder="password"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (error) setError(''); // Clear error when user starts typing
                    }}
                    autoComplete="current-password"
                    editable={!isLoading}
                    onFocus={handleInputFocus}
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
