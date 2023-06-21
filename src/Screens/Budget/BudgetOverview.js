import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { BaseScrollView, BaseText } from '../../Components';
import { EmptyContent } from '../../Components/Common';
import {
  BUDGET_TYPE_ANNUAL,
  BUDGET_TYPE_MONTHLY,
} from '../../_shared/apis/enum';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import ROUTES from '../../_shared/constant/routes';
import BudgetOverviewRow from './BudgetOverviewRow';

const MockData = [
  {
    budget_id: '123',
    budget_type: BUDGET_TYPE_MONTHLY,
    budget_name: 'living cost',
    amount: 500,
    used: 100,
  },
  {
    budget_id: '124',
    budget_type: BUDGET_TYPE_MONTHLY,
    budget_name: 'utilities',
    amount: 600,
    used: 600,
  },
  {
    budget_id: '126',
    budget_type: BUDGET_TYPE_MONTHLY,
    budget_name: 'entertainment',
    amount: 200,
    used: 190,
  },
  {
    budget_id: '127',
    budget_type: BUDGET_TYPE_ANNUAL,
    budget_name: 'travel',
    amount: 3000,
    used: 1000,
  },
  {
    budget_id: '128',
    budget_type: BUDGET_TYPE_ANNUAL,
    budget_name: 'supplement',
    amount: 300,
    used: 100,
  },
];

const BudgetOverview = ({ activeDate = new Date() }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const renderRows = (type = BUDGET_TYPE_MONTHLY) => {
    let rows = [];

    MockData.map(budget => {
      if (budget.budget_type !== type) {
        return;
      }

      rows.push(<BudgetOverviewRow key={budget.budget_id} budget={budget} />);
    });

    if (rows.length === 0) {
      return (
        <EmptyContent
          item={
            type === BUDGET_TYPE_MONTHLY
              ? EmptyContentConfig.monthlyBudget
              : EmptyContentConfig.annualBudget
          }
          route={ROUTES.budgetForm}
        />
      );
    }

    return rows;
  };

  return (
    <View style={styles.screen}>
      <BaseScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.title}>
            <BaseText h3>Monthly</BaseText>
          </View>
          {renderRows(BUDGET_TYPE_MONTHLY)}
        </View>

        <View style={styles.container}>
          <View style={styles.title}>
            <BaseText h3>Annual</BaseText>
          </View>
          {renderRows(BUDGET_TYPE_ANNUAL)}
        </View>
      </BaseScrollView>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    screen: {
      minHeight: '100%',
    },
    container: {
      minHeight: '35%',
    },
    title: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    row: {
      marginBottom: 10,
    },
    rowInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    aggr: {
      flexDirection: 'row',
    },
    progress: {
      marginTop: 16,
      marginBottom: 20,
    },
  });

export default BudgetOverview;
