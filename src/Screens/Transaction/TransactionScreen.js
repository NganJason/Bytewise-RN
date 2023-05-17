import { useTheme } from '@rneui/themed';

import {
  BaseScreen,
  DateNavigator,
  DailyTransactions,
  AggrSummary,
  BaseScrollView,
} from '../../Components';

import { TRANSACTIONS } from '../../_shared/mock_data/transaction';
import ROUTES from '../../_shared/constant/routes';

const TransactionScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <BaseScreen
      headerProps={{
        allowBack: false,
        centerComponent: (
          <>
            <DateNavigator />
            <AggrSummary
              aggrs={[
                { label: 'Income', amount: '100' },
                { label: 'Expense', amount: '-200' },
              ]}
            />
          </>
        ),
      }}
      fabProps={{
        show: true,
        placement: 'right',
        iconName: 'add',
        iconColor: theme.colors.white,
        color: theme.colors.primary,
        onPress: () => navigation.navigate(ROUTES.transactionForm),
      }}>
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
