import { useNavigation } from '@react-navigation/native';
import { Icon, useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import {
  BaseButton,
  BaseDivider,
  BaseScreen,
  BaseText,
} from '../../Components';
import ROUTES from '../../_shared/constant/routes';
import { useDimension } from '../../_shared/hooks';

const items = [
  {
    desc: 'Create categories',
    iconName: 'grid',
    iconType: 'feather',
  },
  {
    desc: 'Allocate budgets to your categories',
    iconName: 'profile',
    iconType: 'antdesign',
  },
  {
    desc: 'Setup accounts to track your net worth',
    iconName: 'wallet',
    iconType: 'antdesign',
  },
  {
    desc: 'Track your investment holdings',
    iconName: 'line-graph',
    iconType: 'entypo',
  },
];

const WelcomeScreen = () => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);
  const navigation = useNavigation();

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
  return (
    <BaseScreen headerProps={{ allowBack: true }}>
      <View>
        <BaseText h1>Welcome!</BaseText>
        <BaseText h2 margin={{ vertical: 10 }}>
          Let's get your started
        </BaseText>

        <BaseText text2 margin={{ top: 40 }}>
          Here's what we're gonna do next
        </BaseText>
        <BaseDivider margin={10} />
      </View>

      <View style={styles.body}>{renderItems()}</View>

      <View style={styles.footer}>
        <BaseButton
          title="Let's Go!"
          size="lg"
          width={200}
          onPress={() => {
            navigation.navigate(ROUTES.onboarding);
          }}
        />
      </View>
    </BaseScreen>
  );
};

const getStyles = (theme, screenHeight) => {
  return StyleSheet.create({
    body: {
      flex: 1,
      paddingTop: screenHeight * 0.015,
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
