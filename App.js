import { useState, useEffect, useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

import ScreenTemplate from './src/Components/ScreenTemplate';
import LandingScreen from './src/Screens/LandingScreen';
import HomeScreen from './src/Screens/Home/HomeScreen';

import ROUTES from './src/_shared/constant/routes';
import { COLORS } from './src/_shared/constant/theme';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    background: COLORS.lightGray,
    text: COLORS.gray,
  },
};

function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        // Load outline icon font
        await Font.loadAsync(
          'antoutline',
          require('@ant-design/icons-react-native/fonts/antoutline.ttf'),
        );

        // Load fill icon font
        await Font.loadAsync(
          'antfill',
          require('@ant-design/icons-react-native/fonts/antfill.ttf'),
        );

        // TODO: REMOVE IN PROD
        // USED TO MOCK SLOW LOAD TO SEE SPLASH SCREEN
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.log(e);
      } finally {
        setIsAppReady(true);
      }
    }

    init();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isAppReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  const wrapScreenTemplate = children => (
    <ScreenTemplate onLayout={onLayoutRootView}>{children}</ScreenTemplate>
  );

  if (!isAppReady) {
    return null;
  }

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName={ROUTES.landing}
        screenOptions={{ headerShown: false, animation: 'none' }}>
        <Stack.Screen
          name={ROUTES.landing}
          children={() => wrapScreenTemplate(<LandingScreen />)}
        />
        <Stack.Screen
          name={ROUTES.home}
          children={() => wrapScreenTemplate(<HomeScreen />)}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
