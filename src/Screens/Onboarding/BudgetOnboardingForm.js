import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BaseBottomSheet,
  BaseButton,
  BaseCurrencyInput,
  BaseKeyboardAwareScrollView,
  BaseScreen,
  BaseText,
  TouchInput,
} from '../../Components';
import { BUDGET_TYPES, BUDGET_TYPE_MONTHLY } from '../../_shared/apis/enum';
import { getBudgetTypes } from '../../_shared/util';

const BudgetOnboardingForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const { budgetForm = {}, setBudgetForm = function () {} } =
    route?.params || {};

  const {
    category_name: categoryName,
    budget_type: budgetType = BUDGET_TYPE_MONTHLY,
    amount = 0,
  } = budgetForm;

  const [isBudgetTypeModalVisible, setIsBudgetTypeModalVisible] =
    useState(false);
  const toggleBudgetTypeModal = () => {
    setIsBudgetTypeModalVisible(!isBudgetTypeModalVisible);
  };

  return (
    <BaseScreen
      headerProps={{
        allowBack: true,
        centerComponent: (
          <View style={styles.header}>
            <BaseText h2>Add Budget</BaseText>
          </View>
        ),
      }}>
      <BaseKeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        enableOnAndroid={true}
        keyboardOpeningTime={0}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formBody}>
        <TouchInput label="Category" value={categoryName} disabled={true} />

        <TouchInput
          label="Budget Type"
          value={BUDGET_TYPES[budgetType]}
          onPress={toggleBudgetTypeModal}
        />
        <BaseBottomSheet
          label="name"
          isVisible={isBudgetTypeModalVisible}
          onBackdropPress={toggleBudgetTypeModal}
          close={toggleBudgetTypeModal}
          items={getBudgetTypes()}
        />

        <BaseCurrencyInput label="Amount" value={budgetForm.amount} />

        <BaseButton title="Add" size="lg" width={200} />
      </BaseKeyboardAwareScrollView>
    </BaseScreen>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    formBody: {
      paddingVertical: theme.spacing.xl,
    },
  });

export default BudgetOnboardingForm;
