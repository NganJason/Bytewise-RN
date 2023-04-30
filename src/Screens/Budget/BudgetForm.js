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
import { MONTHS, MONTHS_VALUE } from '../../_shared/constant/constant';
import { getCurrMonth } from '../../_shared/util/date';
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
        amount={default_budget}
        onChange={onDefaultBudgetChange}
      />,
    );

    budget_breakdown.forEach(d => {
      if (d.month > MONTHS_VALUE.Dec || d.month < MONTHS_VALUE.Jan) {
        return;
      }

      comps.push(
        <Budget
          key={d.month}
          title={MONTHS[d.month]}
          amount={d.budget}
          highlight={Number(d.month) === getCurrMonth()}
        />,
      );
    });

    return comps;
  };

  const onDefaultBudgetChange = () => {};

  const onBudgetChange = (label, e) => {
    let { budget_breakdown: breakdown = [] } = budgetForm;

    breakdown.forEach((b, idx) => {
      if (b.month === Number(label)) {
        breakdown[idx].budget = Number(e);
      }
    });

    setBudgetForm({ ...budgetForm, budget_breakdown: breakdown });
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
