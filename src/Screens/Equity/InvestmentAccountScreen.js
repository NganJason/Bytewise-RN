import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@rneui/themed';
import { AmountText, BaseButton, BaseScreen, BaseText } from '../../Components';
import ROUTES from '../../_shared/constant/routes';
import { INVESTMENT_ACCOUNT } from '../../_shared/api/data/mock/investment_account';

const InvestmentAccountScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const getColorIndicator = (current_val, cost) => {
    if (current_val >= cost) {
      return {
        color: theme.colors.color1,
      };
    }
    return { color: theme.colors.red };
  };

  return (
    <BaseScreen
      bodyStyle={styles.screen}
      headerProps={{
        show: true,
        allowBack: true,
        centerComponentStyle: styles.header,
        centerComponent: (
          <View style={styles.summary}>
            <BaseText h1 style={{ color: theme.colors.color1 }}>
              Investment Account
            </BaseText>
            <AmountText h3 style={styles.summaryAmount}>
              {INVESTMENT_ACCOUNT.total_current_value}
            </AmountText>
            <BaseText
              h5
              style={{
                ...getColorIndicator(
                  INVESTMENT_ACCOUNT.total_current_value,
                  INVESTMENT_ACCOUNT.total_cost,
                ),
              }}>
              Invested{' '}
              <AmountText
                h5
                style={{
                  ...getColorIndicator(
                    INVESTMENT_ACCOUNT.total_current_value,
                    INVESTMENT_ACCOUNT.total_cost,
                  ),
                }}>
                {INVESTMENT_ACCOUNT.total_cost}
              </AmountText>
            </BaseText>
          </View>
        ),
      }}>
      <View>
        <View style={styles.rowContainer}>
          {INVESTMENT_ACCOUNT.holdings.map(d => {
            return (
              <TouchableWithoutFeedback
                key={d.id}
                onPress={() => {
                  navigation.navigate(ROUTES.investmentLotBreakdown, {
                    holding: d,
                  });
                }}>
                <View style={styles.row}>
                  <View style={styles.rowleft}>
                    <BaseText h3 style={styles.rowLeftTitle}>
                      {d.symbol}
                    </BaseText>
                    <BaseText h5>{d.lots} shares</BaseText>
                  </View>

                  <View style={styles.rowRight}>
                    <AmountText h3 style={styles.rowRightTitle}>
                      {d.current_value}
                    </AmountText>
                    <BaseText
                      h5
                      style={{
                        ...getColorIndicator(d.current_value, d.total_cost),
                      }}>
                      Cost:{' '}
                      <AmountText
                        style={{
                          ...getColorIndicator(d.current_value, d.total_cost),
                        }}>
                        {d.total_cost}
                      </AmountText>
                    </BaseText>
                  </View>
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
    header: {
      marginTop: '10%',
      flex: 10,
    },
    summary: {
      alignItems: 'center',
    },
    summaryAmount: {
      color: theme.colors.color3,
      marginVertical: theme.spacing.lg,
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
    rowLeft: {
      alignItems: 'flex-start',
    },
    rowRight: {
      alignItems: 'flex-end',
    },
    rowLeftTitle: {
      marginBottom: theme.spacing.md,
    },
    rowRightTitle: {
      marginBottom: theme.spacing.md,
    },
    addBtn: {
      marginVertical: 50,
    },
  });
};

export default InvestmentAccountScreen;
