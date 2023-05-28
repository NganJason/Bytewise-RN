import { useState } from 'react';
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

import { useCreateCategory, useUpdateCategory } from '../../_shared/mutations';
import { useGetCategory } from '../../_shared/query/category';
import { validateCategory } from '../../_shared/apis/category';

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

  const [categoryForm, setCategoryForm] = useState({
    category_id: '',
    category_name: '',
    category_type: TRANSACTION_TYPE_EXPENSE,
  });

  const categoryID = route.params?.category_id || '';

  const isGetCategoryEnabled = () => categoryID !== '';

  const getCategory = useGetCategory(
    { category_id: categoryID },
    {
      onSuccess: data => {
        const category = data.category || {};
        setCategoryForm({
          category_id: category.category_id,
          category_name: category.category_name,
          category_type: category.category_type,
        });
      },
      enabled: isGetCategoryEnabled(),
    },
  );

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

  const onFormSubmit = () => {
    if (categoryForm.category_id !== '') {
      const { category_type: _, ...updateCategoryForm } = categoryForm;
      updateCategory.mutate(updateCategoryForm);
    } else {
      createCategory.mutate(categoryForm);
    }
  };

  const isValidCategory = () => {
    try {
      validateCategory(categoryForm);
      return true;
    } catch {
      return false;
    }
  };

  const renderErrorToast = () => {
    if (getCategory.isError) {
      return {
        show: getCategory.isError,
        message1: getCategory.error.message,
        onHide: getCategory.reset,
      };
    }

    if (createCategory.isError) {
      return {
        show: createCategory.isError,
        message1: createCategory.error.message,
        onHide: createCategory.reset,
      };
    }

    if (updateCategory.isError) {
      return {
        show: updateCategory.isError,
        message1: updateCategory.error.message,
        onHide: updateCategory.reset,
      };
    }

    return {};
  };

  const isFormButtonLoading = () => {
    return createCategory.isLoading || updateCategory.isLoading;
  };

  const isFormLoading = () => {
    return isGetCategoryEnabled() && getCategory.isLoading;
  };

  return (
    <BaseScreen
      isLoading={isFormLoading()}
      errorToast={renderErrorToast()}
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
        {categoryForm.category_id === '' && (
          <BaseToggle
            label="Category Type"
            items={categoryTypes}
            value={categoryForm.category_type}
            onToggle={onCategoryTypeChange}
          />
        )}
        <BaseButton
          title="Save"
          size="lg"
          width={200}
          onPress={onFormSubmit}
          loading={isFormButtonLoading()}
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
