import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService, ChangePasswordRequest, UpdateUserInfoRequest, UserInfo } from './api';

interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (data: UpdateUserInfoRequest) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_info';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored authentication data on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        apiService.setToken(storedToken);
      }
    } catch (error) {
        console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login({
        user: email,
        pass: password,
      });

      const { token: newToken, user_info } = response.res;

      // Store authentication data
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, newToken),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(user_info)),
      ]);

      setToken(newToken);
      setUser(user_info);
      apiService.setToken(newToken);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      
      // Clear stored data
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);

      setToken(null);
      setUser(null);
      apiService.clearToken();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await apiService.refreshUserInfo();
      const { user_info, renew_token } = response.res;

      // Store updated authentication data
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, renew_token.token),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(user_info)),
      ]);

      setToken(renew_token.token);
      setUser(user_info);
      apiService.setToken(renew_token.token);
    } catch (error) {
      console.error('Refresh user error:', error);
      throw error;
    }
  };

  const updateUser = async (data: UpdateUserInfoRequest) => {
    try {
      await apiService.updateUserInfo(data);
      // Refresh user data after successful update
      await refreshUser();
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    try {
      const data: ChangePasswordRequest = {
        cur_pass: currentPassword,
        new_pass: newPassword,
        retype_new_pass: confirmPassword,
      };
      
      await apiService.changePassword(data);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    refreshUser,
    updateUser,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 