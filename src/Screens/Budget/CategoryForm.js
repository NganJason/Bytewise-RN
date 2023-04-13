import { useState } from 'react';
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
} from '../../_shared/api/data/model';

const CategoryForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { cat_id = 0, cat_name = '' } = route.params?.category || {};

  const [catForm, setCatForm] = useState({
    cat_id: cat_id,
    cat_name: cat_name,
  });

  const onCatNameChange = e => {
    setCatForm({ ...catForm, cat_name: e });
  };

  const {
    budget_id = 0,
    amount = '',
    budget_type = BUDGET_TYPE_MONTHLY,
  } = route.params?.budget || {};

  const [budgetForm, setBudgetForm] = useState({
    budget_id: budget_id,
    amount: amount,
    budget_type: budget_type,
  });

  const [isBudgetFormExpanded, setIsBudgetFormExpanded] = useState(
    budget_id !== 0,
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
        text: <BaseText h4>Delete Budget</BaseText>,
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
      headerProps={{
        allowBack: true,
        centerComponent: <BaseText h2>Category</BaseText>,
      }}>
      <View style={styles.formBody}>
        <BaseInput
          label="Category Name"
          value={catForm.cat_name}
          onChangeText={onCatNameChange}
          clearButtonMode="always"
          autoFocus={cat_id === 0}
        />
        <TouchableOpacity onPress={toggleBudgetForm}>
          <View style={styles.budgetToggle}>
            {budgetToggle.icon}
            {budgetToggle.text}
          </View>
        </TouchableOpacity>
        <Collapsible
          collapsed={!isBudgetFormExpanded}
          style={styles.collapsible}>
          <>
            <BaseCurrencyInput
              label="Amount"
              value={budgetForm.amount}
              onChangeText={onAmountChange}
              autoFocus
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
        <BaseButton title="Save" size="lg" width={200} />
      </View>
    </BaseScreen>
  );
};

const getStyles = _ => {
  return StyleSheet.create({
    formBody: {
      paddingVertical: 22,
    },
    budgetToggle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    collapsible: {
      paddingVertical: 20,
    },
    budgetToggleIcon: {
      marginRight: 8,
    },
    checkboxes: {
      flexDirection: 'row',
    },
  });
};

export default CategoryForm;
