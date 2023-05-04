import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import * as Sentry from 'sentry-expo';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@rneui/themed';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SENTRY_DSN } from '@env';

import { SplashScreen } from './src/Components';

import HomeScreen from './src/Screens/HomeScreen';
import CashAccountScreen from './src/Screens/Equity/CashAccountScreen';
import InvestmentAccountScreen from './src/Screens/Equity/InvestmentAccountScreen';
import InvestmentLotBreakdownScreen from './src/Screens/Equity/InvestmentLotBreakdownScreen';
import CategoryBreakdownScreen from './src/Screens/Category/CategoryBreakdownScreen';
import CategoryEditScreen from './src/Screens/Category/CategoryEditScreen';

import CategoryForm from './src/Screens/Category/CategoryForm';
import BudgetForm from './src/Screens/Budget/BudgetForm';
import TransactionForm from './src/Screens/Transaction/TransactionForm';

import ROUTES from './src/_shared/constant/routes';
import { THEME } from './src/_shared/constant/theme';
import { initBackend } from './backend/backend';
import BudgetScreen from './src/Screens/Budget/BudgetScreen';

Sentry.init({
  enableInExpoDevelopment: true,
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const Stack = createStackNavigator();
const queryClient = new QueryClient();

function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await Font.loadAsync(
          'InterBlack',
          require('./assets/fonts/inter/Inter-Black.ttf'),
        );

        await Font.loadAsync(
          'InterExtraBold',
          require('./assets/fonts/inter/Inter-ExtraBold.ttf'),
        );

        await Font.loadAsync(
          'InterBold',
          require('./assets/fonts/inter/Inter-Bold.ttf'),
        );

        await Font.loadAsync(
          'InterSemiBold',
          require('./assets/fonts/inter/Inter-SemiBold.ttf'),
        );

        await Font.loadAsync(
          'InterMedium',
          require('./assets/fonts/inter/Inter-Medium.ttf'),
        );

        await Font.loadAsync(
          'InterRegular',
          require('./assets/fonts/inter/Inter-Regular.ttf'),
        );

        await Font.loadAsync(
          'InterLight',
          require('./assets/fonts/inter/Inter-Light.ttf'),
        );

        // Custom icon font
        await Font.loadAsync(
          'Nucleo',
          require('./assets/icons/fonts/Nucleo.ttf'),
        );

        try {
          initBackend();
        } catch (err) {
          // TODO: Handle error
          console.log(err);
        }

        // TODO: REMOVE IN PROD
        // USED TO MOCK SLOW LOAD TO SEE SPLASH SCREEN
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (err) {
        console.log(err);
      } finally {
        setIsAppReady(true);
      }
    }

    init();
  }, []);

  const render = () => {
    if (!isAppReady) {
      return <SplashScreen />;
    }
    return (
      <Stack.Navigator
        initialRouteName={ROUTES.home}
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name={ROUTES.home} component={HomeScreen} />
        <Stack.Screen
          name={ROUTES.transactionForm}
          component={TransactionForm}
        />
        <Stack.Screen
          name={ROUTES.categoryEdit}
          component={CategoryEditScreen}
        />
        <Stack.Screen name={ROUTES.categoryForm} component={CategoryForm} />
        <Stack.Screen name={ROUTES.budgetList} component={BudgetScreen} />
        <Stack.Screen name={ROUTES.budgetForm} component={BudgetForm} />
        <Stack.Screen
          name={ROUTES.categoryBreakdown}
          component={CategoryBreakdownScreen}
        />
        <Stack.Screen name={ROUTES.cashAccount} component={CashAccountScreen} />
        <Stack.Screen
          name={ROUTES.investmentAccount}
          component={InvestmentAccountScreen}
        />
        <Stack.Screen
          name={ROUTES.investmentLotBreakdown}
          component={InvestmentLotBreakdownScreen}
        />
      </Stack.Navigator>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={THEME}>
        <SafeAreaProvider>
          <NavigationContainer theme={THEME}>{render()}</NavigationContainer>
        </SafeAreaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
