import { useState, useEffect, useContext } from 'react';
import * as Font from 'expo-font';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@rneui/themed';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SplashScreen } from './src/Components';
import HomeScreen from './src/Screens/HomeScreen';
import CategoryBreakdownScreen from './src/Screens/Category/CategoryBreakdownScreen';
import CategoryEditScreen from './src/Screens/Category/CategoryEditScreen';
import LoginScreen from './src/Screens/User/LoginScreen';
import SignupScreen from './src/Screens/User/SignupScreen';
import CategoryForm from './src/Screens/Category/CategoryForm';
import TransactionForm from './src/Screens/Transaction/TransactionForm';
import { CustomDrawer } from './src/Components/Common';

import ROUTES from './src/_shared/constant/routes';
import { THEME } from './src/_shared/constant/theme';
import { initAxios } from './src/_shared/apis/http';
import { AuthContext, AuthProvider } from './src/_shared/context/AuthContext';
import BudgetScreen from './src/Screens/Budget/BudgetScreen';
import BudgetForm from './src/Screens/Budget/BudgetForm';
import AccountSelectionScreen from './src/Screens/Account/AccountSelectionScreen';
import AccountForm from './src/Screens/Account/AccountForm';
import AccountBreakdownScreen from './src/Screens/Account/AccountBreakdownScreen';
import InvestmentBreakdownScreen from './src/Screens/Account/Investment/InvestmentBreakdownScreen';
import HoldingForm from './src/Screens/Account/Investment/HoldingForm';
import HoldingBreakdownScreen from './src/Screens/Account/Investment/HoldingBreakdownScreen';
import LotForm from './src/Screens/Account/Investment/LotForm';
import { BottomToastProvider } from './src/_shared/context/BottomToastContext';
import BottomToast from './src/Components/Common/BottomToast';

const TEST_BASE_URL = 'https://pocketeer-be.onrender.com/api/v1';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const queryClient = new QueryClient();

const WAIT_TIME_FOR_SPLASH_SCREEN = 2000;

function Main() {
  const { isLogin } = useContext(AuthContext);

  const [isAppReady, setIsAppReady] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplashScreen(false);
    }, WAIT_TIME_FOR_SPLASH_SCREEN);

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
      } catch (err) {
        // TODO: Handle error
        console.log(err);
      } finally {
        // clearTimeout(timer);
        // setShowSplashScreen(false);
        setIsAppReady(true);
      }
    }

    init();
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const render = () => {
    if (showSplashScreen) {
      return <SplashScreen />;
    }

    if (isAppReady && !showSplashScreen) {
      return (
        <Stack.Navigator
          initialRouteName={ROUTES.homeWithDrawer}
          screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          {isLogin ? (
            <>
              <Stack.Screen
                name={ROUTES.homeWithDrawer}
                component={HomeWithDrawer}
              />
              <Stack.Screen
                name={ROUTES.categoryForm}
                component={CategoryForm}
              />
              <Stack.Screen name={ROUTES.budgetList} component={BudgetScreen} />
              <Stack.Screen name={ROUTES.budgetForm} component={BudgetForm} />
              <Stack.Screen
                name={ROUTES.transactionForm}
                component={TransactionForm}
              />
              <Stack.Screen
                name={ROUTES.categoryEdit}
                component={CategoryEditScreen}
              />
              <Stack.Screen
                name={ROUTES.categoryBreakdown}
                component={CategoryBreakdownScreen}
              />
              <Stack.Screen
                name={ROUTES.accountSelection}
                component={AccountSelectionScreen}
              />
              <Stack.Screen name={ROUTES.accountForm} component={AccountForm} />
              <Stack.Screen
                name={ROUTES.accountBreakdown}
                component={AccountBreakdownScreen}
              />
              <Stack.Screen
                name={ROUTES.investmentBreakdown}
                component={InvestmentBreakdownScreen}
              />
              <Stack.Screen name={ROUTES.holdingForm} component={HoldingForm} />
              <Stack.Screen name={ROUTES.lotForm} component={LotForm} />
              <Stack.Screen
                name={ROUTES.holdingBreakdown}
                component={HoldingBreakdownScreen}
              />
            </>
          ) : (
            <>
              <Stack.Screen name={ROUTES.login} component={LoginScreen} />
              <Stack.Screen name={ROUTES.signup} component={SignupScreen} />
            </>
          )}
        </Stack.Navigator>
      );
    }

    return <></>;
  };

  return (
    <ThemeProvider theme={THEME}>
      <BottomToastProvider>
        <SafeAreaProvider>
          <NavigationContainer theme={THEME}>{render()}</NavigationContainer>
          <BottomToast />
        </SafeAreaProvider>
      </BottomToastProvider>
    </ThemeProvider>
  );
}

const App = () => {
  initAxios({
    baseURL: TEST_BASE_URL,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </QueryClientProvider>
  );
};

const HomeWithDrawer = () => (
  <Drawer.Navigator
    screenOptions={{
      swipeEnabled: false,
      headerShown: false,
      drawerPosition: 'left',
    }}
    drawerContent={CustomDrawer}>
    <Drawer.Screen name={ROUTES.home} component={HomeScreen} />
  </Drawer.Navigator>
);

export default App;
