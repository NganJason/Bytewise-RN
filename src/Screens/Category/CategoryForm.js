import { useState, useEffect, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

import {
  BaseScreen,
  BaseText,
  BaseButton,
  BaseInput,
  BaseToggle,
} from '../../Components';

import {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '../../_shared/apis/enum';
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '../../_shared/mutations';
import { useGetCategory } from '../../_shared/query';
import { validateCategory } from '../../_shared/validator';
import { useError, useValidation } from '../../_shared/hooks';
import { OnboardingDataContext } from '../../_shared/context';

const categoryTypes = [
  {
    label: TRANSACTION_TYPES[TRANSACTION_TYPE_EXPENSE],
    value: TRANSACTION_TYPE_EXPENSE,
  },
  {
    label: TRANSACTION_TYPES[TRANSACTION_TYPE_INCOME],
    value: TRANSACTION_TYPE_INCOME,
  },
];

const CategoryForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const {
    category_type: categoryType = TRANSACTION_TYPE_EXPENSE,
    category_id: categoryID = '',
    isOnboarding = false,
  } = route?.params || {};
  const isAddCategory = () => {
    return categoryID === '';
  };

  // initial form state
  const [categoryForm, setCategoryForm] = useState({
    category_id: '',
    category_name: '',
    category_type: categoryType,
  });

  // For onboardingForm
  const { addCategory } = useContext(OnboardingDataContext);

  const [formErrors, setFormErrors] = useState({});
  const { validate, showValidation } = useValidation();
  useEffect(() => {
    setFormErrors(validateCategory(categoryForm));
  }, [categoryForm]);

  const getCategory = useGetCategory(
    { category_id: categoryID },
    { enabled: categoryID !== '' },
  );

  useEffect(() => {
    if (getCategory.data) {
      setCategoryForm(getCategory.data.category);
    }
  }, [getCategory.data]);

  const onCategoryNameChange = e => {
    setCategoryForm({ ...categoryForm, category_name: e });
  };

  const onCategoryTypeChange = e => {
    setCategoryForm({ ...categoryForm, category_type: e.value });
  };

  const createCategory = useCreateCategory({
    onSuccess: navigation.goBack,
  });

  const updateCategory = useUpdateCategory({
    onSuccess: navigation.goBack,
  });

  const deleteCategory = useDeleteCategory({
    onSuccess: navigation.goBack,
  });

  const onFormSubmit = () => {
    validate();
    let isValidationPassed = Object.keys(formErrors).length === 0;
    if (!isValidationPassed) {
      return;
    }

    if (isOnboarding) {
      addCategory(categoryForm);
      navigation.goBack();
      return;
    }

    if (categoryForm.category_id !== '') {
      const { category_type: _, ...updateCategoryForm } = categoryForm;
      updateCategory.mutate(updateCategoryForm);
    } else {
      createCategory.mutate(categoryForm);
    }
  };

  const onDelete = () => {
    deleteCategory.mutate({ category_id: categoryID });
  };

  const isFormButtonLoading = () => {
    return createCategory.isLoading || updateCategory.isLoading;
  };

  const isFormLoading = () => getCategory.isLoading;
  useError([getCategory, createCategory, updateCategory]);

  return (
    <BaseScreen
      isLoading={isFormLoading()}
      headerProps={{
        allowBack: true,
        centerComponent: (
          <BaseText h2>
            {isAddCategory() ? 'Add Category' : 'Edit Category'}
          </BaseText>
        ),
      }}>
      <View style={styles.formBody}>
        <BaseInput
          label="Category Name"
          value={categoryForm.category_name}
          onChangeText={onCategoryNameChange}
          clearButtonMode="always"
          autoFocus={true}
          errorMessage={showValidation && formErrors.category_name}
        />
        {categoryForm.category_id === '' && (
          <BaseToggle
            label="Category Type"
            items={categoryTypes}
            value={categoryForm.category_type}
            onToggle={onCategoryTypeChange}
          />
        )}
        <View style={styles.btnContainer}>
          <BaseButton
            title="Save"
            size="lg"
            width={200}
            onPress={onFormSubmit}
            loading={isFormButtonLoading()}
          />
        </View>
      </View>
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    formBody: {
      paddingVertical: 22,
    },
    btnContainer: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
  });
};

export default CategoryForm;
