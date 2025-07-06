import React, { useState } from 'react';
import { TextInputProps, TouchableOpacity, View } from 'react-native';
import { Eye } from '~/lib/icons/Eye';
import { EyeOff } from '~/lib/icons/EyeOff';
import { Input } from './ui/input';

interface PasswordInputProps extends TextInputProps {
  className?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  className,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="relative">
      <Input
        {...props}
        className={className ? `${className} pr-12` : 'pr-12'}
        secureTextEntry={!showPassword}
      />
      <TouchableOpacity
        onPress={() => setShowPassword((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2"
        disabled={props.editable === false}
        accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5 text-muted-foreground" />
        ) : (
          <Eye className="w-5 h-5 text-muted-foreground" />
        )}
      </TouchableOpacity>
    </View>
  );
}; 