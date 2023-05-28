import { StyleSheet, View } from 'react-native';
import {
  BaseListItem,
  BaseScreen,
  BaseScrollView,
  BaseText,
  DateNavigator,
} from '../../Components';
import Budget from '../../Components/Common/Budget';
import { MONTHS } from '../../_shared/constant/constant';
import { getMonth, getYear, isMonthValid } from '../../_shared/util/date';
import { getBudgetTypes } from '../../_shared/util/budget';
import { BUDGET_TYPES, BUDGET_TYPE_MONTHLY } from '../../_shared/apis/enum';
import TouchSelector from '../../Components/Input/TouchSelector';
import { useGetAnnualBudgetBreakdown } from '../../_shared/query';
import { useSetBudget } from '../../_shared/mutations';
import { useState } from 'react';

const BudgetForm = ({ route }) => {
  const styles = getStyles();
  const { params: { category_id = '', category_name = '' } = {} } = route;

  const [activeDate, setActiveDate] = useState(new Date());
  const onDateChange = e => {
    setActiveDate(e);
  };

  const getBudgetBreakdownQuery = useGetAnnualBudgetBreakdown(
    {
      category_id: category_id,
      year: getYear(activeDate),
    },
    {
      queryOnChange: [activeDate],
    },
  );
  const {
    budget_type = 0,
    default_budget = 0,
    monthly_budgets = [],
  } = getBudgetBreakdownQuery?.data?.annual_budget_breakdown || {};

  const setBudget = useSetBudget();

  const onBudgetTypeChange = budgetType => {
    setBudget.mutate({
      category_id: category_id,
      year: getYear(activeDate),
      budget_config: {
        budget_type: Number(budgetType),
      },
    });
  };

  const onDefaultBudgetChange = (_, amount) => {
    setBudget.mutate({
      category_id: category_id,
      year: getYear(activeDate),
      default_budget: {
        budget_amount: Number(amount),
      },
    });
  };

  const onBudgetChange = (month, amount) => {
    setBudget.mutate({
      category_id: category_id,
      year: getYear(activeDate),
      monthly_budget: {
        month: month,
        budget_amount: Number(amount),
      },
    });
  };

  const renderBudgets = () => {
    const comps = [];
    comps.push(
      <Budget
        key="default"
        title="Default Budget"
        year={getYear(activeDate)}
        label="default"
        amount={default_budget}
        onSubmit={onDefaultBudgetChange}
      />,
    );

    if (budget_type === BUDGET_TYPE_MONTHLY) {
      monthly_budgets.forEach(d => {
        const { amount = 0, month = 0, year = 0 } = d;
        if (!isMonthValid(month)) {
          return;
        }

        comps.push(
          <Budget
            key={month}
            title={MONTHS[month]}
            year={year}
            label={month}
            amount={amount}
            highlight={
              Number(d.year) === getYear() && Number(d.month) === getMonth()
            }
            onSubmit={onBudgetChange}
          />,
        );
      });
    }

    return comps;
  };

  return (
    <BaseScreen
      isLoading={getBudgetBreakdownQuery.isLoading || setBudget.isLoading}
      errorToast={{
        show: getBudgetBreakdownQuery.isError,
        message1: getBudgetBreakdownQuery.error?.message,
        onHide: getBudgetBreakdownQuery.reset,
      }}
      headerProps={{
        allowBack: true,
        centerComponent: (
          <View style={styles.header}>
            <BaseText h2>{category_name}</BaseText>
            <DateNavigator
              year
              startingDate={activeDate}
              onForward={onDateChange}
              onBackward={onDateChange}
            />
          </View>
        ),
      }}>
      <BaseScrollView showsVerticalScrollIndicator={false}>
        <BaseListItem showDivider={true}>
          <TouchSelector
            title="Budget Type"
            value={BUDGET_TYPES[budget_type]}
            label="name"
            items={getBudgetTypes()}
            onSelect={e => {
              onBudgetTypeChange(e.value);
            }}
          />
        </BaseListItem>
        {renderBudgets()}
      </BaseScrollView>
    </BaseScreen>
  );
};

const getStyles = _ => {
  return StyleSheet.create({
    header: {
      alignItems: 'center',
    },
  });
};

export default BudgetForm;
