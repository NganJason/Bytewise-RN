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
} from '../../_shared/api/apis/1_enum';

import { useCreateCategory } from '../../_shared/api/mutations/category';
import { validateCategory } from '../../_shared/validator';
import ROUTES from '../../_shared/constant/routes';
import { newCreateCategoryReq } from '../../_shared/api/apis/0_type';

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

  const createCategory = useCreateCategory({ onSuccess: navigation.goBack });

  const onFormSubmit = () => {
    createCategory.mutate(
      newCreateCategoryReq(
        categoryForm.category_name,
        categoryForm.category_type,
      ),
    );
  };

  const onAddBudget = () => {
    navigation.navigate(ROUTES.budgetForm);
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

        <View style={styles.btnContainer}>
          <BaseButton
            title="Add budget"
            size="lg"
            type="outline"
            width={200}
            onPress={onAddBudget}
            disabled={
              !isValidCategory() ||
              categoryForm.category_type === TRANSACTION_TYPE_INCOME
            }
            marginVertical={10}
          />
          <BaseButton
            title="Save"
            size="lg"
            width={200}
            onPress={onFormSubmit}
            loading={createCategory.isLoading}
            disabled={!isValidCategory()}
            marginVertical={5}
          />
        </View>
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
    btnContainer: { marginVertical: 50 },
  });
};

export default CategoryForm;
