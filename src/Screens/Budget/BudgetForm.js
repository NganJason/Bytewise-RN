import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useEffect, useState } from 'react';
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
  BUDGET_REPEAT_NOW,
  BUDGET_REPEAT_NOW_TO_FUTURE,
  BUDGET_TYPES,
  BUDGET_TYPE_MONTHLY,
  TRANSACTION_TYPE_EXPENSE,
} from '../../_shared/apis/enum';
import { validateBudget } from '../../_shared/validator';
import { getBudgetTypes } from '../../_shared/util';
import EmptyContent from '../../Components/Common/EmptyContent';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import ROUTES from '../../_shared/constant/routes';
import { useError, useValidation } from '../../_shared/hooks';
import { BaseOverlay } from '../../Components/View';
import { useGetCategoriesHelper } from '../../_shared/hooks';
import {
  useCreateBudget,
  useDeleteBudget,
  useUpdateBudget,
} from '../../_shared/mutations';
import {
  getDateObjFromTs,
  getDateStringWithoutDelim,
  getMonthStr,
  getYear,
} from '../../_shared/util';

const TODAY = new Date();

const BudgetForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const {
    category_id: categoryID = '',
    budget_type: budgetType = BUDGET_TYPE_MONTHLY,
    active_date: activeDate = TODAY.valueOf(),
  } = route?.params || {};
  const [activeD, setActiveD] = useState(getDateObjFromTs(activeDate));

  const isAddBudget = () => {
    return categoryID === '';
  };

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
    category_id: categoryID,
    category_name: '',
    budget_type: budgetType,
    amount: 0,
    budget_date: getDateStringWithoutDelim(activeD),
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
    categoryIDToCategoryMap = {},
    getQueries = [],
    isLoading = false,
  } = useGetCategoriesHelper({
    budgetDate: activeD,
  });
  useEffect(() => {
    let category = categoryIDToCategoryMap[categoryID];
    if (!category) {
      return;
    }

    const { category_name: categoryName = '', budget = {} } = category;
    setBudgetForm({
      ...budgetForm,
      category_name: categoryName,
      amount: budget.amount || 0,
      budget_type: budget.budget_type || BUDGET_TYPE_MONTHLY,
    });
  }, [categoryIDToCategoryMap]);

  const createBudget = useCreateBudget({
    onSuccess: _ => {
      navigation.goBack();
    },
  });

  const updateBudget = useUpdateBudget({
    onSuccess: _ => {
      navigation.goBack();
    },
  });

  const deleteBudget = useDeleteBudget({
    onSuccess: _ => {
      toggleDeleteModal();
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
    } else {
      updateBudget.mutate(budgetForm);
    }
  };

  const onDelete = () => {
    deleteBudget.mutate(budgetForm);
  };

  const getCategoryItems = () => {
    let items = [];
    categoriesWithoutBudget.map(val => {
      if (val.category_type === TRANSACTION_TYPE_EXPENSE) {
        items.push({ value: val.category_id, name: val.category_name });
      }
    });
    return items;
  };

  const getEditEnums = () => {
    let dateVal = '';
    let dateTerm = '';
    if (budgetForm.budget_type === BUDGET_TYPE_MONTHLY) {
      dateVal = `${getMonthStr(activeD)} ${getYear(activeD)}`;
      dateTerm = 'months';
    } else {
      dateVal = String(getYear(activeD));
      dateTerm = 'years';
    }

    return [
      {
        title: `${dateVal} and future ${dateTerm}`,
        value: BUDGET_REPEAT_NOW_TO_FUTURE,
      },

      {
        title: `Past and future ${dateTerm}`,
        value: BUDGET_REPEAT_ALL_TIME,
      },
      {
        title: `${dateVal} only`,
        value: BUDGET_REPEAT_NOW,
      },
    ];
  };

  useError([...getQueries(), updateBudget]);

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
        <TouchInput
          label="Category"
          value={budgetForm.category_name}
          onPress={toggleCategoryModal}
          errorMessage={showValidation && formErrors.category}
          disabled={!isAddBudget()}
        />
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

        <View style={{ marginBottom: 40 }}>
          <BaseCheckboxInput
            label={isAddBudget() ? 'Add Budget For' : 'Edit Budget For'}
            value={budgetForm.budget_repeat}
            onChange={onBudgetRepeatChange}
            items={getEditEnums()}
          />
        </View>

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
              onConfirm={onDelete}
              isConfirmLoading={deleteBudget.isLoading}
            />
          </View>
        )}

        <BaseButton
          title="Save"
          size="lg"
          width={200}
          onPress={onSave}
          isLoading={createBudget.isLoading || updateBudget.isLoading}
        />
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
      marginBottom: 16,
    },
    overlayBtnContainer: {
      marginBottom: 16,
      marginTop: 30,
    },
  });

export default BudgetForm;
