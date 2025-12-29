import React from 'react';
import { View } from 'react-native';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-1 bg-dark-bg">
      {children}
    </View>
  );
}
