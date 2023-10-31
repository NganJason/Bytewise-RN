import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  AmountText,
  BaseInput,
  BaseRow,
  BaseScrollView,
  BaseText,
  IconButton,
} from '../../Components';
import ROUTES from '../../_shared/constant/routes';
import { OnboardingDataContext } from '../../_shared/context';
import { Amount } from '../../_shared/object';
import { CURRENCY_SGD, CURRENCY_USD } from '../../_shared/util';
import {
  HOLDING_TYPE_CUSTOM,
  HOLDING_TYPE_DEFAULT,
} from '../../_shared/apis/enum';

const AccountOnboarding = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  // TODO: Validate account name, cannot be empty
  const { addInvestmentAccountName, data } = useContext(OnboardingDataContext);
  let { account_name: accountName = '', holdings = [] } =
    data?.investmentAccount || {};

  const onAccountNameChange = e => {
    addInvestmentAccountName(e);
  };

  const renderHoldings = () => {
    const rows = [];
    const items = [...holdings];
    const showExample = items.length === 0;
    const textColor = showExample ? theme.colors.color8 : theme.colors.color6;

    if (showExample) {
      items.push(
        {
          symbol: 'E.g. AAPL',
          example: true,
          currency: CURRENCY_USD,
          holding_type: HOLDING_TYPE_DEFAULT,
          lots: [{ shares: 100, cost_per_share: 100 }],
        },
        {
          symbol: 'E.g. Special Stock',
          example: true,
          currency: CURRENCY_SGD,
          holding_type: HOLDING_TYPE_CUSTOM,
          latest_value: 100,
          total_cost: 50,
        },
      );
    }

    items.map((holding, idx) => {
      let {
        symbol = '',
        total_cost: totalCost = 0,
        latest_value: latestValue = 0,
        holding_type: holdingType = 0,
        currency = '',
        lots = [{ shares: 0, cost_per_share: 0 }],
        example = false,
      } = holding || {};

      rows.push(
        <BaseRow
          key={idx}
          dividerMargin={0}
          disabled={example}
          onPress={() => {
            navigation.navigate(ROUTES.investmentOnboardingForm, {
              idx: idx,
              symbol: symbol,
              holding_type: holdingType,
              total_cost: totalCost,
              latest_value: latestValue,
              lots: lots,
              currency: currency,
            });
          }}>
          <View>
            <BaseText text4 color={textColor}>
              {symbol}
            </BaseText>
          </View>

          <View style={styles.rightCol}>
            <View style={styles.flexRow}>
              <BaseText text4 color={textColor}>
                {holdingType === HOLDING_TYPE_DEFAULT
                  ? 'Cost per share: '
                  : 'Latest Value: '}
              </BaseText>
              <AmountText
                text4
                amount={
                  new Amount(
                    holdingType === HOLDING_TYPE_DEFAULT
                      ? lots[0].cost_per_share
                      : latestValue,
                    currency,
                  )
                }
                color={textColor}
              />
            </View>

            {holdingType === HOLDING_TYPE_DEFAULT ? (
              <BaseText text4 color={textColor}>
                Quantity: {lots[0].shares} units
              </BaseText>
            ) : (
              <View style={styles.flexRow}>
                <BaseText text4 color={textColor}>
                  Invested Amount:&nbsp;
                </BaseText>
                <AmountText
                  text4
                  amount={new Amount(totalCost, currency)}
                  color={textColor}
                />
              </View>
            )}
          </View>
        </BaseRow>,
      );
    });

    return rows;
  };

  return (
    <View style={styles.container}>
      <View>
        <BaseText h1>Track your investments</BaseText>
        <BaseText text2 style={styles.subtitle} numberOfLines={0}>
          Track popular stocks like APPL, or add your custom investments.
        </BaseText>
      </View>
      <BaseInput
        label="Account Name"
        value={accountName}
        onChangeText={onAccountNameChange}
        placeholder="My US Stocks"
        containerStyle={styles.accountInput}
        autoFocus
      />

      <BaseScrollView showsVerticalScrollIndicator={false}>
        <BaseRow dividerMargin={0} disabled>
          <BaseText h4>Holdings</BaseText>
          <IconButton
            iconName="plus"
            iconType="feather"
            iconSize={20}
            color={theme.colors.color8}
            onPress={() => {
              navigation.navigate(ROUTES.investmentOnboardingForm);
            }}
          />
        </BaseRow>
        {renderHoldings()}
      </BaseScrollView>
    </View>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    subtitle: {
      marginTop: 10,
      marginBottom: 12,
      color: theme.colors.color8,
    },
    accountInput: {
      marginTop: 6,
      marginBottom: 0,
    },
    rightCol: {
      alignItems: 'flex-end',
    },
    flexRow: {
      display: 'flex',
      flexDirection: 'row',
    },
  });
};

export default AccountOnboarding;
