import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { useAuth } from '~/services/auth-context';

export default function AccountScreen() {
  const { user, logout, isAuthenticated, refreshUser } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshUser();
      Alert.alert('Success', 'Profile information updated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh profile information';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-muted-foreground">
            Not authenticated
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView 
        className="flex-1" 
        contentContainerClassName="p-6"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#3b82f6']} // Android
            tintColor={'#3b82f6'} // iOS
          />
        }
      >
        <View className="space-y-6">
          {/* Header */}
          <View className="items-center pb-4">
            <Avatar alt={user.full_name} className="w-20 h-20 mb-4">
              <AvatarImage source={{ uri: user.photo || undefined }} />
              <AvatarFallback>
                <Text className="text-xl font-semibold text-foreground">
                  {user.full_name
                    .split(' ')
                    .map((name) => name.charAt(0).toUpperCase())
                    .join('')}
                </Text>
              </AvatarFallback>
            </Avatar>
            <Text className="text-2xl font-bold text-foreground">
              {user.full_name}
            </Text>
            <Text className="text-muted-foreground">
              @{user.username}
            </Text>
          </View>

          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-muted-foreground">Email</Text>
                <Text className="text-foreground font-medium">
                  {user.ext_email}
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center">
                <Text className="text-muted-foreground">Role</Text>
                <Text className="text-foreground font-medium capitalize">
                  {user.role}
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center">
                <Text className="text-muted-foreground">Status</Text>
                <View className="flex-row items-center">
                  <View className={`w-2 h-2 rounded-full mr-2 ${user.is_active === '1' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <Text className="text-foreground font-medium">
                    {user.is_active === '1' ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Social Links */}
          {(user.socials.github_username || 
            user.socials.telegram_username || 
            user.socials.twitter_username || 
            user.socials.discord_username) && (
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.socials.github_username && (
                  <View className="flex-row justify-between items-center">
                    <Text className="text-muted-foreground">GitHub</Text>
                    <Text className="text-foreground font-medium">
                      @{user.socials.github_username}
                    </Text>
                  </View>
                )}
                
                {user.socials.telegram_username && (
                  <View className="flex-row justify-between items-center">
                    <Text className="text-muted-foreground">Telegram</Text>
                    <Text className="text-foreground font-medium">
                      @{user.socials.telegram_username}
                    </Text>
                  </View>
                )}
                
                {user.socials.twitter_username && (
                  <View className="flex-row justify-between items-center">
                    <Text className="text-muted-foreground">Twitter</Text>
                    <Text className="text-foreground font-medium">
                      @{user.socials.twitter_username}
                    </Text>
                  </View>
                )}
                
                {user.socials.discord_username && (
                  <View className="flex-row justify-between items-center">
                    <Text className="text-muted-foreground">Discord</Text>
                    <Text className="text-foreground font-medium">
                      {user.socials.discord_username}
                    </Text>
                  </View>
                )}
              </CardContent>
            </Card>
          )}

          {/* Logout Button */}
          <Button
            onPress={handleLogout}
            variant="destructive"
            className="w-full mt-8"
          >
            <Text>Sign Out</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
