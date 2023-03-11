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

const HomeScreen = ({ onLayout }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    tabBarIcon: {
      marginTop: theme.spacing.sm,
    },
    tabBarLabel: {
      marginBottom: theme.spacing.sm,
      fontFamily: theme.fontFamily.medium,
      fontSize: theme.spacing.lg,
    },
    tabBar: {
      backgroundColor: theme.colors.grey5,
      borderTopColor: theme.colors.grey4,
      height: '8%',
      maxHeight: 60,
    },
  });

  const wrapScreenTemplate = children => (
    <ScreenTemplate onLayout={onLayout}>{children}</ScreenTemplate>
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
