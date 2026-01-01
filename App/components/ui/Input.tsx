import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function Input({ 
  label, 
  error, 
  className = '', 
  containerClassName = '',
  ...props 
}: InputProps) {
  const { isDark } = useTheme();

  const bgStyle = isDark ? 'bg-[#121212] border-gray-700' : 'bg-[#F9F9F5] border-[#D9D9C2]';
  const textStyle = isDark ? 'text-white' : 'text-[#3E3E34]';
  const labelStyle = isDark ? 'text-[#A0A0A0]' : 'text-[#8C8C7D]';
  const placeholderColor = isDark ? '#6b7280' : '#A0A0A0';

  return (
    <View className={`space-y-1.5 ${containerClassName}`}>
      {label && <Text className={`text-sm font-medium ${labelStyle}`}>{label}</Text>}
      <TextInput
        placeholderTextColor={placeholderColor}
        className={`w-full p-3 rounded-xl border ${bgStyle} ${textStyle} ${className}`}
        {...props}
      />
      {error && <Text className="text-red-500 text-xs">{error}</Text>}
    </View>
  );
}
