import React from 'react';
import { Pressable, PressableProps, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface BadgeProps extends PressableProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  className?: string;
  selected?: boolean;
}

export function Badge({ 
  children, 
  variant = 'default', 
  className = '', 
  selected = false,
  ...props 
}: BadgeProps) {
  const { isDark } = useTheme();

  let bgStyle = '';
  let textStyle = '';

  // Determine effective variant
  let activeVariant = variant;
  if (selected) {
    activeVariant = 'default';
  }

  switch (activeVariant) {
    case 'default':
      // Active/Selected state mostly
      bgStyle = isDark ? 'bg-blue-600 border-blue-600' : 'bg-[#8B4513] border-[#8B4513]';
      textStyle = 'text-white font-bold';
      
      // If it's just a tag (not selectable/pressable) and NOT selected, revert to a softer look 
      // But if it IS selected, it must use the bold look above.
      if (!selected && !props.onPress) { 
         bgStyle = isDark ? 'bg-blue-600/20 border-blue-600/20' : 'bg-[#8B4513]/10 border-[#8B4513]/20';
         textStyle = isDark ? 'text-blue-400' : 'text-[#8B4513]';
      }
      break;
    case 'secondary':
      bgStyle = isDark ? 'bg-gray-800 border-gray-800' : 'bg-[#E6E6D8] border-[#E6E6D8]';
      textStyle = isDark ? 'text-gray-300' : 'text-[#3E3E34]';
      break;
    case 'outline':
      bgStyle = 'bg-transparent border';
      bgStyle += isDark ? ' border-gray-600' : ' border-[#D9D9C2]';
      textStyle = isDark ? 'text-gray-400' : 'text-[#8C8C7D]';
      break;
    case 'destructive':
        bgStyle = 'bg-red-500/10 border-red-500/20';
        textStyle = 'text-red-500';
        break;
  }
  
  // Explicitly handle "unselected" pressables (likely selection chips) to look distinct from "selected" ones
  if (!selected && props.onPress && activeVariant === 'default') {
      bgStyle = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#D9D9C2]';
      textStyle = isDark ? 'text-gray-300' : 'text-[#5C5C50]';
  }

  const Container = props.onPress ? Pressable : View;

  return (
    <Container 
        className={`px-3 py-1 rounded-full border items-center justify-center flex-row ${bgStyle} ${className}`}
        {...props}
    >
      {typeof children === 'string' ? (
        <Text className={`${textStyle} text-xs font-medium`}>{children}</Text>
      ) : (
        children
      )}
    </Container>
  );
}
