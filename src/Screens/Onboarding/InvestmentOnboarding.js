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
import { getDateStringFromTs } from '../../_shared/util';

const AccountOnboarding = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const { addInvestmentAccountName, data } = useContext(OnboardingDataContext);
  let { account_name: accountName = '', holdings = [] } =
    data?.investmentAccount || {};

  const onAccountNameChange = e => {
    addInvestmentAccountName(e);
  };

  const renderHoldings = () => {
    let rows = [];
    let items = [...holdings];
    let showExample = items.length === 0;
    let textColor = showExample ? theme.colors.color8 : theme.colors.color6;

    if (showExample) {
      items.push({
        symbol: 'Eg: AAPL',
        trade_date: new Date().valueOf(),
        cost_per_share: 3000,
        shares: 10,
      });
    }

    items.map((holding, idx) => {
      let {
        symbol = '',
        trade_date: tradeDate = '',
        cost_per_share: costPerShare = 0,
        shares = 0,
      } = holding || {};

      rows.push(
        <BaseRow key={idx} dividerMargin={0} disabled={true}>
          <View>
            <BaseText text4 color={textColor}>
              {symbol}
            </BaseText>
            <BaseText text4 color={textColor}>
              {getDateStringFromTs(tradeDate)}
            </BaseText>
          </View>

          <View style={styles.rightCol}>
            <AmountText text4 color={textColor}>
              {shares * costPerShare}
            </AmountText>
            <BaseText text4 color={textColor}>
              {shares} unit/s
            </BaseText>
          </View>
        </BaseRow>,
      );
    });

    return rows;
  };

  return (
    <View style={styles.container}>
      <View>
        <BaseText h1>Track your</BaseText>
        <BaseText h1>investment</BaseText>
        <BaseText text2 style={styles.subtitle}>
          We provide real-time stock prices update to track your capital gain
        </BaseText>
      </View>

      <BaseScrollView showsVerticalScrollIndicator={false}>
        <BaseInput
          label="Account Name"
          value={accountName}
          onChangeText={onAccountNameChange}
          placeholder="My US Stocks"
          containerStyle={styles.accountInput}
        />

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
  });
};

export default AccountOnboarding;
