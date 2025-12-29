import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

const Navbar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View className="flex-row bg-dark-eval-1 bg-[#1E1E1E] border-t border-gray-800 pb-2 pt-3 justify-around items-center">
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

        return (
          <Pressable
            key={index}
            onPress={onPress}
            className="items-center justify-center space-y-1"
          >
             <Ionicons 
                name={iconName} 
                size={26} 
                color={isFocused ? '#E91E63' : '#A0A0A0'} 
             />
            <Text className={`text-xs ${isFocused ? 'text-[#E91E63]' : 'text-[#A0A0A0]'}`}>
              {label as string}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default Navbar;
