import { useState, useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

import {
  BaseScreen,
  BaseText,
  BaseButton,
  BaseInput,
  BaseCurrencyInput,
  BaseToggle,
} from '../../Components';

import {
  BUDGET_TYPE_MONTHLY,
  BUDGET_TYPE_ANNUAL,
  BUDGET_TYPES,
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../../_shared/api/data/model';

import { useCreateCategory } from '../../_shared/api/mutations/category';
import { validateCategory } from '../../_shared/api/dao/category';

const categoryTypes = [
  {
    label: TRANSACTION_TYPES[TRANSACTION_TYPE_INCOME],
    value: TRANSACTION_TYPE_INCOME,
  },
  {
    label: TRANSACTION_TYPES[TRANSACTION_TYPE_EXPENSE],
    value: TRANSACTION_TYPE_EXPENSE,
  },
];

const budgetTypes = [
  {
    label: 'None',
    value: 0,
  },
  {
    label: BUDGET_TYPES[BUDGET_TYPE_MONTHLY],
    value: BUDGET_TYPE_MONTHLY,
  },
  {
    label: BUDGET_TYPES[BUDGET_TYPE_ANNUAL],
    value: BUDGET_TYPE_ANNUAL,
  },
];

const CategoryForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [categoryForm, setCategoryForm] = useState(
    route.params?.category || {
      category_name: '',
      category_type: categoryTypes[0].value,
    },
  );

  const onCategoryNameChange = e => {
    setCategoryForm({ ...categoryForm, category_name: e });
  };

  const onCategoryTypeChange = e => {
    setCategoryForm({ ...categoryForm, category_type: e.value });
  };

  const navigation = useNavigation();

  const createCategory = useCreateCategory({ onSuccess: navigation.goBack });

  const [budgetForm, setBudgetForm] = useState(
    route.params?.budget || {
      amount: '',
      budget_type: budgetTypes[0].value,
    },
  );

  const budgetAmountRef = useRef(null);

  useEffect(() => {
    if (budgetForm.budget_type !== 0) {
      budgetAmountRef.current.focus();
    }
  }, [budgetForm.budget_type]);

  const onAmountChange = e => {
    setBudgetForm({ ...budgetForm, amount: e });
  };

  const onBudgetTypeChange = e => {
    setBudgetForm({ ...budgetForm, budget_type: e.value });
  };

  const onFormSubmit = () => {
    createCategory.mutate(categoryForm);
  };

  const isValidCategory = () => {
    try {
      validateCategory(categoryForm);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <BaseScreen
      errorToast={{
        show: createCategory.isError,
        message1: createCategory.error?.message,
        onHide: createCategory.reset,
      }}
      headerProps={{
        allowBack: true,
        centerComponent: <BaseText h2>Category</BaseText>,
      }}>
      <View style={styles.formBody}>
        <BaseInput
          label="Category Name"
          value={categoryForm.category_name}
          onChangeText={onCategoryNameChange}
          clearButtonMode="always"
          autoFocus={true}
        />
        <BaseToggle
          label="Category Type"
          items={categoryTypes}
          value={categoryForm.category_type}
          onToggle={onCategoryTypeChange}
        />
        <BaseToggle
          label="Budget Type"
          items={budgetTypes}
          value={budgetForm.budget_type}
          onToggle={onBudgetTypeChange}
        />
        {budgetForm.budget_type !== 0 && (
          <BaseCurrencyInput
            ref={budgetAmountRef}
            label="Budget Amount"
            value={budgetForm.amount}
            onChangeText={onAmountChange}
          />
        )}
        <BaseButton
          title="Save"
          size="lg"
          width={200}
          onPress={onFormSubmit}
          loading={createCategory.isLoading}
          disabled={!isValidCategory()}
        />
      </View>
    </BaseScreen>
  );
};

const getStyles = _ => {
  return StyleSheet.create({
    formBody: {
      paddingVertical: 22,
    },
  });
};

export default CategoryForm;
