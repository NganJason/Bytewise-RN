import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import {
  BaseButton,
  BaseListItem,
  BaseScreen,
  BaseScrollView,
  BaseText,
  DateNavigator,
} from '../../Components';
import Budget from '../../Components/Common/Budget';
import { monthlyBudgetInfo } from '../../_shared/api/data/mock/budget';
import { MONTHS } from '../../_shared/constant/constant';
import {
  getCurrMonth,
  getCurrYear,
  isMonthValid,
} from '../../_shared/util/date';
import {
  getBudgetTypes,
  getDefaultMonthlyBudgetBreakdown,
} from '../../_shared/util/budget';
import {
  BUDGET_TYPES,
  BUDGET_TYPE_ANNUAL,
  BUDGET_TYPE_MONTHLY,
} from '../../_shared/api/data/model';
import TouchSelector from '../../Components/Input/TouchSelector';

const BudgetForm = () => {
  const styles = getStyles();
  const navigation = useNavigation();

  const [budgetForm, setBudgetForm] = useState(monthlyBudgetInfo);
  const [cachedBudget] = useState(monthlyBudgetInfo);

  const onBudgetTypeChange = e => {
    let { budget_breakdown = [] } = budgetForm;
    let { budget_breakdown: cached_breakdown = [] } = cachedBudget;

    if (Number(e.value) === BUDGET_TYPE_ANNUAL) {
      budget_breakdown = [];
    }

    if (Number(e.value) === BUDGET_TYPE_MONTHLY) {
      if (budget_breakdown.length === 0) {
        budget_breakdown = getDefaultMonthlyBudgetBreakdown(cached_breakdown);
      }
    }

    setBudgetForm({
      ...budgetForm,
      budget_type: e.value,
      budget_breakdown: budget_breakdown,
    });
  };

  const onSave = () => {
    navigation.goBack();
  };

  const renderBudgets = () => {
    const { default_budget = 0, budget_breakdown = [] } = budgetForm;
    const comps = [];

    comps.push(
      <Budget
        key="default"
        title="Default Budget"
        year={getCurrYear()}
        label="default"
        amount={default_budget}
        onValChange={onDefaultBudgetChange}
      />,
    );

    budget_breakdown.forEach(d => {
      if (!isMonthValid(d.month)) {
        return;
      }

      comps.push(
        <Budget
          key={d.month}
          title={MONTHS[d.month]}
          year={getCurrYear()}
          label={d.month}
          amount={d.budget}
          highlight={Number(d.month) === getCurrMonth()}
          onValChange={onBudgetChange}
        />,
      );
    });

    return comps;
  };

  const onDefaultBudgetChange = (_, e) => {
    let currMonth = getCurrMonth();
    let { budget_breakdown: breakdown = [] } = budgetForm;

    let newBreakdown = breakdown.map(d => {
      if (d.month > currMonth) {
        d.budget = e;
      }

      return d;
    });

    setBudgetForm({
      ...budgetForm,
      default_budget: e,
      budget_breakdown: newBreakdown,
    });
  };

  const onBudgetChange = (label, e) => {
    let { budget_breakdown: breakdown = [] } = budgetForm;

    let newBreakdown = breakdown.map(d => {
      if (d.month === Number(label)) {
        d.budget = e;
      }

      return d;
    });

    setBudgetForm({ ...budgetForm, budget_breakdown: newBreakdown });
  };

  return (
    <BaseScreen
      headerProps={{
        allowBack: true,
        centerComponent: (
          <View style={styles.header}>
            <BaseText h2>Personal</BaseText>
            <DateNavigator year />
          </View>
        ),
      }}>
      <BaseScrollView showsVerticalScrollIndicator={false}>
        <BaseListItem showDivider={true}>
          <TouchSelector
            title="Budget Type"
            value={BUDGET_TYPES[budgetForm.budget_type]}
            label="name"
            items={getBudgetTypes()}
            onSelect={onBudgetTypeChange}
          />
        </BaseListItem>
        {renderBudgets()}
      </BaseScrollView>

      <View style={styles.btnContainer}>
        <BaseButton
          title="Cancel"
          type="outline"
          size="lg"
          width={200}
          marginVertical={10}
          onPress={() => navigation.goBack()}
        />
        <BaseButton
          title="Save"
          size="lg"
          width={200}
          marginVertical={5}
          onPress={onSave}
        />
      </View>
    </BaseScreen>
  );
};

const getStyles = _ => {
  return StyleSheet.create({
    header: {
      alignItems: 'center',
    },
    btnContainer: {
      marginBottom: 30,
    },
  });
};

export default BudgetForm;
