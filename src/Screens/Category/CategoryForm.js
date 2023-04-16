import { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme, Icon } from '@rneui/themed';
import Collapsible from 'react-native-collapsible';

import {
  BaseScreen,
  BaseText,
  BaseButton,
  BaseInput,
  BaseCurrencyInput,
  BaseCheckbox,
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
import { useNavigation } from '@react-navigation/native';

const CategoryForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [categoryForm, setCategoryForm] = useState(
    route.params?.category || {
      category_id: '',
      category_name: '',
      category_type: TRANSACTION_TYPE_EXPENSE,
    },
  );

  const onCategoryNameChange = e => {
    setCategoryForm({ ...categoryForm, category_name: e });
  };

  const onCategoryTypeChange = e => {
    setCategoryForm({ ...categoryForm, category_type: e });
  };

  const navigation = useNavigation();

  const createCategory = useCreateCategory({ onSuccess: navigation.goBack });

  const [budgetForm, setBudgetForm] = useState(
    route.params?.budget || {
      budget_id: '',
      amount: '',
      budget_type: BUDGET_TYPE_MONTHLY,
    },
  );

  const budgetAmountRef = useRef(null);

  useEffect(() => {
    if (isBudgetFormExpanded) {
      budgetAmountRef.current.focus();
    } else {
      budgetAmountRef.current.blur();
    }
  }, [isBudgetFormExpanded]);

  const [isBudgetFormExpanded, setIsBudgetFormExpanded] = useState(
    budgetForm.budget_id !== '',
  );

  const toggleBudgetForm = () => {
    setIsBudgetFormExpanded(!isBudgetFormExpanded);
  };

  const onAmountChange = e => {
    setBudgetForm({ ...budgetForm, amount: e });
  };

  const onBudgetTypeChange = e => {
    setBudgetForm({ ...budgetForm, budget_type: e });
  };

  const renderBudgetToggle = () => {
    if (isBudgetFormExpanded) {
      return {
        icon: (
          <Icon
            name="trash-o"
            type="font-awesome"
            color={theme.colors.red}
            style={styles.budgetToggleIcon}
          />
        ),
        text: <BaseText h4>Remove Budget</BaseText>,
      };
    }
    return {
      icon: (
        <Icon
          name="plus"
          type="entypo"
          color={theme.colors.color5}
          style={styles.budgetToggleIcon}
        />
      ),
      text: <BaseText h4>Add Budget</BaseText>,
    };
  };
  const budgetToggle = renderBudgetToggle();

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
          autoFocus={categoryForm.category_id === ''}
        />
        <View style={styles.checkboxes}>
          <BaseCheckbox
            title={TRANSACTION_TYPES[TRANSACTION_TYPE_EXPENSE]}
            checked={categoryForm.category_type === TRANSACTION_TYPE_EXPENSE}
            onPress={() => {
              onCategoryTypeChange(TRANSACTION_TYPE_EXPENSE);
            }}
          />
          <BaseCheckbox
            title={TRANSACTION_TYPES[TRANSACTION_TYPE_INCOME]}
            checked={categoryForm.category_type === TRANSACTION_TYPE_INCOME}
            onPress={() => {
              onCategoryTypeChange(TRANSACTION_TYPE_INCOME);
            }}
          />
        </View>
        <TouchableOpacity
          onPress={toggleBudgetForm}
          style={styles.budgetToggleButton}>
          {budgetToggle.icon}
          {budgetToggle.text}
        </TouchableOpacity>

        <View style={isBudgetFormExpanded && styles.collapsible}>
          <Collapsible collapsed={!isBudgetFormExpanded}>
            <>
              <BaseCurrencyInput
                ref={budgetAmountRef}
                label="Amount"
                value={budgetForm.amount}
                onChangeText={onAmountChange}
              />
              <View style={styles.checkboxes}>
                <BaseCheckbox
                  title={BUDGET_TYPES[BUDGET_TYPE_MONTHLY]}
                  checked={budgetForm.budget_type === BUDGET_TYPE_MONTHLY}
                  onPress={() => {
                    onBudgetTypeChange(BUDGET_TYPE_MONTHLY);
                  }}
                />
                <BaseCheckbox
                  title={BUDGET_TYPES[BUDGET_TYPE_ANNUAL]}
                  checked={budgetForm.budget_type === BUDGET_TYPE_ANNUAL}
                  onPress={() => {
                    onBudgetTypeChange(BUDGET_TYPE_ANNUAL);
                  }}
                />
              </View>
            </>
          </Collapsible>
        </View>
        <BaseButton
          title="Save"
          size="lg"
          width={200}
          onPress={() => createCategory.mutate(categoryForm)}
          loading={createCategory.isLoading}
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
    budgetToggleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    collapsible: {
      marginBottom: 20,
    },
    budgetToggleIcon: {
      marginRight: 8,
    },
    checkboxes: {
      marginBottom: 24,
      flexDirection: 'row',
    },
  });
};

export default CategoryForm;
