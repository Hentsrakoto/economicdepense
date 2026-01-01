import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "./global.css";

import { ActivityIndicator, View } from 'react-native';
import Navbar from './App/components/Navbar';
import { UserProvider, useUser } from './App/context/UserContext';
import { TransactionProvider } from './App/hooks/useTransactions';
import AnalyticsScreen from './App/screens/AnalyticsScreen';
import ExpensesScreen from './App/screens/ExpensesScreen';
import HistoryScreen from './App/screens/HistoryScreen';
import HomeScreen from './App/screens/HomeScreen';
import IncomeScreen from './App/screens/IncomeScreen';
import OnboardingScreen from './App/screens/OnboardingScreen';
import SettingsScreen from './App/screens/SettingsScreen';
import { translations } from './App/utils/i18n';

const Tab = createMaterialTopTabNavigator();

function RootNavigator() {
  const { settings, loading } = useUser();
  const t = translations[settings.language] || translations.fr;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111827' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!settings.isOnboarded) {
    return <OnboardingScreen />;
  }

  return (
    <TransactionProvider>
      <NavigationContainer>
        <Tab.Navigator
          tabBarPosition="bottom"
          tabBar={(props) => <Navbar {...props} />}
          initialRouteName="Home"
          screenOptions={{
            swipeEnabled: true,
            tabBarIndicatorStyle: { height: 0 }, // Hide default indicator if any
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} options={{ title: t.home }} />
          <Tab.Screen name="Expenses" component={ExpensesScreen} options={{ title: t.expenses }} />
          <Tab.Screen name="Incomes" component={IncomeScreen} options={{ title: t.incomes }} />
          <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ title: t.budget }} />
          <Tab.Screen name="History" component={HistoryScreen} options={{ title: t.history }} />
          <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: t.settings }} />
        </Tab.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </TransactionProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <UserProvider>
          <RootNavigator />
        </UserProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
