import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "./global.css";

import Navbar from './App/components/Navbar';
import { TransactionProvider } from './App/hooks/useTransactions';
import AnalyticsScreen from './App/screens/AnalyticsScreen';
import ExpensesScreen from './App/screens/ExpensesScreen';
import HistoryScreen from './App/screens/HistoryScreen';
import HomeScreen from './App/screens/HomeScreen';
import IncomeScreen from './App/screens/IncomeScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TransactionProvider>
        <NavigationContainer>
          <Tab.Navigator
            tabBar={(props) => <Navbar {...props} />}
            screenOptions={{
              headerShown: false,
            }}
          >
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
            <Tab.Screen name="Expenses" component={ExpensesScreen} options={{ title: 'Dépenses' }} />
            <Tab.Screen name="Incomes" component={IncomeScreen} options={{ title: 'Revenus' }} />
            <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Budget' }} />
            <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'Historique' }} />
          </Tab.Navigator>
          <StatusBar style="light" />
        </NavigationContainer>
      </TransactionProvider>
    </GestureHandlerRootView>
  );
}
