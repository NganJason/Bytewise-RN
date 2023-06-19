import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@rneui/themed';
import { createIconSet } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import CategoryScreen from './Category/CategoryScreen';
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
