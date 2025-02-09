import { useState, useEffect, useContext } from 'react';
import * as Font from 'expo-font';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@rneui/themed';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SplashScreen } from './src/Components';
import IntroScreen from './src/Screens/IntroScreen';
import HomeScreen from './src/Screens/HomeScreen';
import CategoryBreakdownScreen from './src/Screens/Category/CategoryBreakdownScreen';
import CategoryEditScreen from './src/Screens/Category/CategoryEditScreen';
import LoginScreen from './src/Screens/User/LoginScreen';
import SignupScreen from './src/Screens/User/SignupScreen';
import OtpScreen from './src/Screens/User/OtpScreen';
import WelcomeScreen from './src/Screens/Onboarding/WelcomeScreen';
import OnboardingScreen from './src/Screens/Onboarding/OnboardingScreen';
import CategoryForm from './src/Screens/Category/CategoryForm';
import BudgetForm from './src/Screens/Budget/BudgetForm';
import TransactionFormV2 from './src/Screens/Transaction/TransactionFormV2';
import AccountsOverviewScreen from './src/Screens/Insights/Charts/AccountsOverviewScreen';
import CategoriesOverviewScreen from './src/Screens/Insights/Charts/CategoriesOverviewScreen';
import { ConnectionChecker, CustomDrawer } from './src/Components/Common';

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
import BottomToast from './src/Components/Common/BottomToast';
import BudgetOnboardingForm from './src/Screens/Onboarding/BudgetOnboardingForm';
import InvestmentOnboardingForm from './src/Screens/Onboarding/InvestmentOnboardingForm';
import SetupSplashScreen from './src/Screens/Onboarding/SetupSplashScreen';
import FeedbackForm from './src/Screens/User/FeedbackForm';
import {
  UserMetaContext,
  UserMetaProvider,
} from './src/_shared/context/UserMetaContext';
import { useInitApp } from './src/_shared/hooks';

const LOCAL_BASE_URL = 'http://localhost:9090/api/v1';
const TEST_BASE_URL = 'https://pocketeer-be-test.onrender.com/api/v1';
const LIVE_BASE_URL = 'https://pocketeer-be-live.onrender.com/api/v1';
const BASE_URL = TEST_BASE_URL;

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const queryClient = new QueryClient();

const WAIT_TIME_FOR_SPLASH_SCREEN = 2000;

function Main() {
  const { isLogin } = useContext(AuthContext);
  const { isUserOnboarded, showSetupSplashScreen } =
    useContext(UserMetaContext);

  const [isAppReady, setIsAppReady] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  useInitApp();

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

  const renderOnboardingRoutes = () => {
    if (showSetupSplashScreen()) {
      return (
        <Stack.Screen
          name={ROUTES.setupSplashScreen}
          component={SetupSplashScreen}
        />
      );
    }

    if (!isUserOnboarded()) {
      return (
        <>
          <Stack.Screen name={ROUTES.welcome} component={WelcomeScreen} />
          <Stack.Screen name={ROUTES.onboarding} component={OnboardingScreen} />
        </>
      );
    }

    if (isUserOnboarded()) {
      return (
        <>
          <Stack.Screen
            name={ROUTES.homeWithDrawer}
            component={HomeWithDrawer}
          />
          <Drawer.Screen name={ROUTES.home} component={HomeScreen} />
          <Stack.Screen
            name={ROUTES.categoryEdit}
            component={CategoryEditScreen}
          />
          <Stack.Screen
            name={ROUTES.categoryBreakdown}
            component={CategoryBreakdownScreen}
          />
          <Stack.Screen
            name={ROUTES.accountBreakdown}
            component={AccountBreakdownScreen}
          />
          <Stack.Screen
            name={ROUTES.investmentBreakdown}
            component={InvestmentBreakdownScreen}
          />
          <Stack.Screen
            name={ROUTES.accountOverview}
            component={AccountsOverviewScreen}
          />
          <Stack.Screen
            name={ROUTES.categoryOverview}
            component={CategoriesOverviewScreen}
          />
        </>
      );
    }
  };

  const render = () => {
    if (showSplashScreen) {
      return <SplashScreen />;
    }

    if (isAppReady && !showSplashScreen) {
      return (
        <>
          <Stack.Navigator
            initialRouteName={ROUTES.homeWithDrawer}
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}>
            {!isLogin ? (
              <>
                <Stack.Screen name={ROUTES.intro} component={IntroScreen} />
                <Stack.Screen name={ROUTES.login} component={LoginScreen} />
                <Stack.Screen name={ROUTES.signup} component={SignupScreen} />
                <Stack.Screen name={ROUTES.otp} component={OtpScreen} />
              </>
            ) : (
              <>
                {renderOnboardingRoutes()}
                <Stack.Screen
                  name={ROUTES.categoryForm}
                  component={CategoryForm}
                />
                <Stack.Screen name={ROUTES.budgetForm} component={BudgetForm} />
                <Stack.Screen
                  name={ROUTES.transactionForm}
                  component={TransactionFormV2}
                />
                <Stack.Screen
                  name={ROUTES.accountForm}
                  component={AccountForm}
                />
                <Stack.Screen
                  name={ROUTES.accountSelection}
                  component={AccountSelectionScreen}
                />
                <Stack.Screen
                  name={ROUTES.holdingForm}
                  component={HoldingForm}
                />

                <Stack.Screen
                  name={ROUTES.budgetOnboardingForm}
                  component={BudgetOnboardingForm}
                />
                <Stack.Screen
                  name={ROUTES.investmentOnboardingForm}
                  component={InvestmentOnboardingForm}
                />
                <Stack.Screen
                  name={ROUTES.feedbackForm}
                  component={FeedbackForm}
                />
              </>
            )}
          </Stack.Navigator>
          <ConnectionChecker />
        </>
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
      drawerPosition: 'right',
    }}
    drawerContent={CustomDrawer}>
    <Drawer.Screen name={ROUTES.home} component={HomeScreen} />
  </Drawer.Navigator>
);

export default App;
