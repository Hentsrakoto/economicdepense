import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { useUser } from '../context/UserContext';
import { useTheme } from '../hooks/useTheme';

const Navbar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { toggleTheme } = useUser();
  const theme = useTheme();
  const { isDark } = theme;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuScale = useSharedValue(0);
  const menuOpacity = useSharedValue(0);

  const toggleMenu = () => {
    const isOpen = !isMenuOpen;
    setIsMenuOpen(isOpen);
    menuScale.value = withSpring(isOpen ? 1 : 0, { damping: 15 });
    menuOpacity.value = withTiming(isOpen ? 1 : 0, { duration: 200 });
  };

  const animatedMenuStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: menuScale.value }],
      opacity: menuOpacity.value,
    };
  });

  const bgColor = isDark ? 'bg-[#1E1E1E] border-gray-800' : 'bg-[#F2F2EB] border-[#D9D9C2]';
  const menuBgColor = isDark ? 'bg-[#2C2C2C]' : 'bg-white';
  const activeColor = isDark ? '#E91E63' : '#8B4513';
  const inactiveColor = isDark ? '#A0A0A0' : '#8C8C7D';
  const borderColor = isDark ? 'border-gray-700' : 'border-[#E6E6D8]';

  return (
    <View className="z-50">
       {/* Animated Menu */}
       <Animated.View 
            style={[animatedMenuStyle, styles.menuContainer]} 
            className={`absolute bottom-20 right-5 p-4 rounded-2xl shadow-xl border ${menuBgColor} ${borderColor}`}
       >
           {/* Settings Item */}
           <Pressable 
                onPress={() => {
                    toggleMenu();
                    navigation.navigate('Settings');
                }}
                className="flex-row items-center space-x-3 mb-3"
            >
               <Ionicons name="settings-outline" size={24} color={inactiveColor} />
               <Text className={`${isDark ? 'text-white' : 'text-[#3E3E34]'} font-medium`}>Paramètres</Text>
           </Pressable>

           <View className={`h-[1px] w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} mb-3`} />

           {/* Theme Item */}
           <Pressable 
                onPress={toggleTheme}
                className="flex-row items-center space-x-3"
            >
               <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={24} color={inactiveColor} />
               <Text className={`${isDark ? 'text-white' : 'text-[#3E3E34]'} font-medium`}>
                   {isDark ? 'Mode Clair' : 'Mode Sombre'}
               </Text>
           </Pressable>
       </Animated.View>

      <View className={`flex-row border-t pb-2 pt-3 justify-around items-center ${bgColor}`}>
        {state.routes.map((route, index) => {
          // Hide Settings from main bar
          if (route.name === 'Settings') return null;

          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
             // Close menu if open when clicking other tabs
            if (isMenuOpen) toggleMenu();

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
        
        {/* Hamburger Menu Button (Replaces Toggle) */}
        <Pressable
          onPress={toggleMenu}
          className="items-center justify-center space-y-1"
        >
           <Ionicons 
              name={isMenuOpen ? 'close' : 'menu'} 
              size={28} 
              color={isMenuOpen ? activeColor : inactiveColor} 
           />
          <Text style={{ color: isMenuOpen ? activeColor : inactiveColor }} className="text-xs">
            Menu
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    menuContainer: {
        minWidth: 160,
        transformOrigin: 'bottom right', // This might not work in RN directly without newer reanimated, but scale from center is default. 
        // We will stick to simple scale for now.
    }
});

export default Navbar;
