import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@rneui/themed';
import { createIconSet } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

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
      <Tab.Screen name={ROUTES.budget} component={BudgetScreen} />
      <Tab.Screen name={ROUTES.transaction} component={TransactionScreen} />
      <Tab.Screen name={ROUTES.asset} component={AssetScreen} />
      <Tab.Screen name={ROUTES.settings} component={SettingScreen} />
    </Tab.Navigator>
  );
};

export default HomeScreen;

const getStyles = theme =>
  StyleSheet.create({
    tabBarIcon: {
      marginTop: theme.spacing.md,
      height: '100%',
    },
    tabBarLabel: {
      fontFamily: theme.fontFamily.medium,
      fontSize: theme.fontSizes.caption,
    },
    tabBar: {
      borderTopColor: theme.colors.grey4,
      backgroundColor: theme.colors.white,
    },
  });
