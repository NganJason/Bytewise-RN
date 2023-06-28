import { useTheme } from '@rneui/themed';
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
} from '../../Components';
import { TRANSACTION_TYPE_EXPENSE } from '../../_shared/apis/enum';
import { coin } from '../../_shared/constant/asset';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import ROUTES from '../../_shared/constant/routes';
import useDimension from '../../_shared/hooks/dimension';
import { ACCOUNT_TYPES } from '../../_shared/apis/enum';

const mockData = {
  account_id: '1',
  account_name: 'OCBC',
  account_type: 2,
  balance: 20000,
  transactions: [
    {
      transaction_id: '1',
      category: {
        category_id: '1',
        category_name: 'food',
      },
      amount: '12',
      note: 'lunch',
      transaction_time: 1687598233,
      transaction_type: TRANSACTION_TYPE_EXPENSE,
    },
    {
      transaction_id: '2',
      category: {
        category_id: '2',
        category_name: 'transport',
      },
      amount: '3',
      note: 'mrt',
      transaction_time: 1687598233,
      transaction_type: TRANSACTION_TYPE_EXPENSE,
    },
  ],
};

const AccountBreakdownScreen = ({ route }) => {
  const { theme } = useTheme();
  const { screenWidth, screenHeight } = useDimension();
  const styles = getStyles(theme, screenWidth, screenHeight);

  const account_id = route.params?.account_id || '';

  const [activeDate, setActiveDate] = useState(new Date());
  const onDateMove = newDate => {
    setActiveDate(newDate);
  };

  const renderRows = () => {
    let rows = [];
    let { transactions = [] } = mockData || {};

    if (transactions.length > 0) {
      // TODO: remove transactions[0] later
      rows.push(
        <DailyTransactions
          key={transactions[0].transaction_id}
          transactions={transactions}
          timestamp={transactions[0].transaction_time}
        />,
      );
    }

    if (rows.length === 0) {
      return (
        <View style={styles.emptyContent}>
          <EmptyContent
            item={EmptyContentConfig.transaction}
            route={ROUTES.transactionForm}
          />
        </View>
      );
    }

    return rows;
  };

  const renderHeader = () => {
    return (
      <>
        <View style={styles.title}>
          <BaseText h1>{mockData.account_name}</BaseText>
          <AmountText h2 decimal={0} margin={{ top: 8, bottom: 6 }}>
            {mockData.balance}
          </AmountText>
          <BaseText text4>{ACCOUNT_TYPES[mockData.account_type]}</BaseText>
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
        <BaseLoadableView scrollable={true}>{renderRows()}</BaseLoadableView>
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
    emptyContent: {
      marginTop: '30%',
    },
  });

export default AccountBreakdownScreen;
