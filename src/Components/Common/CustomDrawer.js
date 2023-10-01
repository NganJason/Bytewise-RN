import { DrawerContentScrollView } from '@react-navigation/drawer';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Icon, useTheme } from '@rneui/themed';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import ROUTES from '../../_shared/constant/routes';
import { AuthContext } from '../../_shared/context';
import { UserMetaContext } from '../../_shared/context/UserMetaContext';

import { capitalize } from '../../_shared/util';
import { BaseText } from '../Text';
import { BaseDivider, BaseRow } from '../View';
import Currency from './Currency';

const CustomDrawer = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const { logout = function () {} } = useContext(AuthContext) || {};
  const {
    shouldHideSensitiveInfo = function () {},
    toggleHideUserInfo = function () {},
    getUserBaseCurrency = function () {},
    getUserName = function () {},
  } = useContext(UserMetaContext) || {};

  const onPress = item => {
    if (item.onPress) {
      item.onPress(item);
    } else if (item.route) {
      navigation.navigate(item.route);
    }
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const drawerRows = [
    {
      name: 'Manage categories',
      icon: {
        type: 'feather',
        name: 'grid',
      },
      route: ROUTES.categoryEdit,
    },
    {
      name: shouldHideSensitiveInfo()
        ? 'Show sentive info'
        : 'Hide sensitive info',
      icon: {
        type: 'feather',
        name: shouldHideSensitiveInfo() ? 'eye-off' : 'eye',
      },
      onPress: function (item) {
        toggleHideUserInfo();
      },
    },
    {
      name: 'Feedback',
      icon: {
        type: 'feather',
        name: 'message-square',
      },
      route: ROUTES.feedbackForm,
    },
  ];

  const renderRows = () => {
    let rows = [];

    drawerRows.map(row => {
      rows.push(
        <BaseRow
          key={row.name}
          showDivider={false}
          onPress={() => onPress(row)}>
          <View style={styles.row}>
            <Icon
              name={row.icon.name}
              type={row.icon.type}
              style={styles.icon}
              color={theme.colors.color7}
            />
            <BaseText text3>{row.name}</BaseText>
          </View>
        </BaseRow>,
      );
    });

    return rows;
  };

  return (
    <View style={styles.screen}>
      <DrawerContentScrollView>
        <View>
          <BaseText h2 margin={{ bottom: 18 }}>
            {capitalize(getUserName())}
          </BaseText>
        </View>
        <Currency code={getUserBaseCurrency()} />
        <BaseDivider margin={10} />

        <View style={styles.body}>{renderRows()}</View>
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <BaseDivider />
        <BaseRow showDivider={false} onPress={() => logout()}>
          <View style={styles.row}>
            <Icon
              name={'log-out'}
              type={'feather'}
              style={styles.icon}
              color={theme.colors.color7}
            />
            <BaseText text3>Sign out</BaseText>
          </View>
        </BaseRow>
      </View>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    screen: {
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.sm,
      flex: 1,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    icon: {
      marginRight: theme.spacing.lg,
    },
    body: {
      flex: 1,
    },
    footer: {},
  });

export default CustomDrawer;
