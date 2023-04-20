import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@rneui/themed';
import { createIconSet } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import CategoryScreen from './Category/CategoryScreen';
import EquityScreen from './Equity/EquityScreen';
import TransactionScreen from './Transaction/TransactionScreen';

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
      case ROUTES.category:
        iconName = 'icon-budget';
        break;
      case ROUTES.transaction:
        iconName = 'icon-transaction';
        break;
      case ROUTES.asset:
        iconName = 'icon-asset';
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
      <Tab.Screen name={ROUTES.category} component={CategoryScreen} />
      <Tab.Screen name={ROUTES.transaction} component={TransactionScreen} />
      <Tab.Screen name={ROUTES.asset} component={EquityScreen} />
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
    tabBarLabel: { ...theme.fontStyles.caption },
    tabBar: {
      borderTopColor: theme.colors.grey4,
      backgroundColor: theme.colors.white,
    },
  });
