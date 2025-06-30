import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { Text } from '~/components/ui/text';
import { ChevronDown } from '~/lib/icons/ChevronDown';
import { ChevronUp } from '~/lib/icons/ChevronUp';
import { useAuth } from '~/services/auth-context';

export default function AccountScreen() {
  const { user, logout, isAuthenticated, refreshUser } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showProfile, setShowProfile] = useState(true);
  const [showSocial, setShowSocial] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
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
          <Text className="text-lg text-muted-foreground">Not authenticated</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#3b82f6']}
            tintColor={'#3b82f6'}
          />
        }
      >
        {/* Profile Header */}
        <View className="flex-row items-center mb-4 px-2">
          <Avatar alt={user.full_name} className="w-16 h-16 mr-4 border-2 border-border">
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
          <View>
            <Text className="text-xl font-bold text-foreground">{user.full_name}</Text>
            <Text className="text-muted-foreground">@{user.username}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="flex-row mb-4 px-2">
          <Button
            onPress={() => router.push('/edit-profile')}
            variant="outline"
            className="flex-1"
          >
            <Text className="font-medium">Edit Profile</Text>
          </Button>
        </View>

        {/* Profile Information - Collapsible */}
        <Card className="mb-4 mx-2">
          <Collapsible open={showProfile}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                onPress={() => setShowProfile(!showProfile)}
                className="w-full flex-row justify-between items-center py-3"
              >
                <Text className="font-semibold">Profile Information</Text>
                {showProfile ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <View className="p-4 space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted-foreground">External Email</Text>
                  <Text className="text-foreground">{user.ext_email}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted-foreground">Gender</Text>
                  <Text className="text-foreground">
                    {user.gender === 'm' ? 'Male' : user.gender === 'f' ? 'Female' : 'Not specified'}
                  </Text>
                </View>
              </View>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Social Links - Collapsible */}
        <Card className="mb-4 mx-2">
          <Collapsible open={showSocial}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                onPress={() => setShowSocial(!showSocial)}
                className="w-full flex-row justify-between items-center py-3"
              >
                <Text className="font-semibold">Social Connections</Text>
                {showSocial ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <View className="p-4 space-y-2">
                {[
                  { label: 'GitHub', value: user.socials.github_username, prefix: '@' },
                  { label: 'Telegram', value: user.socials.telegram_username, prefix: '@' },
                  { label: 'Twitter', value: user.socials.twitter_username, prefix: '@' },
                  { label: 'Discord', value: user.socials.discord_username, prefix: '' },
                ].map((social, index) => (
                  <View key={index} className="flex-row justify-between">
                    <Text className="text-sm text-muted-foreground">{social.label}</Text>
                    <Text className="text-foreground">
                      {social.value ? `${social.prefix}${social.value}` : 'Not connected'}
                    </Text>
                  </View>
                ))}
              </View>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Security Actions */}
        <Card className="mb-4 mx-2">
          <View className="p-4 space-y-2">
            <Button
              onPress={() => router.push('/change-password')}
              variant="outline"
              className="w-full mb-4"
            >
              <Text className="font-medium">Change Password</Text>
            </Button>
            <Button
              onPress={handleLogout}
              variant="destructive"
              className="w-full"
            >
              <Text className="font-medium">Sign Out</Text>
            </Button>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
