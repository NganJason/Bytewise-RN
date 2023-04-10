import { useTheme, Image } from '@rneui/themed';
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';

import { AmountText, BaseHeader, BaseScreen, BaseText } from '../../Components';
import EquityRow from './EquityRow';
import { EQUITY } from '../../_shared/api/data/mock/equity';
import { EQUITY_TYPE } from '../../_shared/constant/constant';
import ROUTES from '../../_shared/constant/routes';

const heroImgPath = '../../../assets/images/asset_screen_hero.png';

const EquityScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const styles = getStyles(theme, screenWidth);

  const parseAssetDataToEquityRow = asset => {
    return {
      title: 'Assets',
      amount: asset.total,
      currency: asset.currency,
      breakdown: [
        {
          name: 'Cash',
          amount: asset.cash.amount,
          currency: asset.cash.currency,
          redirect: ROUTES.cashAccount,
        },
        {
          name: 'Investment',
          amount: asset.investment.amount,
          currency: asset.investment.currency,
          redirect: ROUTES.investmentAccount,
        },
      ],
    };
  };

  const parseDebtDataToEquityRow = debt => {
    let row = {
      title: 'Debts',
      amount: debt.total,
      currency: debt.currency,
      breakdown: [],
    };

    debt.breakdown.map(d => {
      row.breakdown.push({
        name: d.debt_name,
        amount: d.amount,
        currency: d.currency,
      });
    });

    return row;
  };

  return (
    <BaseScreen>
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <BaseHeader
          left={
            <View>
              <BaseText h4 style={{ color: theme.colors.color3 }}>
                You have
              </BaseText>
              <AmountText
                h1
                style={{
                  color: theme.colors.color3,
                  marginVertical: theme.spacing.lg,
                }}>
                {EQUITY.total}
              </AmountText>
            </View>
          }
        />

        <View style={styles.heroImgContainer}>
          <Image source={require(heroImgPath)} style={styles.heroImg} />
        </View>

        <EquityRow
          equityType={EQUITY_TYPE.asset}
          data={parseAssetDataToEquityRow(EQUITY.asset)}
          navigation={navigation}
        />
        <EquityRow
          equityType={EQUITY_TYPE.debt}
          data={parseDebtDataToEquityRow(EQUITY.debt)}
          navigation={navigation}
        />
      </ScrollView>
    </BaseScreen>
  );
};

const getStyles = (theme, screenWidth) => {
  return StyleSheet.create({
    heroImgContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    heroImg: {
      width: screenWidth * 0.8,
      height: screenWidth * 0.7,
    },
  });
};

export default EquityScreen;
