import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useEffect, useState, useMemo } from 'react';
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
import {
  BUDGET_TYPES,
  BUDGET_TYPE_MONTHLY,
  TRANSACTION_TYPE_EXPENSE,
} from '../../_shared/apis/enum';
import { validateBudget } from '../../_shared/validator/budget';
import { getBudgetTypes } from '../../_shared/util/budget';
import { useSetBudget } from '../../_shared/mutations';
import { getDateString } from '../../_shared/util/date';
import { useGetCategories } from '../../_shared/query';
import { useGetBudget } from '../../_shared/query/budget';
import EmptyContent from '../../Components/Common/EmptyContent';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import ROUTES from '../../_shared/constant/routes';
import { useValidation } from '../../_shared/hooks/validation';
import { useError } from '../../_shared/hooks/error';

const BudgetForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const {
    budget_id: budgetID = '',
    budget_type: budgetType = BUDGET_TYPE_MONTHLY,
    target_date_string: targetDateString = '',
  } = route?.params || {};
  const isAddBudget = () => {
    return budgetID === '';
  };

  const targetDate = useMemo(() => {
    if (targetDateString !== '') {
      return new Date(targetDateString);
    }
    return new Date();
  }, [targetDateString]);

  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const toggleCategoryModal = () => {
    setIsCategoryModalVisible(!isCategoryModalVisible);
  };
  const onEditCategory = () => {
    navigation.navigate(ROUTES.categoryEdit, {
      category_type: TRANSACTION_TYPE_EXPENSE,
    });
    toggleCategoryModal();
  };

  const [budgetForm, setBudgetForm] = useState({
    budget_name: '',
    budget_type: budgetType,
    budget_amount: 0,
    category_ids: [],
    from_date: targetDate,
    to_date: targetDate,
  });

  const [isBudgetTypeModalVisible, setIsBudgetTypeModalVisible] =
    useState(false);
  const toggleBudgetTypeModal = () => {
    setIsBudgetTypeModalVisible(!isBudgetTypeModalVisible);
  };

  const [formErrors, setFormErrors] = useState({});
  const { validate, showValidation } = useValidation();
  useEffect(() => {
    setFormErrors(validateBudget(budgetForm));
  }, [budgetForm]);

  const getCategories = useGetCategories({
    category_type: TRANSACTION_TYPE_EXPENSE,
  });

  const getBudget = useGetBudget(
    {
      budget_id: budgetID,
      date: getDateString(targetDate),
    },
    { enabled: budgetID !== '' },
  );

  const setBudget = useSetBudget({
    onSuccess: navigation.goBack,
  });

  useEffect(() => {
    if (getBudget.data) {
      let { budget = {}, categories = [] } =
        getBudget?.data?.category_budget || {};

      let ids = [];
      categories.map(category => {
        ids.push(category.category_id);
      });

      let form = {
        budget_name: budget.budget_name,
        budget_type: budget.budget_type,
        category_ids: ids,
        from_date: targetDate,
        to_date: targetDate,
      };

      if (budget.budget_breakdowns.length > 0) {
        let { amount = 0 } = budget.budget_breakdowns[0];
        form.budget_amount = amount;
      }

      setBudgetForm(form);
    }
  }, [getBudget.data, targetDate]);

  const onBudgetTypeChange = e => {
    toggleBudgetTypeModal();
    setBudgetForm({ ...budgetForm, budget_type: e.value });
  };

  const onBudgetAmountChange = e => {
    setBudgetForm({ ...budgetForm, budget_amount: e });
  };

  const onCategoriesChange = categories => {
    let ids = [];
    categories.map(val => {
      ids.push(val.id);
    });

    setBudgetForm({ ...budgetForm, category_ids: ids });
  };

  const onSave = () => {
    validate();
    let isValidationPassed = Object.keys(formErrors).length === 0;

    if (!isValidationPassed) {
      return;
    }

    setBudget.mutate({
      budget_id: budgetID === '' ? null : budgetID,
      budget_name: budgetForm.budget_name,
      budget_type: budgetForm.budget_type,
      budget_amount: String(budgetForm.budget_amount),
      category_ids: budgetForm.category_ids,
      range_start_date: getDateString(budgetForm.from_date),
      range_end_date: getDateString(budgetForm.to_date),
    });
  };

  const isFormLoading = () => {
    return getCategories.isLoading || getBudget.isLoading;
  };

  const getCategoryItems = (categories = []) => {
    let items = [];
    categories.map(val => {
      items.push({ id: val.category_id, name: val.category_name });
    });
    return items;
  };

  useError([getBudget, setBudget]);

  return (
    <BaseScreen
      isLoading={isFormLoading()}
      headerProps={{
        allowBack: true,
        centerComponent: (
          <View style={styles.header}>
            <BaseText h2>
              {isAddBudget() ? 'Add Budget' : 'Edit Budget'}
            </BaseText>
          </View>
        ),
      }}>
      <BaseKeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        enableOnAndroid={true}
        keyboardOpeningTime={0}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formBody}>
        <TouchInput
          label="Category"
          // value={transactionForm.category.category_name}
          onPress={toggleCategoryModal}
          errorMessage={showValidation && formErrors.category}
        />
        <BaseBottomSheet
          isVisible={isCategoryModalVisible}
          onBackdropPress={toggleCategoryModal}
          close={toggleCategoryModal}
          onSelect={onCategoriesChange}
          items={getCategoryItems(getCategories.data?.categories)}
          label="category_name"
          headerProps={{
            leftComponent: (
              <BaseButton
                title="Edit"
                type="clear"
                align="flex-end"
                size="md"
                onPress={onEditCategory}
              />
            ),
          }}
          renderEmptyItems={() => (
            <EmptyContent
              item={EmptyContentConfig.category}
              route={ROUTES.categoryForm}
              routeParam={{ category_type: TRANSACTION_TYPE_EXPENSE }}
              onRedirect={toggleCategoryModal}
            />
          )}
        />

        <TouchInput
          label="Budget Type"
          value={BUDGET_TYPES[budgetForm.budget_type]}
          onPress={toggleBudgetTypeModal}
          errorMessage={showValidation && formErrors.budget_type}
        />
        <BaseBottomSheet
          isVisible={isBudgetTypeModalVisible}
          onBackdropPress={toggleBudgetTypeModal}
          close={toggleBudgetTypeModal}
          onSelect={onBudgetTypeChange}
          items={getBudgetTypes()}
          label="name"
        />

        <BaseCurrencyInput
          label="Amount"
          value={budgetForm.budget_amount}
          onChangeText={onBudgetAmountChange}
          errorMessage={showValidation && formErrors.budget_amount}
        />

        <View style={styles.btnContainer}>
          <BaseButton
            title="Save"
            size="lg"
            width={200}
            onPress={onSave}
            loading={setBudget.isLoading}
          />
        </View>
      </BaseKeyboardAwareScrollView>
    </BaseScreen>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    formBody: {
      paddingVertical: theme.spacing.xl,
    },
    dateContainer: {
      flexDirection: 'row',
      width: '100%',
      alignItem: 'center',
      justifyContent: 'space-between',
    },
    arrowIcon: {
      justifyContent: 'center',
      marginHorizontal: theme.spacing.lg,
    },
    dateInput: {
      flex: 1,
    },
    btnContainer: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
  });

export default BudgetForm;
