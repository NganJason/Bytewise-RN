import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useEffect, useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BaseBottomSheet,
  BaseButton,
  BaseCheckboxInput,
  BaseCurrencyInput,
  BaseKeyboardAwareScrollView,
  BaseScreen,
  BaseText,
  TouchInput,
} from '../../Components';
import {
  BUDGET_REPEAT_ALL_TIME,
  BUDGET_REPEAT_NOW_TO_FUTURE,
  BUDGET_TYPES,
  BUDGET_TYPE_MONTHLY,
  TRANSACTION_TYPE_EXPENSE,
} from '../../_shared/apis/enum';
import { validateBudget } from '../../_shared/validator/budget';
import { getBudgetTypes } from '../../_shared/util/budget';
import EmptyContent from '../../Components/Common/EmptyContent';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import ROUTES from '../../_shared/constant/routes';
import { useValidation } from '../../_shared/hooks/validation';
import { useError } from '../../_shared/hooks/error';
import { BaseOverlay } from '../../Components/View';
import { useGetCategoriesHelper } from '../../_shared/hooks';
import { useCreateBudget } from '../../_shared/mutations';
import { getDateStringWithoutDelim } from '../../_shared/util/date';

const BudgetForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const {
    category_id: categoryID = '',
    budget_type: budgetType = BUDGET_TYPE_MONTHLY,
    target_date_string: targetDateString = '',
  } = route?.params || {};
  const isAddBudget = () => {
    return categoryID === '';
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

  const [isBudgetTypeModalVisible, setIsBudgetTypeModalVisible] =
    useState(false);
  const toggleBudgetTypeModal = () => {
    setIsBudgetTypeModalVisible(!isBudgetTypeModalVisible);
  };

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const toggleDeleteModal = () => {
    setIsDeleteModalVisible(!isDeleteModalVisible);
  };

  const [budgetForm, setBudgetForm] = useState({
    category_id: '',
    category_name: '',
    budget_type: budgetType,
    amount: 0,
    budget_date: getDateStringWithoutDelim(targetDate),
    budget_repeat: isAddBudget()
      ? BUDGET_REPEAT_ALL_TIME
      : BUDGET_REPEAT_NOW_TO_FUTURE,
  });

  const [formErrors, setFormErrors] = useState({});
  const { validate, showValidation } = useValidation();
  useEffect(() => {
    setFormErrors(validateBudget(budgetForm));
  }, [budgetForm]);

  const {
    categoriesWithoutBudget = [],
    getQueries = [],
    isLoading = false,
  } = useGetCategoriesHelper({
    budgetDate: targetDate,
  });

  const createBudget = useCreateBudget({
    onSuccess: resp => {
      navigation.goBack();
    },
  });

  const onBudgetTypeChange = e => {
    toggleBudgetTypeModal();
    setBudgetForm({ ...budgetForm, budget_type: e.value });
  };

  const onBudgetAmountChange = e => {
    setBudgetForm({ ...budgetForm, amount: e });
  };

  const onCategoryChange = e => {
    toggleCategoryModal();
    setBudgetForm({
      ...budgetForm,
      category_id: e.value,
      category_name: e.name,
    });
  };

  const onBudgetRepeatChange = e => {
    setBudgetForm({ ...budgetForm, budget_repeat: e });
  };

  const onSave = () => {
    validate();
    let isValidationPassed = Object.keys(formErrors).length === 0;

    if (!isValidationPassed) {
      return;
    }

    if (isAddBudget()) {
      createBudget.mutate(budgetForm);
    }
  };

  const getCategoryItems = () => {
    let items = [];
    categoriesWithoutBudget.map(val => {
      items.push({ value: val.category_id, name: val.category_name });
    });
    return items;
  };

  const getEditEnums = () => {
    return [
      {
        title: 'July only',
        value: 0,
      },
      {
        title: 'July and all future months',
        value: 1,
      },
      {
        title: 'All past and future months',
        value: 2,
      },
    ];
  };

  useError(getQueries());

  return (
    <BaseScreen
      isLoading={isLoading()}
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
        {isAddBudget() && (
          <TouchInput
            label="Category"
            value={budgetForm.category_name}
            onPress={toggleCategoryModal}
            errorMessage={showValidation && formErrors.category}
          />
        )}
        <BaseBottomSheet
          isVisible={isCategoryModalVisible}
          onBackdropPress={toggleCategoryModal}
          close={toggleCategoryModal}
          onSelect={onCategoryChange}
          items={getCategoryItems()}
          label="name"
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
          value={budgetForm.amount}
          onChangeText={onBudgetAmountChange}
          errorMessage={showValidation && formErrors.amount}
        />

        {!isAddBudget() && (
          <BaseCheckboxInput
            label="Edit Budget For"
            value={budgetForm.budget_repeat}
            onChange={onBudgetRepeatChange}
            items={getEditEnums()}
          />
        )}

        {!isAddBudget() && (
          <View style={styles.btnContainer}>
            <BaseButton
              title="Delete"
              size="lg"
              type="outline"
              width={200}
              onPress={toggleDeleteModal}
            />

            <DeleteBudgetOverlay
              isVisible={isDeleteModalVisible}
              close={toggleDeleteModal}
              onChange={onBudgetRepeatChange}
              value={budgetForm.budget_repeat}
              items={getEditEnums()}
            />
          </View>
        )}

        <BaseButton title="Save" size="lg" width={200} onPress={onSave} />
      </BaseKeyboardAwareScrollView>
    </BaseScreen>
  );
};

const DeleteBudgetOverlay = ({
  isVisible = false,
  close = function () {},
  value = 0,
  items = [],
  onChange = function (value) {},
  onConfirm = function () {},
  isConfirmLoading = false,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <BaseOverlay isVisible={isVisible} onBackdropPress={close}>
      <BaseText text1>Delete budget for</BaseText>
      <BaseCheckboxInput items={items} value={value} onChange={onChange} />

      <View style={styles.overlayBtnContainer}>
        <BaseButton
          title="Cancel"
          type="outline"
          size="lg"
          width={200}
          onPress={close}
        />
      </View>

      <BaseButton
        title="Confirm"
        size="lg"
        width={200}
        onPress={onConfirm}
        isLoading={isConfirmLoading}
      />
    </BaseOverlay>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    formBody: {
      paddingVertical: theme.spacing.xl,
    },
    btnContainer: {
      marginTop: 40,
      marginBottom: 16,
    },
    overlayBtnContainer: {
      marginBottom: 16,
      marginTop: 30,
    },
  });

export default BudgetForm;
