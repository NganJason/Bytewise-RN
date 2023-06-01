import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import {
  AmountText,
  BaseScreen,
  BaseScrollView,
  BaseText,
  DateNavigator,
} from '../../Components';
import { BaseRow, BaseTabView } from '../../Components/View';
import ROUTES from '../../_shared/constant/routes';
import {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../../_shared/apis/enum';
import { useGetCategoryBudgetsByMonth } from '../../_shared/query';
import { getMonth, getYear } from '../../_shared/util/date';
import { renderErrorsToast } from '../../_shared/util/toast';

const BudgetScreen = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const [selectedTab, setSelectedTab] = useState(0);
  const onSelectTab = idx => {
    setSelectedTab(idx);
  };

  const [activeDate, setActiveDate] = useState(new Date());
  const onDateChange = e => {
    setActiveDate(e);
  };

  const getBudgetsQuery = useGetCategoryBudgetsByMonth(
    {
      year: getYear(activeDate),
      month: getMonth(activeDate),
    },
    {
      queryOnChange: [activeDate],
    },
  );

  const renderBudgets = (categoryBudgets = []) => {
    categoryBudgets.sort((a, b) =>
      a.category.category_name.localeCompare(b.category.category_name),
    );

    return categoryBudgets.map(cb => {
      const {
        category_type = 0,
        category_id = '',
        category_name = '',
      } = cb.category || {};

      const { budget_amount = 0 } = cb.budget || {};

      if (category_type !== selectedTab + 1) {
        return;
      }

      return (
        <View style={styles.row}>
          <BaseRow
            key={category_id}
            onPress={() =>
              navigation.navigate(ROUTES.budgetForm, {
                category_id: category_id,
                category_name: category_name,
              })
            }>
            <BaseText>{category_name}</BaseText>
            <AmountText>{budget_amount}</AmountText>
          </BaseRow>
        </View>
      );
    });
  };

  return (
    <BaseScreen
      isLoading={getBudgetsQuery.isLoading}
      errorToast={renderErrorsToast([getBudgetsQuery])}
      headerProps={{
        allowBack: true,
        centerComponent: (
          <View style={styles.header}>
            <BaseText h2>Budget</BaseText>
            <DateNavigator
              startingDate={activeDate}
              onForward={onDateChange}
              onBackward={onDateChange}
            />
          </View>
        ),
      }}>
      <BaseTabView
        onPress={onSelectTab}
        selectedIndex={selectedTab}
        titles={[
          TRANSACTION_TYPES[TRANSACTION_TYPE_EXPENSE],
          TRANSACTION_TYPES[TRANSACTION_TYPE_INCOME],
        ]}
      />
      <BaseScrollView showsVerticalScrollIndicator={false}>
        {renderBudgets(getBudgetsQuery.data?.category_budgets)}
      </BaseScrollView>
    </BaseScreen>
  );
};

const getStyles = _ => {
  return StyleSheet.create({
    header: {
      alignItems: 'center',
    },
    row: {
      marginTop: 5,
    },
  });
};

export default BudgetScreen;
