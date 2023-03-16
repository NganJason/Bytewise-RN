import 'react-native-gesture-handler';
import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@rneui/themed';

import SplashScreen from './src/Components/SplashScreen';
import HomeScreen from './src/Screens/HomeScreen';
import TransactionForm from './src/Screens/Transaction/TransactionForm';

import ROUTES from './src/_shared/constant/routes';
import { THEME } from './src/_shared/constant/theme';

const Stack = createStackNavigator();

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
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.log(e);
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
      </Stack.Navigator>
    );
  };

  return (
    <ThemeProvider theme={THEME}>
      <NavigationContainer theme={THEME}>{render()}</NavigationContainer>
    </ThemeProvider>
  );
}

export default App;
