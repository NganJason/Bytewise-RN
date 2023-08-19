import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import {
  AmountText,
  BaseRow,
  BaseScrollView,
  BaseText,
  IconButton,
} from '../../Components';
import { BUDGET_TYPE_MONTHLY } from '../../_shared/apis/enum';
import ROUTES from '../../_shared/constant/routes';

const BudgetOnboarding = ({ data = {}, setData = function () {} }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const { categoryBudgets = [] } = data;

  const renderRows = () => {
    let rows = [];

    categoryBudgets.map((cb, idx) => {
      let { amount = 0, budget_type = BUDGET_TYPE_MONTHLY } = cb?.budget || {};

      rows.push(
        <BaseRow key={idx} disabled>
          <BaseText>{cb.category_name}</BaseText>

          {amount === 0 ? (
            <IconButton
              type="clear"
              iconName="plus"
              iconType="entypo"
              color={theme.colors.color8}
              iconSize={20}
              align="flex-start"
              onPress={() => {
                navigation.navigate(ROUTES.budgetOnboardingForm);
              }}
            />
          ) : (
            <AmountText>{amount}</AmountText>
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
    subtitle: {
      marginTop: 10,
      marginBottom: 12,
      color: theme.colors.color8,
    },
  });
};

export default BudgetOnboarding;
