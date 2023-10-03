import { Icon, useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  AmountText,
  BaseImage,
  BaseScreen2,
  BaseText,
  DateNavigator,
  BaseLoadableView,
  BaseButton,
  Transactions,
} from '../../Components';
import { card, coin, coinsack } from '../../_shared/constant/asset';
import ROUTES from '../../_shared/constant/routes';
import {
  ACCOUNT_TYPES,
  ACCOUNT_TYPE_CASH,
  ACCOUNT_TYPE_CREDIT_CARD,
} from '../../_shared/apis/enum';
import { useNavigation } from '@react-navigation/native';
import { useGetAccount, useGetTransactions } from '../../_shared/query';
import {
  DEFAULT_CURRENCY,
  getMonth,
  getUnixRangeOfMonth,
  getYear,
  isAccountTypeAsset,
} from '../../_shared/util';
import { ACCOUNT_TYPE_LOAN } from '../../_shared/apis/enum';
import { useError, useDimension } from '../../_shared/hooks';
import { sapiens3 } from '../../_shared/constant/asset';
import { Amount } from '../../_shared/object';

const PAGING_LIMIT = 500;
const STARTING_PAGE = 1;

const AccountBreakdownScreen = ({ route }) => {
  const { theme } = useTheme();
  const { screenWidth, screenHeight } = useDimension();
  const styles = getStyles(theme, screenWidth, screenHeight);
  const navigation = useNavigation();

  const {
    account_id: accountID = '',
    account_type: accountType = ACCOUNT_TYPE_CASH,
  } = route?.params || {};

  const [activeDate, setActiveDate] = useState(new Date());
  const [timeRange, setTimeRange] = useState(
    getUnixRangeOfMonth(getYear(activeDate), getMonth(activeDate)),
  );

  const onDateMove = newDate => {
    setActiveDate(newDate);
    setTimeRange(getUnixRangeOfMonth(getYear(newDate), getMonth(newDate)));
  };

  const getTransactions = useGetTransactions(
    {
      account_id: accountID,
      transaction_time: {
        gte: timeRange[0],
        lte: timeRange[1],
      },
      paging: {
        limit: PAGING_LIMIT,
        page: STARTING_PAGE,
      },
    },
    { enabled: accountID !== '' },
  );

  const getAccount = useGetAccount(
    { account_id: accountID },
    { enabled: accountID !== '' },
  );

  const renderRows = () => {
    let { transactions = [] } = getTransactions?.data || {};
    return <Transactions transactions={transactions} />;
  };

  const renderHeader = () => {
    const {
      account_name = '',
      account_type = 0,
      balance = '0',
      currency = DEFAULT_CURRENCY,
    } = getAccount?.data?.account || {};

    const textColor = isAccountTypeAsset(accountType)
      ? theme.colors.color1
      : theme.colors.color12;

    const getImg = () => {
      if (isAccountTypeAsset(accountType)) {
        return coin;
      }
      if (accountType === ACCOUNT_TYPE_CREDIT_CARD) {
        return card;
      }
      return coinsack;
    };

    return (
      <>
        <View style={styles.title}>
          <BaseText h1 isLoading={getAccount.isLoading} loadingLen={10}>
            {account_name}
          </BaseText>
          <AmountText
            h2
            amount={new Amount(balance, currency)}
            showNegativeOnly={isAccountTypeAsset(accountType)}
            margin={{ top: 8, bottom: 6 }}
            isLoading={getAccount.isLoading}
            sensitive
          />

          <BaseText
            text4
            margin={{ bottom: 4 }}
            isLoading={getAccount.isLoading}>
            {ACCOUNT_TYPES[account_type]}
          </BaseText>
          <BaseButton
            title="Edit Account"
            type="clear"
            align="flex-start"
            size="sm"
            textStyle={{ color: textColor }}
            icon={
              <Icon name="edit" type="feather" color={textColor} size={13} />
            }
            onPress={() => {
              navigation.navigate(ROUTES.accountForm, {
                account_id: accountID,
              });
            }}
          />
        </View>
        <BaseImage source={getImg()} containerStyle={styles.image} />
      </>
    );
  };

  const renderContent = () => {
    if (accountType === ACCOUNT_TYPE_LOAN) {
      return renderMoreFeature();
    }

    return (
      <>
        <View style={styles.dataNavigator}>
          <DateNavigator
            date={activeDate}
            onForward={onDateMove}
            onBackward={onDateMove}
          />
        </View>
        <BaseLoadableView
          scrollable={true}
          isLoading={getTransactions.isLoading}>
          {renderRows()}
        </BaseLoadableView>
      </>
    );
  };

  const renderMoreFeature = () => {
    return (
      <View style={styles.debtContainer}>
        <BaseImage
          width={screenWidth * 0.4}
          height={screenWidth * 0.4}
          source={sapiens3}
        />
        <View style={styles.debtTextContainer}>
          <BaseText text3 style={styles.debtText}>
            More features coming soon.
          </BaseText>
          <BaseText text3 style={styles.debtText}>
            Stay tuned!
          </BaseText>
        </View>
      </View>
    );
  };

  useError([getAccount, getTransactions]);

  return (
    <BaseScreen2
      headerProps={{
        component: renderHeader(),
        allowBack: true,
        backgroundColor: isAccountTypeAsset(accountType)
          ? theme.colors.color4
          : theme.colors.color13,
      }}
      fabProps={
        accountType !== ACCOUNT_TYPE_LOAN && {
          show: true,
          placement: 'right',
          iconName: 'plus',
          iconType: 'entypo',
          iconColor: theme.colors.white,
          color: theme.colors.color1,
          onPress: () =>
            navigation.navigate(ROUTES.transactionForm, {
              account: {
                account_id: accountID,
                account_name: getAccount?.data?.account?.account_name || '',
              },
            }),
          marginBottom: screenHeight * 0.02,
        }
      }>
      <View style={styles.body}>{renderContent()}</View>
    </BaseScreen2>
  );
};

const getStyles = (theme, screenWidth, screenHeight) =>
  StyleSheet.create({
    body: {
      flex: 1,
    },
    image: {
      width: screenHeight * 0.2,
      height: screenHeight * 0.18,
      position: 'absolute',
      right: screenWidth * -0.15,
      zIndex: -1,
    },
    dataNavigator: {
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    debtContainer: {
      marginVertical: '30%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    debtTextContainer: {
      alignItems: 'center',
    },
    debtText: {
      marginBottom: theme.spacing.md,
      color: theme.colors.color7,
    },
  });

export default AccountBreakdownScreen;
