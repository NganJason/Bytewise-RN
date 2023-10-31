import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BaseBottomSheet,
  BaseButton,
  BaseMonetaryInput,
  BaseKeyboardAwareScrollView,
  BaseScreen,
  BaseText,
  BudgetTypeDesc,
  TouchInput,
} from '../../Components';
import {
  BUDGET_REPEAT_ALL_TIME,
  BUDGET_TYPES,
  BUDGET_TYPE_MONTHLY,
} from '../../_shared/apis/enum';
import {
  BottomToastContext,
  OnboardingDataContext,
} from '../../_shared/context';
import { getBudgetTypes, getDateStringWithoutDelim } from '../../_shared/util';

const BudgetOnboardingForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const { toast } = useContext(BottomToastContext);

  const { categoryIdx = 0 } = route?.params || {};

  const { data, addBudget, isBudgetTypeDescShown, markBudgetTypeDesc } =
    useContext(OnboardingDataContext);
  const { categoryBudgets = [] } = data;
  const { category_name: categoryName = '', budget = {} } =
    categoryBudgets[categoryIdx] || {};

  const [budgetForm, setBudgetForm] = useState({
    amount: budget?.amount || 0,
    budget_type: budget?.budget_type || BUDGET_TYPE_MONTHLY,
    budget_repeat: BUDGET_REPEAT_ALL_TIME,
    budget_date: getDateStringWithoutDelim(),
  });

  useEffect(() => {
    if (!isBudgetTypeDescShown()) {
      toast.custom(<BudgetTypeDesc />);
      markBudgetTypeDesc();
    }
  }, [isBudgetTypeDescShown, markBudgetTypeDesc, toast]);

  const [isBudgetTypeModalVisible, setIsBudgetTypeModalVisible] =
    useState(false);
  const toggleBudgetTypeModal = () => {
    setIsBudgetTypeModalVisible(!isBudgetTypeModalVisible);
  };

  const onAmountChange = e => {
    setBudgetForm({ ...budgetForm, amount: e });
  };

  const onBudgetTypeChange = e => {
    setBudgetForm({ ...budgetForm, budget_type: e.value });
    toggleBudgetTypeModal();
  };

  const onAdd = () => {
    addBudget(categoryIdx, budgetForm);
    navigation.goBack();
  };

  return (
    <BaseScreen
      scrollable
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
          value={BUDGET_TYPES[budgetForm.budget_type]}
          onPress={toggleBudgetTypeModal}
          tooltip={{ customChildren: <BudgetTypeDesc /> }}
        />
        <BaseBottomSheet
          label="name"
          isVisible={isBudgetTypeModalVisible}
          onBackdropPress={toggleBudgetTypeModal}
          close={toggleBudgetTypeModal}
          items={getBudgetTypes()}
          onSelect={onBudgetTypeChange}
        />

        <BaseMonetaryInput
          label="Amount"
          value={budgetForm.amount}
          currency={data.currency}
          onChangeText={onAmountChange}
          autoFocus={isBudgetTypeDescShown()}
        />

        <BaseButton title="Add" size="lg" width={200} onPress={onAdd} />
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
