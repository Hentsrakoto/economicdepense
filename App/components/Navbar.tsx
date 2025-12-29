import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useUser } from '../context/UserContext';
import { useTheme } from '../hooks/useTheme';

  const Navbar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { toggleTheme } = useUser();
  const theme = useTheme();
  const { isDark } = theme;

  const bgColor = isDark ? 'bg-[#1E1E1E] border-gray-800' : 'bg-[#F2F2EB] border-[#D9D9C2]';
  const activeColor = isDark ? '#E91E63' : '#8B4513';
  const inactiveColor = isDark ? '#A0A0A0' : '#8C8C7D';

  return (
    <View className={`flex-row border-t pb-2 pt-3 justify-around items-center ${bgColor}`}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        let iconName: keyof typeof Ionicons.glyphMap = 'home';
        if (route.name === 'Home') iconName = isFocused ? 'home' : 'home-outline';
        else if (route.name === 'Expenses') iconName = isFocused ? 'card' : 'card-outline';
        else if (route.name === 'Incomes') iconName = isFocused ? 'cash' : 'cash-outline'; 
        else if (route.name === 'Analytics') iconName = isFocused ? 'pie-chart' : 'pie-chart-outline';
        else if (route.name === 'History') iconName = isFocused ? 'time' : 'time-outline';
        else if (route.name === 'Settings') iconName = isFocused ? 'settings' : 'settings-outline';

        const color = isFocused ? activeColor : inactiveColor;

        return (
          <Pressable
            key={index}
            onPress={onPress}
            className="items-center justify-center space-y-1"
          >
             <Ionicons 
                name={iconName} 
                size={26} 
                color={color} 
             />
            <Text style={{ color }} className="text-xs">
              {label as string}
            </Text>
          </Pressable>
        );
      })}
      
      {/* Theme Toggle Button */}
      <Pressable
        onPress={toggleTheme}
        className="items-center justify-center space-y-1"
      >
         <Ionicons 
            name={isDark ? 'sunny' : 'moon'} 
            size={26} 
            color={inactiveColor} 
         />
        <Text style={{ color: inactiveColor }} className="text-xs">
          {isDark ? 'Light' : 'Dark'}
        </Text>
      </Pressable>
    </View>
  );
};

export default Navbar;
