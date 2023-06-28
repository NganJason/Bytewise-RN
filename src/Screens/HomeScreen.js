import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, useTheme } from '@rneui/themed';
import { createIconSet } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import TransactionScreen from './Transaction/TransactionScreen';

import ROUTES from '../_shared/constant/routes';

import OverviewScreen from './Overview/OverviewScreen';
import AccountScreen from './Account/AccountScreen';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const renderTabIcon = (routeName, { color, size }) => {
    let iconName;
    switch (routeName) {
      case ROUTES.overview:
        iconName = 'barschart';
        break;
      case ROUTES.transaction:
        iconName = 'filetext1';
        break;
      case ROUTES.account:
        iconName = 'wallet';
        break;
    }
    return (
      <Icon
        name={iconName}
        type={'antdesign'}
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
      <Tab.Screen name={ROUTES.overview} component={OverviewScreen} />
      <Tab.Screen name={ROUTES.transaction} component={TransactionScreen} />
      <Tab.Screen name={ROUTES.account} component={AccountScreen} />
    </Tab.Navigator>
  );
};

export default HomeScreen;

const getStyles = theme =>
  StyleSheet.create({
    tabBarIcon: {
      marginTop: theme.spacing.lg,
      height: '100%',
    },
    tabBarLabel: { ...theme.fontStyles.text5, color: theme.colors.color7 },
    tabBar: {
      borderTopColor: theme.colors.color9,
      backgroundColor: theme.colors.white,
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 1,
        height: -1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
  });
