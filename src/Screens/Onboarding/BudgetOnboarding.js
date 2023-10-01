import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  AmountText,
  BaseRow,
  BaseScrollView,
  BaseText,
  IconButton,
} from '../../Components';
import { BaseChip } from '../../Components/View';
import {
  BUDGET_TYPES,
  BUDGET_TYPE_MONTHLY,
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../../_shared/apis/enum';
import ROUTES from '../../_shared/constant/routes';
import { OnboardingDataContext } from '../../_shared/context';
import { Amount } from '../../_shared/object';

const BudgetOnboarding = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const { data } = useContext(OnboardingDataContext);
  const { categoryBudgets = [] } = data;

  const renderRows = () => {
    let rows = [];

    categoryBudgets.map((cb, idx) => {
      let { category_type: categoryType = TRANSACTION_TYPE_EXPENSE } = cb || {};
      let { amount = 0, budget_type: budgetType = null } = cb?.budget || {};

      // Income cannot have budget
      if (categoryType === TRANSACTION_TYPE_INCOME) {
        return;
      }

      rows.push(
        <BaseRow
          key={idx}
          onPress={() => {
            navigation.navigate(ROUTES.budgetOnboardingForm, {
              categoryIdx: idx,
            });
          }}>
          <View style={styles.category}>
            <BaseText>{cb.category_name}</BaseText>
            {budgetType !== null && (
              <BaseChip
                type={
                  budgetType === BUDGET_TYPE_MONTHLY ? 'primary' : 'secondary'
                }>
                {BUDGET_TYPES[budgetType]}
              </BaseChip>
            )}
          </View>

          {amount === 0 ? (
            <IconButton
              type="clear"
              iconName="plus"
              iconType="entypo"
              color={theme.colors.color8}
              iconSize={20}
              align="flex-start"
              onPress={() => {
                navigation.navigate(ROUTES.budgetOnboardingForm, {
                  categoryIdx: idx,
                });
              }}
            />
          ) : (
            <AmountText amount={new Amount(amount, data.currency)} />
          )}
        </BaseRow>,
      );
    });

    return rows;
  };

  return (
    <View style={styles.container}>
      <View>
        <BaseText h1>Allocate budgets</BaseText>
        <BaseText h1>to your categories</BaseText>
        <BaseText text2 style={styles.subtitle}>
          How much do you wish to spend for each category?
        </BaseText>
      </View>
      <BaseScrollView showsVerticalScrollIndicator={false}>
        {renderRows()}
      </BaseScrollView>
    </View>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    category: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    subtitle: {
      marginTop: 10,
      marginBottom: 12,
      color: theme.colors.color8,
    },
  });
};

export default BudgetOnboarding;
