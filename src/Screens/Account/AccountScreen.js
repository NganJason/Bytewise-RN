import { useTheme } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AmountText, BaseButton, BaseText } from '../../Components';

const { View, StyleSheet } = require('react-native');

const AccountScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View>
      <View style={styles.header}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.title}>
            <BaseText h1>Account</BaseText>
            <AmountText h2 decimal={0}>
              21000
            </AmountText>
            <BaseButton
              title="Add account"
              type="clear"
              align="flex-start"
              size="sm"
              // onPress={onAddBugdet}
            />
          </View>
        </SafeAreaView>
      </View>
      <View style={styles.body}></View>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    header: {
      minHeight: '20%',
      backgroundColor: theme.colors.color10,
      paddingHorizontal: 26,
      justifyContent: 'center',
    },
    title: {},
    body: {
      minHeight: '100%',
      backgroundColor: theme.colors.white,
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 2,
        height: -5,
      },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 10,
    },
  });

export default AccountScreen;
