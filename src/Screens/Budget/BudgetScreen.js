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

const BudgetScreen = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const getBudgetsQuery = useGetCategoryBudgetsByMonth({
    year: 2023,
    month: 5,
  });
  const [selectedTab, setSelectedTab] = useState(0);

  const onSelectTab = idx => {
    setSelectedTab(idx);
  };

  const renderBudgets = (categoryBudgets = []) => {
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
      );
    });
  };

  return (
    <BaseScreen
      isLoading={getBudgetsQuery.isLoading}
      errorToast={{
        show: getBudgetsQuery.isError,
        message1: getBudgetsQuery.error?.message,
        onHide: getBudgetsQuery.reset,
      }}
      headerProps={{
        allowBack: true,
        centerComponent: (
          <View style={styles.header}>
            <BaseText h2>Budget</BaseText>
            <DateNavigator />
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
  });
};

export default BudgetScreen;
