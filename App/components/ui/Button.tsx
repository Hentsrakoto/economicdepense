import React from 'react';
import { ActivityIndicator, Pressable, PressableProps, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface ButtonProps extends PressableProps {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  className?: string;
  textClassName?: string;
  loading?: boolean;
}

export function Button({ 
  variant = 'default', 
  size = 'default', 
  children, 
  className = '', 
  textClassName = '',
  loading = false,
  disabled,
  ...props 
}: ButtonProps) {
  const { isDark } = useTheme();

  // Background Styles
  let bgStyle = '';
  switch (variant) {
    case 'default':
      bgStyle = isDark ? 'bg-blue-600' : 'bg-[#8B4513]';
      break;
    case 'destructive':
      bgStyle = 'bg-red-500';
      break;
    case 'outline':
      bgStyle = isDark ? 'bg-transparent border border-gray-700' : 'bg-transparent border border-[#E6E6D8]';
      break;
    case 'ghost':
      bgStyle = 'bg-transparent';
      break;
    case 'secondary':
      bgStyle = isDark ? 'bg-gray-800' : 'bg-[#F2F2EB]';
      break;
  }

  // Size Styles
  let sizeStyle = '';
  switch (size) {
    case 'default':
      sizeStyle = 'px-4 py-3';
      break;
    case 'sm':
      sizeStyle = 'px-3 py-2';
      break;
    case 'lg':
      sizeStyle = 'px-8 py-4';
      break;
    case 'icon':
      sizeStyle = 'h-10 w-10 justify-center items-center p-0';
      break;
  }

  // Text Styles
  let textStyle = '';
  if (variant === 'default' || variant === 'destructive') {
    textStyle = 'text-white font-bold';
  } else if (variant === 'outline' || variant === 'ghost') {
    textStyle = isDark ? 'text-white' : 'text-[#3E3E34]';
  } else if (variant === 'secondary') {
    textStyle = isDark ? 'text-gray-200' : 'text-[#3E3E34]';
  }

  const opacity = disabled || loading ? 'opacity-50' : 'opacity-100';

  return (
    <Pressable
      className={`rounded-xl flex-row justify-center items-center ${bgStyle} ${sizeStyle} ${opacity} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <ActivityIndicator size="small" color={variant === 'outline' || variant === 'ghost' ? (isDark ? 'white' : 'black') : 'white'} className="mr-2" />}
      {typeof children === 'string' ? (
        <Text className={`${textStyle} text-base font-medium ${textClassName}`}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
