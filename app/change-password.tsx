import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PasswordInput } from '~/components/PasswordInput';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { useAuth } from '~/services/auth-context';

export default function ChangePasswordScreen() {
  const { user, changePassword } = useAuth();
  const [isChanging, setIsChanging] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

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

  const handleCancel = () => {
    router.back();
  };

  const handleInputFocus = () => {
    if (Platform.OS === 'android' && keyboardVisible) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleChangePassword = async () => {
    // Basic validation
    if (!formData.currentPassword.trim()) {
      Alert.alert('Validation Error', 'Current password is required');
      return;
    }
    if (!formData.newPassword.trim()) {
      Alert.alert('Validation Error', 'New password is required');
      return;
    }
    if (formData.newPassword.length < 6) {
      Alert.alert('Validation Error', 'New password must be at least 6 characters long');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert('Validation Error', 'New passwords do not match');
      return;
    }
    if (formData.currentPassword === formData.newPassword) {
      Alert.alert('Validation Error', 'New password must be different from current password');
      return;
    }

    setIsChanging(true);
    try {
      await changePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      );
      
      Alert.alert('Success', 'Password changed successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsChanging(false);
    }
  };

  if (!user) {
    return (
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-muted-foreground">
            User not found
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={Platform.OS === 'android' ? { flex: 1 } : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          contentContainerClassName="px-4 py-6"
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'android' && keyboardVisible ? 300 : 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
          keyboardDismissMode="interactive"
        >
          <View className="space-y-8">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Button
                onPress={handleCancel}
                variant="outline"
                size="sm"
              >
                <Text>Cancel</Text>
              </Button>
              <Text className="text-xl font-semibold text-foreground">
                Change Password
              </Text>
              <Button
                onPress={handleChangePassword}
                disabled={isChanging}
                size="sm"
              >
                <Text>{isChanging ? 'Changing...' : 'Change'}</Text>
              </Button>
            </View>

            {/* Info Card */}
            <Card className="bg-muted/20 mt-2">
              <CardContent className="pt-6">
                <Text className="text-sm text-muted-foreground text-center">
                  For security, you'll need to enter your current password to set a new one.
                </Text>
              </CardContent>
            </Card>

            {/* Password Form */}
            <Card className="mt-2">
              <CardHeader>
                <CardTitle>Password Information</CardTitle>
              </CardHeader>
              <CardContent className="gap-6">
                <View className="gap-5">
                  <Text className="text-sm font-medium text-foreground">
                    Current Password *
                  </Text>
                  <PasswordInput
                    value={formData.currentPassword}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, currentPassword: text }))}
                    placeholder="Enter your current password"
                    onFocus={handleInputFocus}
                  />
                </View>

                <View className="gap-5">
                  <Text className="text-sm font-medium text-foreground">
                    New Password *
                  </Text>
                  <PasswordInput
                    value={formData.newPassword}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, newPassword: text }))}
                    placeholder="Enter your new password"
                    onFocus={handleInputFocus}
                  />
                  <Text className="text-xs text-muted-foreground mt-1">
                    Password must be at least 6 characters long
                  </Text>
                </View>

                <View className="gap-5">
                  <Text className="text-sm font-medium text-foreground">
                    Confirm New Password *
                  </Text>
                  <PasswordInput
                    value={formData.confirmPassword}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                    placeholder="Confirm your new password"
                    onFocus={handleInputFocus}
                  />
                </View>
              </CardContent>
            </Card>

            {/* Security Tips */}
            <Card className="border-border/50 mt-2">
              <CardHeader>
                <CardTitle className="text-base">Security Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Text className="text-sm text-muted-foreground">
                  • Use a strong password with a mix of letters, numbers, and symbols
                </Text>
                <Text className="text-sm text-muted-foreground">
                  • Don't reuse passwords from other accounts
                </Text>
                <Text className="text-sm text-muted-foreground">
                  • Consider using a password manager
                </Text>
              </CardContent>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
} 