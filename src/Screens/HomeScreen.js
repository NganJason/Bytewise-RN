import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@rneui/themed';
import { createIconSet } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import ScreenTemplate from '../Components/ScreenTemplate';
import BudgetScreen from './Budget/BudgetScreen';
import AssetScreen from './Asset/AssetScreen';
import TransactionScreen from './Transaction/TransactionScreen';
import SettingScreen from './Setting/SettingScreen';

import ROUTES from '../_shared/constant/routes';

import glyphMap from '../../assets/icons/unicodesMap.json';

const Tab = createBottomTabNavigator();
const Icon = createIconSet(glyphMap, 'Nucleo');

const HomeScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const wrapScreenTemplate = children => (
    <ScreenTemplate>{children}</ScreenTemplate>
  );

  const renderTabIcon = (routeName, { color, size }) => {
    let iconName;
    switch (routeName) {
      case ROUTES.budget:
        iconName = 'icon-budget';
        break;
      case ROUTES.transaction:
        iconName = 'icon-transaction';
        break;
      case ROUTES.asset:
        iconName = 'icon-asset';
        break;
      case ROUTES.settings:
        iconName = 'icon-settings';
        break;
    }
    return (
      <Icon
        name={iconName}
        color={color}
        size={size}
        style={styles.tabBarIcon}
      />
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.inactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ _, color, size }) =>
          renderTabIcon(route.name, { color, size }),
      })}>
      <Tab.Screen
        name={ROUTES.budget}
        children={() => wrapScreenTemplate(<BudgetScreen />)}
      />
      <Tab.Screen
        name={ROUTES.transaction}
        children={() => wrapScreenTemplate(<TransactionScreen />)}
      />
      <Tab.Screen
        name={ROUTES.asset}
        children={() => wrapScreenTemplate(<AssetScreen />)}
      />
      <Tab.Screen
        name={ROUTES.settings}
        children={() => wrapScreenTemplate(<SettingScreen />)}
      />
    </Tab.Navigator>
  );
};

export default HomeScreen;

const getStyles = theme =>
  StyleSheet.create({
    tabBarIcon: {
      marginTop: theme.spacing.sm,
    },
    tabBarLabel: {
      fontFamily: theme.fontFamily.medium,
      fontSize: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
    tabBar: {
      borderTopColor: theme.colors.grey4,
      backgroundColor: theme.colors.grey5,
      height: '8%',
      maxHeight: 60,
    },
  });
