import { useState, useEffect, useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@rneui/themed';

import HomeScreen from './src/Screens/HomeScreen';

import ROUTES from './src/_shared/constant/routes';
import { THEME } from './src/_shared/constant/theme';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await Font.loadAsync(
          'ZenKakuGothicNewBlack',
          require('./assets/fonts/ZenKakuGothicNew-Black.ttf'),
        );

        await Font.loadAsync(
          'ZenKakuGothicNewBlack',
          require('./assets/fonts/ZenKakuGothicNew-Black.ttf'),
        );

        await Font.loadAsync(
          'ZenKakuGothicNewBold',
          require('./assets/fonts/ZenKakuGothicNew-Bold.ttf'),
        );

        await Font.loadAsync(
          'ZenKakuGothicNewLight',
          require('./assets/fonts/ZenKakuGothicNew-Light.ttf'),
        );

        await Font.loadAsync(
          'ZenKakuGothicNewMedium',
          require('./assets/fonts/ZenKakuGothicNew-Medium.ttf'),
        );

        await Font.loadAsync(
          'ZenKakuGothicNewRegular',
          require('./assets/fonts/ZenKakuGothicNew-Regular.ttf'),
        );

        // Custom icon font
        await Font.loadAsync(
          'Nucleo',
          require('./assets/icons/fonts/Nucleo.ttf'),
        );

        // TODO: REMOVE IN PROD
        // USED TO MOCK SLOW LOAD TO SEE SPLASH SCREEN
        // await new Promise(resolve => setTimeout(resolve, 500));
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

  if (!isAppReady) {
    return null;
  }

  return (
    <ThemeProvider theme={THEME}>
      <NavigationContainer theme={THEME}>
        <Stack.Navigator
          initialRouteName={ROUTES.home}
          screenOptions={{ headerShown: false, animation: 'none' }}>
          <Stack.Screen name={ROUTES.home}>
            {props => <HomeScreen {...props} onLayout={onLayoutRootView} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default App;
