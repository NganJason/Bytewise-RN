import { Icon, useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  AmountText,
  BaseImage,
  BaseScreen2,
  BaseText,
  DailyTransactions,
  DateNavigator,
  EmptyContent,
  BaseLoadableView,
  BaseButton,
} from '../../Components';
import { coin } from '../../_shared/constant/asset';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import ROUTES from '../../_shared/constant/routes';
import useDimension from '../../_shared/hooks/dimension';
import { ACCOUNT_TYPES } from '../../_shared/apis/enum';
import { useNavigation } from '@react-navigation/native';
import { useGetAccount } from '../../_shared/query/account';
import {
  getMonth,
  getUnixRangeOfMonth,
  getYear,
} from '../../_shared/util/date';
import { groupTransactionsByDate } from '../../_shared/util/transaction';
import { useGetTransactionsHook } from '../../_shared/hooks/transaction';

const PAGING_LIMIT = 500;
const STARTING_PAGE = 1;

const AccountBreakdownScreen = ({ route }) => {
  const { theme } = useTheme();
  const { screenWidth, screenHeight } = useDimension();
  const styles = getStyles(theme, screenWidth, screenHeight);
  const navigation = useNavigation();

  const accountID = route.params?.account_id || '';

  const [activeDate, setActiveDate] = useState(new Date());
  const [timeRange, setTimeRange] = useState(
    getUnixRangeOfMonth(getYear(activeDate), getMonth(activeDate)),
  );

  const onDateMove = newDate => {
    setActiveDate(newDate);
    setTimeRange(getUnixRangeOfMonth(getYear(newDate), getMonth(newDate)));
  };

  const getTransactions = useGetTransactionsHook(
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
    let rows = [];
    let { transactions = [] } = getTransactions;
    const { transactionTimes = [], transactionGroups = {} } =
      groupTransactionsByDate(transactions);

    transactionTimes.map((tt, i) =>
      rows.push(
        <DailyTransactions
          key={i}
          transactions={transactionGroups[tt]}
          timestamp={tt}
        />,
      ),
    );

    if (rows.length === 0 && !getTransactions.isLoading) {
      return (
        <EmptyContent
          item={EmptyContentConfig.transaction}
          route={ROUTES.transactionForm}
          marginVertical="30%"
        />
      );
    }

    return rows;
  };

  const renderHeader = () => {
    const {
      account_name = '',
      account_type = 0,
      balance = '0',
    } = getAccount?.data?.account || {};

    return (
      <>
        <View style={styles.title}>
          <BaseText h1 isLoading={getAccount.isLoading}>
            {account_name}
          </BaseText>
          <AmountText
            h2
            decimal={0}
            margin={{ top: 8, bottom: 6 }}
            isLoading={getAccount.isLoading}>
            {balance}
          </AmountText>
          <BaseText
            text4
            margin={{ bottom: 4 }}
            isLoading={getAccount.isLoading}>
            {ACCOUNT_TYPES[account_type]}
          </BaseText>
          <BaseButton
            title="Edit account"
            type="clear"
            align="flex-start"
            size="sm"
            icon={
              <Icon
                name="edit"
                type="feather"
                color={theme.colors.color1}
                size={13}
              />
            }
            onPress={() => {
              navigation.navigate(ROUTES.accountForm, {
                account_id: accountID,
              });
            }}
          />
        </View>
        <BaseImage source={coin} containerStyle={styles.image} />
      </>
    );
  };

  return (
    <BaseScreen2
      headerProps={{
        component: renderHeader(),
        allowBack: true,
        backgroundColor: theme.colors.color4,
      }}>
      <>
        <View style={styles.dataNavigator}>
          <DateNavigator
            startingDate={activeDate}
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
    </BaseScreen2>
  );
};

const getStyles = (theme, screenWidth, screenHeight) =>
  StyleSheet.create({
    image: {
      width: screenHeight * 0.2,
      height: screenHeight * 0.18,
      position: 'absolute',
      right: screenWidth * -0.15,
    },
    dataNavigator: {
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
  });

export default AccountBreakdownScreen;
