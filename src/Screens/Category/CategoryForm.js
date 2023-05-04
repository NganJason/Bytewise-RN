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
} from '../../_shared/apis/1_enum';

import { useCreateCategory } from '../../_shared/mutations/category';
import { validateCategory } from '../../_shared/validator';
import { newCreateCategoryReq } from '../../_shared/apis/0_type';
import ROUTES from '../../_shared/constant/routes';

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

  const [cachedBudget, setCachedBudget] = useState(null);
  const [categoryForm, setCategoryForm] = useState(
    route.params?.category || {
      cat_name: '',
      cat_type: categoryTypes[0].value,
    },
  );

  const onCategoryNameChange = e => {
    setCategoryForm({ ...categoryForm, cat_name: e });
  };

  const onCategoryTypeChange = e => {
    setCategoryForm({ ...categoryForm, cat_type: e.value });
  };

  const createCategory = useCreateCategory({ onSuccess: navigation.goBack });

  const onFormSubmit = () => {
    createCategory.mutate(
      newCreateCategoryReq(categoryForm.cat_name, categoryForm.cat_type),
    );
  };

  const onAddBudget = () => {
    navigation.navigate(ROUTES.budgetForm, {
      cachedBudget: cachedBudget,
      setCachedBudget: setCachedBudget,
    });
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
      }}
      bodyStyle={styles.screen}>
      <View style={styles.formBody}>
        <BaseInput
          label="Category Name"
          value={categoryForm.cat_name}
          onChangeText={onCategoryNameChange}
          clearButtonMode="always"
          autoFocus={true}
        />
        <BaseToggle
          label="Category Type"
          items={categoryTypes}
          value={categoryForm.cat_type}
          onToggle={onCategoryTypeChange}
        />
        <BaseButton
          title="Save"
          size="lg"
          width={200}
          onPress={onFormSubmit}
          loading={createCategory.isLoading}
          disabled={!isValidCategory()}
          marginVertical={40}
        />
      </View>
    </BaseScreen>
  );
};

const getStyles = _ => {
  return StyleSheet.create({
    screen: {
      justifyContent: 'space-between',
    },
    formBody: {
      paddingVertical: 22,
    },
    btnContainer: {
      marginVertical: 30,
    },
  });
};

export default CategoryForm;
