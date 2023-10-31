import { useNavigation } from '@react-navigation/native';
import { Icon, useTheme } from '@rneui/themed';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BaseButton,
  BaseDivider,
  BaseScreen,
  BaseText,
  BaseScrollView,
} from '../../Components';
import ROUTES from '../../_shared/constant/routes';
import { AuthContext } from '../../_shared/context';
import { useDimension } from '../../_shared/hooks';

const items = [
  {
    desc: 'Set up your base currency',
    iconName: 'dollar-sign',
    iconType: 'feather',
  },
  {
    desc: 'Create categories',
    iconName: 'grid',
    iconType: 'feather',
  },
  {
    desc: 'Allocate budgets',
    iconName: 'profile',
    iconType: 'antdesign',
  },
  {
    desc: 'Create assets and debts',
    iconName: 'wallet',
    iconType: 'antdesign',
  },
  {
    desc: 'Track your investments',
    iconName: 'line-graph',
    iconType: 'entypo',
  },
];

const WelcomeScreen = () => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

  const renderItems = () => {
    let rows = [];

    items.map((item, idx) => {
      rows.push(
        <View style={styles.row} key={idx}>
          <Icon
            name={item.iconName}
            type={item.iconType}
            size={18}
            style={styles.icon}
            color={theme.colors.color1}
          />
          <BaseText text3>{item.desc}</BaseText>
        </View>,
      );
    });

    return rows;
  };

  const onBack = () => {
    logout();
  };

  return (
    <BaseScreen headerProps={{ allowBack: true, onBack: onBack }}>
      <View style={styles.screen}>
        <View>
          <BaseText h1>Welcome!</BaseText>
          <BaseText h2 margin={{ vertical: 10 }}>
            Let's get you started
          </BaseText>

          <BaseText text2 margin={{ top: 40 }}>
            Here's what we're gonna do next
          </BaseText>
          <BaseDivider margin={10} />
        </View>

        <BaseScrollView
          showsVerticalScrollIndicator={false}
          containerStyle={styles.body}>
          {renderItems()}
        </BaseScrollView>

        <View style={styles.footer}>
          <BaseButton
            title="Let's go!"
            size="lg"
            width={200}
            onPress={() => {
              navigation.navigate(ROUTES.onboarding);
            }}
          />
        </View>
      </View>
    </BaseScreen>
  );
};

const getStyles = (theme, screenHeight) => {
  return StyleSheet.create({
    screen: {
      flex: 1,
    },
    body: {
      flex: 1,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginVertical: 14,
    },
    icon: {
      padding: 10,
      borderRadius: 100,
      backgroundColor: theme.colors.color3,
      color: theme.colors.color1,
      marginRight: 8,
    },
    footer: {
      minHeight: screenHeight * 0.15,
      paddingTop: 20,
      paddingBottom: screenHeight * 0.025,
      alignItems: 'center',
      backgroundColor: 'white',
    },
  });
};

export default WelcomeScreen;
