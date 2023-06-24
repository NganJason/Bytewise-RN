import { useNavigation } from '@react-navigation/native';
import { Icon, useTheme } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AmountText, BaseButton, BaseScreen, BaseText } from '../../Components';
import { EmptyContent } from '../../Components/Common';
import {
  BaseCard,
  BaseGrid,
  BaseImage,
  BaseLoadableView,
  BaseRow,
} from '../../Components/View';
import {
  ACCOUNT_TYPES,
  EQUITY_TYPE_ASSET,
  EQUITY_TYPE_LIABILITY,
} from '../../_shared/apis/enum';
import { loginHero } from '../../_shared/constant/asset';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import ROUTES from '../../_shared/constant/routes';
import useDimension from '../../_shared/hooks/dimension';
import { capitalizeWords } from '../../_shared/util/string';
const { View, StyleSheet } = require('react-native');

const MockData = [
  {
    account_id: '1',
    account_type: 3,
    equity_type: 1,
    account_name: 'Stock',
    amount: 8000,
  },
  {
    account_id: '2',
    account_type: 2,
    equity_type: 1,
    account_name: 'OCBC',
    amount: 5000,
  },
  {
    account_id: '4',
    account_type: 3,
    equity_type: 1,
    account_name: 'Syfe',
    amount: 13000,
  },
  {
    account_id: '5',
    account_type: 5,
    equity_type: 2,
    account_name: 'Student loan',
    amount: 21000,
  },
  {
    account_id: '6',
    account_type: 4,
    equity_type: 2,
    account_name: 'Citibank',
    amount: 3000,
  },
];

const AccountScreen = () => {
  const { theme } = useTheme();
  const { screenWidth, screenHeight } = useDimension();
  const styles = getStyles(theme, screenWidth, screenHeight);
  const navigation = useNavigation();

  const computeSum = (equityType = EQUITY_TYPE_ASSET) => {
    let sum = 0;
    MockData.map(d => {
      if (d.equity_type === equityType) {
        sum += d.amount;
      }
    });
    return sum;
  };

  const renderContent = (equityType = EQUITY_TYPE_ASSET) => {
    let data = MockData.filter(d => d.equity_type === equityType);

    if (data.length === 0) {
      return (
        <EmptyContent
          item={EmptyContentConfig.asset}
          route={ROUTES.budgetForm}
        />
      );
    }

    return (
      <BaseGrid
        items={data}
        spacing={30}
        renderItem={item => (
          <BaseCard
            key={item.account_id}
            onPress={function () {}}
            color={
              equityType === EQUITY_TYPE_ASSET
                ? theme.colors.color2
                : theme.colors.red
            }>
            <BaseText text3 style={{ color: theme.colors.white }}>
              {capitalizeWords(item.account_name)}
            </BaseText>
            <AmountText text2 style={styles.cardAmountText}>
              {item.amount}
            </AmountText>
            <BaseText text4 style={{ color: theme.colors.white }}>
              {capitalizeWords(ACCOUNT_TYPES[item.account_type])}
            </BaseText>
          </BaseCard>
        )}
      />
    );
  };

  return (
    <BaseScreen enablePadding={false}>
      <SafeAreaView style={styles.header}>
        <View style={styles.title}>
          <BaseText h1>Accounts</BaseText>
          <AmountText style={styles.titleText} h2 decimal={0}>
            21000
          </AmountText>
          <BaseButton
            title="Add account"
            type="clear"
            align="flex-start"
            size="sm"
            icon={
              <Icon
                name="plus-circle"
                type="feather"
                color={theme.colors.color1}
                size={13}
                iconStyle={styles.icon}
              />
            }
            onPress={() => {
              navigation.navigate(ROUTES.accountSelection);
            }}
          />
        </View>
        <BaseImage source={loginHero} containerStyle={styles.image} />
      </SafeAreaView>

      <View style={styles.body}>
        <BaseLoadableView scrollable={true}>
          <View>
            <BaseRow showDivider={false} disabled={true}>
              <BaseText h3>Assets</BaseText>
              <AmountText text3>{computeSum(EQUITY_TYPE_ASSET)}</AmountText>
            </BaseRow>
            {renderContent(EQUITY_TYPE_ASSET)}
          </View>

          <View>
            <BaseRow showDivider={false} disabled={true}>
              <BaseText h3>Liabilities</BaseText>
              <AmountText text3>{computeSum(EQUITY_TYPE_LIABILITY)}</AmountText>
            </BaseRow>
            {renderContent(EQUITY_TYPE_LIABILITY)}
          </View>
        </BaseLoadableView>
      </View>
    </BaseScreen>
  );
};

const getStyles = (theme, screenWidth, screenHeight) =>
  StyleSheet.create({
    header: {
      minHeight: screenHeight * 0.25,
      marginTop: theme.spacing.lg,
      paddingHorizontal: 26,
      flexDirection: 'row',
      justifyContent: 'left',
      alignItems: 'center',
      backgroundColor: theme.colors.color11,
    },
    image: {
      width: screenHeight * 0.26,
      height: screenHeight * 0.26,
      position: 'absolute',
      right: screenWidth * -0.1,
    },
    titleText: {
      marginVertical: theme.spacing.md,
    },
    icon: {
      marginRight: theme.spacing.sm,
    },
    body: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: 26,
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
    cardAmountText: {
      marginTop: 16,
      marginBottom: 4,
      color: theme.colors.white,
    },
  });

export default AccountScreen;
