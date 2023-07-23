import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BaseButton, BaseText } from '../../Components';
import { EmptyContent, InfoToolTip } from '../../Components/Common';
import { BaseLoadableView, BaseScrollView } from '../../Components/View';
import {
  BUDGET_TYPE_ANNUAL,
  BUDGET_TYPE_MONTHLY,
} from '../../_shared/apis/enum';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import { toolTipMessage } from '../../_shared/constant/message';
import ROUTES from '../../_shared/constant/routes';
import useDimension from '../../_shared/hooks/dimension';
import { useError } from '../../_shared/hooks/error';
import { useAggrTransactions } from '../../_shared/query';
import { useGetBudgets } from '../../_shared/query/budget';
import { getBudgetAmountFromBreakdown } from '../../_shared/util/budget';
import {
  getDateString,
  getMonth,
  getUnixRangeOfMonth,
  getUnixRangeOfYear,
  getYear,
} from '../../_shared/util/date';
import BudgetOverviewRow from './BudgetOverviewRow';

const BudgetOverview = ({ activeDate = new Date() }) => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);
  const navigation = useNavigation();

  const [monthRange, setMonthRange] = useState(
    getUnixRangeOfMonth(getYear(activeDate), getMonth(activeDate)),
  );

  const [yearRange, setYearRange] = useState(
    getUnixRangeOfYear(getYear(activeDate)),
  );

  useEffect(() => {
    setMonthRange(
      getUnixRangeOfMonth(getYear(activeDate), getMonth(activeDate)),
    );
    setYearRange(getUnixRangeOfYear(getYear(activeDate)));
  }, [activeDate]);

  const getBudgets = useGetBudgets({
    date: getDateString(activeDate),
  });

  const getBudgetIDs = (type = BUDGET_TYPE_MONTHLY) => {
    let budgets =
      getBudgets?.data?.budgets?.filter(
        budget => budget.budget_type === type,
      ) || [];

    return budgets.map(budget => budget.budget_id);
  };

  const aggrMonthlyBudgets = useAggrTransactions(
    {
      budget_ids: getBudgetIDs(BUDGET_TYPE_MONTHLY),
      transaction_time: {
        gte: monthRange[0],
        lte: monthRange[1],
      },
    },
    {
      enabled:
        (!getBudgets.isLoading &&
          !getBudgets.isError &&
          getBudgets.data?.budgets?.length !== 0) ||
        false,
    },
  );

  const aggrAnnualBudgets = useAggrTransactions(
    {
      budget_ids: getBudgetIDs(BUDGET_TYPE_ANNUAL),
      transaction_time: {
        gte: yearRange[0],
        lte: yearRange[1],
      },
    },
    {
      enabled:
        (!getBudgets.isLoading &&
          !getBudgets.isError &&
          getBudgets.data?.budgets?.length !== 0) ||
        false,
    },
  );

  const renderRows = (type = BUDGET_TYPE_MONTHLY) => {
    let rows = [];
    let budgets = getBudgets?.data?.budgets || [];

    budgets.map(budget => {
      if (budget.budget_type !== type) {
        return;
      }

      let amount = getBudgetAmountFromBreakdown(
        activeDate,
        budget.budget_breakdowns,
        budget.budget_type,
      );

      let used = 0;
      if (type === BUDGET_TYPE_MONTHLY) {
        used = aggrMonthlyBudgets.data?.results?.[budget.budget_id]?.sum || 0;
      } else {
        used = aggrAnnualBudgets.data?.results?.[budget.budget_id]?.sum || 0;
      }

      budget.amount = amount;
      budget.used = used;
      rows.push(<BudgetOverviewRow key={budget.budget_id} budget={budget} />);
    });

    if (rows.length === 0 && !isScreenLoading()) {
      return (
        <EmptyContent
          item={
            type === BUDGET_TYPE_MONTHLY
              ? EmptyContentConfig.monthlyBudget
              : EmptyContentConfig.annualBudget
          }
          route={ROUTES.budgetForm}
          routeParam={{ budget_type: type }}
          height="80%"
        />
      );
    }

    return rows;
  };

  const isScreenLoading = () => {
    return (
      getBudgets.isLoading ||
      aggrMonthlyBudgets.isLoading ||
      aggrAnnualBudgets.isLoading
    );
  };

  useError([getBudgets, aggrMonthlyBudgets, aggrAnnualBudgets]);

  return (
    <View style={styles.screen}>
      <View style={styles.buttonContainer}>
        <BaseButton
          title="Edit"
          type="secondary"
          align="flex-end"
          size="sm"
          onPress={() => navigation.navigate(ROUTES.budgetList)}
        />
      </View>

      <BaseScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View style={styles.container}>
            <View style={styles.title}>
              <BaseText h3>Monthly</BaseText>
            </View>
            <BaseLoadableView isLoading={isScreenLoading()}>
              {renderRows(BUDGET_TYPE_MONTHLY)}
            </BaseLoadableView>
          </View>

          <View style={styles.container}>
            <View style={styles.title}>
              <BaseText h3 margin={{ right: 8 }}>
                Annual
              </BaseText>
              <InfoToolTip
                title={toolTipMessage.annualBudgetDesc.title}
                message={toolTipMessage.annualBudgetDesc.text}
              />
            </View>
            <BaseLoadableView isLoading={isScreenLoading()}>
              {renderRows(BUDGET_TYPE_ANNUAL)}
            </BaseLoadableView>
          </View>
        </View>
      </BaseScrollView>
    </View>
  );
};

const getStyles = (theme, screenHeight) =>
  StyleSheet.create({
    screen: {
      minHeight: '100%',
    },
    container: {
      marginBottom: theme.spacing.xl,
      minHeight: screenHeight * 0.25,
    },
    title: {
      flexDirection: 'row',
      alignItems: 'center',
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
