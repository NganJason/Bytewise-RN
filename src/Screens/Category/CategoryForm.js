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

import { useCreateCategory } from '../../_shared/mutations/category';
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

  const category = route.params?.category || {};
  const [categoryForm, setCategoryForm] = useState({
    category_name: category.category_name || '',
    category_type: category.category_type || categoryTypes[0].value,
  });

  const onCategoryNameChange = e => {
    setCategoryForm({ ...categoryForm, category_name: e });
  };

  const onCategoryTypeChange = e => {
    setCategoryForm({ ...categoryForm, category_type: e.value });
  };

  const saveCategory = useCreateCategory({ onSuccess: navigation.goBack });

  const onFormSubmit = () => {
    saveCategory.mutate(categoryForm);
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
        show: saveCategory.isError,
        message1: saveCategory.error?.message,
        onHide: saveCategory.reset,
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
        <BaseButton
          title="Save"
          size="lg"
          width={200}
          onPress={onFormSubmit}
          loading={saveCategory.isLoading}
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
