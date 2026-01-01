import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '', style, ...props }: CardProps) {
  const { isDark } = useTheme();
  
  const baseStyle = isDark 
    ? 'bg-[#1E1E1E] border-gray-800' 
    : 'bg-white border-[#E6E6D8]';

  return (
    <View 
      className={`p-4 rounded-xl border shadow-sm ${baseStyle} ${className}`} 
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <View className={`mb-4 ${className}`}>{children}</View>;
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  // const { isDark } = useTheme(); // removed unused
  // const textColor = isDark ? 'text-white' : 'text-[#3E3E34]'; // removed unused
  
  return <View className={`${className}`}><React.Fragment>{children}</React.Fragment></View>; // Ideally Text, but children might be complex
}

export function CardContent({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <View className={`${className}`}>{children}</View>;
}
