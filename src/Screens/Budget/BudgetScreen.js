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
import { allBudgets } from '../../_shared/mock_data/all_budgets';
import {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../../_shared/apis/1_enum';

const BudgetScreen = () => {
  const [budgets] = useState(allBudgets);
  const [selectedTab, setSelectedTab] = useState(0);

  const theme = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const onSelectTab = idx => {
    setSelectedTab(idx);
  };

  const renderBudgets = () => {
    return budgets.map(budget => {
      if (budget.budget_type !== selectedTab + 1) {
        return;
      }
      return (
        <BaseRow
          key={budget.budget_id}
          onPress={() =>
            navigation.navigate(ROUTES.budgetForm, {
              budgetID: budget.budget_id,
            })
          }>
          <BaseText>{budget.cat_name}</BaseText>
          <AmountText>{budget.default_budget}</AmountText>
        </BaseRow>
      );
    });
  };

  return (
    <BaseScreen
      headerProps={{
        allowBack: true,
        centerComponent: (
          <View style={styles.header}>
            <BaseText h2>Budget</BaseText>
            <DateNavigator year />
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

export default BudgetScreen;
