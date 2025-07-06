import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PasswordInput } from '~/components/PasswordInput';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Text } from '~/components/ui/text';
import { useAuth } from '~/services/auth-context';

export default function EditProfileScreen() {
  const { user, updateUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const insets = useSafeAreaInsets();

  // Form state
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    ext_email: user?.ext_email || '',
    gender: user?.gender || '',
    password: '',
    github_username: user?.socials.github_username || '',
    telegram_username: user?.socials.telegram_username || '',
    twitter_username: user?.socials.twitter_username || '',
    discord_username: user?.socials.discord_username || '',
    photo: null as any,
  });

  // Update form data when user data changes
  React.useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name,
        ext_email: user.ext_email,
        gender: user.gender,
        password: '',
        github_username: user.socials.github_username || '',
        telegram_username: user.socials.telegram_username || '',
        twitter_username: user.socials.twitter_username || '',
        discord_username: user.socials.discord_username || '',
        photo: null,
      });
    }
  }, [user]);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setFormData(prev => ({
        ...prev,
        photo: {
          uri: asset.uri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        },
      }));
    }
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.full_name.trim()) {
      Alert.alert('Validation Error', 'Full name is required');
      return;
    }
    if (!formData.ext_email.trim()) {
      Alert.alert('Validation Error', 'Email is required');
      return;
    }
    if (!formData.password.trim()) {
      Alert.alert('Validation Error', 'Password is required to update profile');
      return;
    }

    setIsSaving(true);
    try {
      const updateData = {
        full_name: formData.full_name,
        ext_email: formData.ext_email,
        gender: formData.gender,
        password: formData.password,
        'socials[github_username]': formData.github_username,
        'socials[telegram_username]': formData.telegram_username,
        'socials[twitter_username]': formData.twitter_username,
        'socials[discord_username]': formData.discord_username,
        ...(formData.photo && { photo: formData.photo }),
      };

      await updateUser(updateData);
      Alert.alert('Success', 'Profile updated successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 py-6"
          keyboardShouldPersistTaps="handled"
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
                Edit Profile
              </Text>
              <Button
                onPress={handleSave}
                disabled={isSaving}
                size="sm"
              >
                <Text>{isSaving ? 'Saving...' : 'Save'}</Text>
              </Button>
            </View>

            {/* Profile Photo */}
            <View className="items-center justify-center w-full">
              <TouchableOpacity onPress={handlePickImage} className="items-center">
                <Avatar alt={user.full_name} className="w-24 h-24 mb-3">
                  <AvatarImage
                    source={{
                      uri: formData.photo?.uri || user.photo || undefined
                    }}
                  />
                  <AvatarFallback>
                    <Text className="text-2xl font-semibold text-foreground">
                      {formData.full_name
                        .split(' ')
                        .map((name) => name.charAt(0).toUpperCase())
                        .join('')}
                    </Text>
                  </AvatarFallback>
                </Avatar>
                <Text className="text-sm text-muted-foreground text-center">
                  Tap to change photo
                </Text>
              </TouchableOpacity>
            </View>

            {/* Basic Information */}
            <Card className="mb-6 mt-2">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <View className="space-y-2">
                  <Text className="text-sm font-medium text-foreground">
                    Full Name *
                  </Text>
                  <Input
                    value={formData.full_name}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, full_name: text }))}
                    placeholder="Full Name"
                  />
                </View>

                <View className="space-y-2">
                  <Text className="text-sm font-medium text-foreground">
                    Email *
                  </Text>
                  <Input
                    value={formData.ext_email}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, ext_email: text }))}
                    placeholder="Email"
                    keyboardType="email-address"
                  />
                </View>

                <View className="space-y-2">
                  <Text className="text-sm font-medium text-foreground">
                    Gender
                  </Text>
                  <Select
                    value={{ value: formData.gender, label: formData.gender === 'm' ? 'Male' : formData.gender === 'f' ? 'Female' : 'Other' }}
                    onValueChange={(option) => {
                      if (option) {
                        setFormData(prev => ({ ...prev, gender: option.value }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" className='text-foreground' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m" label="Male">
                        <Text>Male</Text>
                      </SelectItem>
                      <SelectItem value="f" label="Female">
                        <Text>Female</Text>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </View>

                <View className="space-y-2">
                  <Text className="text-sm font-medium text-foreground">
                    Password *
                  </Text>
                  <PasswordInput
                    value={formData.password}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                    placeholder="Enter current password"
                  />
                </View>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <View className="space-y-2">
                  <Text className="text-sm font-medium text-foreground">
                    GitHub
                  </Text>
                  <Input
                    value={formData.github_username}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, github_username: text }))}
                    placeholder="GitHub username"
                  />
                </View>

                <View className="space-y-2">
                  <Text className="text-sm font-medium text-foreground">
                    Telegram
                  </Text>
                  <Input
                    value={formData.telegram_username}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, telegram_username: text }))}
                    placeholder="Telegram username"
                  />
                </View>

                <View className="space-y-2">
                  <Text className="text-sm font-medium text-foreground">
                    Twitter
                  </Text>
                  <Input
                    value={formData.twitter_username}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, twitter_username: text }))}
                    placeholder="Twitter username"
                  />
                </View>

                <View className="space-y-2">
                  <Text className="text-sm font-medium text-foreground">
                    Discord
                  </Text>
                  <Input
                    value={formData.discord_username}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, discord_username: text }))}
                    placeholder="Discord username"
                  />
                </View>
              </CardContent>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
} 