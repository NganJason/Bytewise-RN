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
import OtpScreen from './src/Screens/User/OtpScreen';
import WelcomeScreen from './src/Screens/Onboarding/WelcomeScreen';
import OnboardingScreen from './src/Screens/Onboarding/OnboardingScreen';
import CategoryForm from './src/Screens/Category/CategoryForm';
import TransactionForm from './src/Screens/Transaction/TransactionForm';
import { CustomDrawer } from './src/Components/Common';

import ROUTES from './src/_shared/constant/routes';
import { THEME } from './src/_shared/constant/theme';
import { initAxios } from './src/_shared/apis/http';
import {
  AuthContext,
  AuthProvider,
  BottomToastProvider,
  OnboardingDataProvider,
} from './src/_shared/context';
import AccountSelectionScreen from './src/Screens/Account/AccountSelectionScreen';
import AccountForm from './src/Screens/Account/AccountForm';
import AccountBreakdownScreen from './src/Screens/Account/AccountBreakdownScreen';
import InvestmentBreakdownScreen from './src/Screens/Account/Investment/InvestmentBreakdownScreen';
import HoldingForm from './src/Screens/Account/Investment/HoldingForm';
import HoldingBreakdownScreen from './src/Screens/Account/Investment/HoldingBreakdownScreen';
import LotForm from './src/Screens/Account/Investment/LotForm';
import BottomToast from './src/Components/Common/BottomToast';
import CategoryOverviewScreen from './src/Screens/Category/CategoryOverviewScreen';
import BudgetOnboardingForm from './src/Screens/Onboarding/BudgetOnboardingForm';
import InvestmentOnboardingForm from './src/Screens/Onboarding/InvestmentOnboardingForm';
import {
  UserMetaContext,
  UserMetaProvider,
} from './src/_shared/context/UserMetaContext';

const LOCAL_BASE_URL = 'http://localhost:9090/api/v1';
const TEST_BASE_URL = 'https://pocketeer-be.onrender.com/api/v1';
const BASE_URL = LOCAL_BASE_URL;

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const queryClient = new QueryClient();

const WAIT_TIME_FOR_SPLASH_SCREEN = 2000;

function Main() {
  const { isLogin } = useContext(AuthContext);
  const { isUserNew } = useContext(UserMetaContext);

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
        setIsAppReady(true);
      }
    }

    init();
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const renderPrivateRoute = () => {
    if (!isLogin) {
      return (
        <>
          <Stack.Screen name={ROUTES.login} component={LoginScreen} />
          <Stack.Screen name={ROUTES.signup} component={SignupScreen} />
          <Stack.Screen name={ROUTES.otp} component={OtpScreen} />
        </>
      );
    }

    if (isUserNew) {
      return (
        <>
          <Stack.Screen name={ROUTES.welcome} component={WelcomeScreen} />
          <Stack.Screen name={ROUTES.onboarding} component={OnboardingScreen} />
        </>
      );
    }

    return (
      <>
        <Stack.Screen name={ROUTES.homeWithDrawer} component={HomeWithDrawer} />
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
          name={ROUTES.categoriesOverview}
          component={CategoryOverviewScreen}
        />
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
    );
  };

  const render = () => {
    if (showSplashScreen) {
      return <SplashScreen />;
    }

    if (isAppReady && !showSplashScreen) {
      return (
        <Stack.Navigator
          initialRouteName={ROUTES.homeWithDrawer}
          screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          {renderPrivateRoute()}
          <Stack.Screen name={ROUTES.categoryForm} component={CategoryForm} />
          <Stack.Screen
            name={ROUTES.budgetOnboardingForm}
            component={BudgetOnboardingForm}
          />
          <Stack.Screen
            name={ROUTES.investmentOnboardingForm}
            component={InvestmentOnboardingForm}
          />
          <Stack.Screen
            name={ROUTES.accountSelection}
            component={AccountSelectionScreen}
          />
          <Stack.Screen name={ROUTES.accountForm} component={AccountForm} />
        </Stack.Navigator>
      );
    }

    return <></>;
  };

  return (
    <ThemeProvider theme={THEME}>
      <BottomToastProvider>
        <OnboardingDataProvider>
          <SafeAreaProvider>
            <NavigationContainer theme={THEME}>{render()}</NavigationContainer>
            <BottomToast />
          </SafeAreaProvider>
        </OnboardingDataProvider>
      </BottomToastProvider>
    </ThemeProvider>
  );
}

const App = () => {
  initAxios({
    baseURL: BASE_URL,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <UserMetaProvider>
        <AuthProvider>
          <Main />
        </AuthProvider>
      </UserMetaProvider>
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
