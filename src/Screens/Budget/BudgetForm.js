import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Dimensions } from 'react-native';
import {
  BaseButton,
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

const windowWidth = Dimensions.get('window').width;

const BudgetForm = ({ route }) => {
  const styles = getStyles();
  const navigation = useNavigation();
  const { params: { category_id = '', category_name = '' } = {} } = route;

  const setBudget = useSetBudget();
  const getBudgetBreakdownQuery = useGetAnnualBudgetBreakdown({
    category_id: category_id,
    year: 2023,
  });

  const {
    budget_type = 0,
    default_budget = 0,
    monthly_budgets = [],
  } = getBudgetBreakdownQuery?.data?.annual_budget_breakdown || {};

  const onBudgetTypeChange = budgetType => {
    setBudget.mutate({
      category_id: category_id,
      year: 2023,
      budget_config: {
        budget_type: Number(budgetType),
      },
    });
  };

  const onDefaultBudgetChange = (_, amount) => {
    setBudget.mutate({
      category_id: category_id,
      year: 2023,
      default_budget: {
        budget_amount: Number(amount),
      },
    });
  };

  const onBudgetChange = (month, amount) => {
    setBudget.mutate({
      category_id: category_id,
      year: 2023,
      monthly_budget: {
        month: month,
        budget_amount: Number(amount),
      },
    });
  };

  const onSave = () => {
    navigation.goBack();
  };

  const renderBudgets = () => {
    const comps = [];
    comps.push(
      <Budget
        key="default"
        title="Default Budget"
        year={getYear()}
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
            highlight={Number(d.month) === getMonth()}
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
            <DateNavigator year />
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

      <View style={styles.btnContainer}>
        <BaseButton
          title="Cancel"
          type="outline"
          size="lg"
          width={windowWidth / 2.5}
          marginVertical={10}
          onPress={() => navigation.goBack()}
        />
        <BaseButton
          title="Save"
          size="lg"
          width={windowWidth / 2.5}
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      marginBottom: 30,
    },
  });
};

export default BudgetForm;
