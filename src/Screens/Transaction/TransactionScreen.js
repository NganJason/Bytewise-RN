import { useTheme } from '@rneui/themed';

import {
  BaseScreen,
  MonthNavigator,
  DailyTransactions,
  AggrSummary,
  BaseScrollView,
} from '../../Components';

import { TRANSACTIONS } from '../../_shared/api/data/mock/transaction';
import ROUTES from '../../_shared/constant/routes';

const TransactionScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <BaseScreen
      headerProps={{
        allowBack: false,
        centerComponent: <MonthNavigator />,
      }}
      fabProps={{
        show: true,
        placement: 'right',
        iconName: 'add',
        iconColor: theme.colors.white,
        color: theme.colors.primary,
        onPress: () => navigation.navigate(ROUTES.transactionForm),
      }}>
      <AggrSummary
        aggrs={[
          { label: 'Income', amount: '100' },
          { label: 'Expense', amount: '-200' },
        ]}
      />
      <BaseScrollView showsVerticalScrollIndicator={false}>
        {TRANSACTIONS.map((t, i) => (
          <DailyTransactions
            key={i}
            transactions={t.transactions}
            timestamp={t.timestamp}
          />
        ))}
      </BaseScrollView>
    </BaseScreen>
  );
};

export default TransactionScreen;
