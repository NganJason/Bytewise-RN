import { useNavigation } from '@react-navigation/native';
import { Icon, useTheme } from '@rneui/themed';
import { useEffect, useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  BaseBottomSheet,
  BaseButton,
  BaseCurrencyInput,
  BaseInput,
  BaseScreen,
  BaseText,
  TouchInput,
} from '../../Components';
import DatePickerInput from '../../Components/Input/DatePickerInput';
import MultiSelectBottomInput from '../../Components/Input/MultiSelectBottomInput';
import { DatePickerMode } from '../../Components/Input/Picker/DatePicker';
import {
  BUDGET_TYPES,
  BUDGET_TYPE_ANNUAL,
  BUDGET_TYPE_MONTHLY,
  TRANSACTION_TYPE_EXPENSE,
} from '../../_shared/apis/enum';
import { validateBudget } from '../../_shared/apis/budget';
import { getBudgetTypes } from '../../_shared/util/budget';
import { useSetBudget } from '../../_shared/mutations';
import { getDateString } from '../../_shared/util/date';
import { useGetCategories } from '../../_shared/query';
import { useGetBudget } from '../../_shared/query/budget';
import EmptyContent from '../../Components/Common/EmptyContent';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import ROUTES from '../../_shared/constant/routes';

const BudgetForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const budgetID = route.params?.budget_id || '';
  const isAddBudget = () => {
    return budgetID === '';
  };

  const targetDateString = route.params?.target_date_string || '';
  const targetDate = useMemo(() => {
    if (targetDateString !== '') {
      return new Date(targetDateString);
    }
    return new Date();
  }, [targetDateString]);

  const [budgetForm, setBudgetForm] = useState({
    budget_name: '',
    budget_type: BUDGET_TYPE_MONTHLY,
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

  const onBudgetNameChange = e => {
    setBudgetForm({ ...budgetForm, budget_name: e });
  };

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

  const onFromDateChange = e => {
    setBudgetForm({ ...budgetForm, from_date: e });
  };

  const onToDateChange = e => {
    setBudgetForm({ ...budgetForm, to_date: e });
  };

  const onSave = () => {
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

  const isValidBudget = () => {
    try {
      validateBudget({
        ...budgetForm,
      });
      return true;
    } catch (e) {
      return false;
    }
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

  return (
    <BaseScreen
      isLoading={isFormLoading()}
      headerProps={{
        allowBack: true,
        centerComponent: (
          <View style={styles.header}>
            <BaseText h2>
              {isAddBudget() ? 'Add budget' : 'Edit budget'}
            </BaseText>
          </View>
        ),
      }}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        enableOnAndroid={true}
        keyboardOpeningTime={0}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formBody}>
        <BaseInput
          label="Budget name"
          value={budgetForm.budget_name}
          onChangeText={onBudgetNameChange}
          clearButtonMode="always"
          maxLength={120}
        />

        <TouchInput
          label="Budget type"
          value={BUDGET_TYPES[budgetForm.budget_type]}
          onPress={toggleBudgetTypeModal}
        />
        <BaseBottomSheet
          isVisible={isBudgetTypeModalVisible}
          onBackdropPress={toggleBudgetTypeModal}
          close={toggleBudgetTypeModal}
          onSelect={onBudgetTypeChange}
          items={getBudgetTypes()}
          label="name"
        />

        <MultiSelectBottomInput
          label="Categories"
          items={getCategoryItems(getCategories.data?.categories)}
          initialSelected={getCategoryItems(
            getBudget?.data?.category_budget?.categories,
          )}
          onChange={onCategoriesChange}
          renderEmptyItems={closeModal => (
            <EmptyContent
              item={EmptyContentConfig.category}
              route={ROUTES.categoryForm}
              onRedirect={closeModal}
            />
          )}
        />

        <BaseCurrencyInput
          label="Amount"
          value={budgetForm.budget_amount}
          onChangeText={onBudgetAmountChange}
        />

        <View style={styles.dateContainer}>
          <View style={styles.dateInput}>
            <DatePickerInput
              label="From"
              dateValue={budgetForm.from_date}
              onSelect={onFromDateChange}
              mode={
                budgetForm.budget_type === BUDGET_TYPE_ANNUAL
                  ? DatePickerMode.Year
                  : DatePickerMode.YearMonth
              }
            />
          </View>

          <View style={styles.arrowIcon}>
            <Icon
              name={'arrow-right'}
              type={'feather'}
              color={theme.colors.color4}
            />
          </View>

          <View style={styles.dateInput}>
            <DatePickerInput
              label="To"
              dateValue={budgetForm.to_date}
              onSelect={onToDateChange}
              mode={
                budgetForm.budget_type === BUDGET_TYPE_ANNUAL
                  ? DatePickerMode.Year
                  : DatePickerMode.YearMonth
              }
            />
          </View>
        </View>

        <View style={styles.btnContainer}>
          <BaseButton
            title="Save"
            size="lg"
            width={200}
            disabled={!isValidBudget()}
            onPress={onSave}
            loading={setBudget.isLoading}
          />
        </View>
      </KeyboardAwareScrollView>
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
