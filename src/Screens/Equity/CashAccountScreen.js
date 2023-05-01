import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@rneui/themed';
import { AmountText, BaseButton, BaseScreen, BaseText } from '../../Components';
import { CASH_ACCOUNT } from '../../_shared/api/mock_data/cash_account';

const CashAccountScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <BaseScreen
      bodyStyle={styles.screen}
      headerProps={{
        show: true,
        allowBack: true,
        centerComponent: (
          <View style={styles.summary}>
            <BaseText h1 style={styles.summaryTitle}>
              Cash Account
            </BaseText>
            <AmountText h3 style={{ color: theme.colors.color3 }}>
              {CASH_ACCOUNT.total}
            </AmountText>
          </View>
        ),
      }}>
      <View>
        <View style={styles.rowContainer}>
          {CASH_ACCOUNT.accounts.map(d => {
            return (
              <TouchableWithoutFeedback key={d.id}>
                <View style={styles.row}>
                  <BaseText h3>{d.name}</BaseText>
                  <AmountText h3>{d.amount}</AmountText>
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>
      </View>
      <BaseButton
        title="Add"
        size="lg"
        fullWidth={true}
        containerStyle={styles.addBtn}
      />
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    screen: {
      justifyContent: 'space-between',
    },
    summary: {
      alignItems: 'center',
      marginTop: '10%',
    },
    summaryTitle: {
      color: theme.colors.color1,
      marginVertical: theme.spacing.md,
    },
    rowContainer: {
      marginTop: '20%',
    },
    row: {
      padding: theme.spacing.xl,
      flexDirection: 'row',
      justifyContent: 'space-between',
      ...theme.borderBottom,
    },
    addBtn: {
      marginVertical: 50,
    },
  });
};

export default CashAccountScreen;
