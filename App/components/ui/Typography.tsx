import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption';
  className?: string;
}

export function Typography({ 
  children, 
  variant = 'body', 
  className = '', 
  style,
  ...props 
}: TypographyProps) {
  const { isDark } = useTheme();
  
  const baseColor = isDark ? 'text-white' : 'text-[#3E3E34]';
  const mutedColor = isDark ? 'text-gray-400' : 'text-[#8C8C7D]';

  let textStyle = '';

  switch (variant) {
    case 'h1':
      textStyle = `text-4xl font-extrabold ${baseColor}`;
      break;
    case 'h2':
      textStyle = `text-3xl font-bold ${baseColor}`;
      break;
    case 'h3':
      textStyle = `text-xl font-bold ${baseColor}`;
      break;
    case 'h4':
      textStyle = `text-lg font-semibold ${baseColor}`;
      break;
    case 'body':
      textStyle = `text-base ${baseColor}`;
      break;
    case 'caption':
      textStyle = `text-sm ${mutedColor}`;
      break;
  }

  return (
    <RNText className={`${textStyle} ${className}`} style={style} {...props}>
      {children}
    </RNText>
  );
}
