import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { useTheme, CheckBox, Icon } from '@rneui/themed';
import {
  BaseButton,
  BaseCurrencyInput,
  BaseInput,
  BaseScreen,
  BaseText,
} from '../../Components';
import Collapsible from 'react-native-collapsible';

import { BUDGET_OPTIONS } from '../../_shared/constant/constant';
import { useCreateCategory } from '../../_shared/mutation/mutation';

const SetCategoryScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [expanded, setExpanded] = useState(false);
  const [option, setOption] = useState(BUDGET_OPTIONS.monthly);
  const [categoryInput, setCategoryInput] = useState('');
  const [budgetInput, setBudgetInput] = useState('');

  useEffect(() => {
    if (route.params.data === undefined) {
      return;
    }

    setCategoryInput(route.params.data.category);
    setBudgetInput(route.params.data.budget);
    setOption(route.params.data.budgetType);

    if (route.params.data.budget !== undefined) {
      setExpanded(true);
    }
  }, [route.params]);

  const onCategoryInputChange = e => {
    setCategoryInput(e);
  };

  const onBudgetInputChange = e => {
    setBudgetInput(e);
  };

  const onOptionChange = o => {
    setOption(o);
  };

  const toggleAccordion = () => {
    setExpanded(!expanded);
  };

  const handleSave = () => {
    createCategory();
  };

  const { mutate: createCategory, isLoading } = useCreateCategory({
    onSuccess: resp => {
      navigation.goBack();
    },
    onError: err => {
      console.log(err);
    },
  });

  return (
    <BaseScreen
      bodyStyle={styles.screen}
      isLoading={isLoading}
      headerProps={{
        show: true,
        allowBack: true,
        centerComponent: (
          <BaseText h2 style={{ color: theme.colors.color4 }}>
            Category
          </BaseText>
        ),
      }}>
      <View style={styles.body}>
        <BaseInput
          label="Name"
          value={categoryInput}
          carretHidden
          showSoftInputOnFocus={false}
          onChangeText={onCategoryInputChange}
        />

        <TouchableWithoutFeedback onPress={toggleAccordion}>
          <View style={styles.addBudgetContainer}>
            {expanded ? (
              <Icon name="minus" type="entypo" color={theme.colors.color5} />
            ) : (
              <Icon name="plus" type="entypo" color={theme.colors.color5} />
            )}

            <BaseText h2 style={styles.addBudgetText}>
              {expanded ? 'Delete budget' : 'Add budget'}
            </BaseText>
          </View>
        </TouchableWithoutFeedback>

        <Collapsible collapsed={!expanded} style={styles.collapsible}>
          <BaseCurrencyInput
            label="Budget"
            value={budgetInput}
            onChangeText={onBudgetInputChange}
            autofocus
          />

          <CheckBox
            left
            title="Monthly budget"
            onPress={() => {
              onOptionChange(BUDGET_OPTIONS.monthly);
            }}
            checked={option === BUDGET_OPTIONS.monthly}
            containerStyle={styles.checkbox}
            textStyle={styles.checkBoxText}
          />

          <CheckBox
            left
            title="One-time budget (Annual)"
            onPress={() => {
              onOptionChange(BUDGET_OPTIONS.annually);
            }}
            checked={option === BUDGET_OPTIONS.annually}
            containerStyle={styles.checkbox}
            textStyle={styles.checkBoxText}
            name={BUDGET_OPTIONS.annually}
          />
        </Collapsible>
      </View>

      <View style={styles.btnContainer}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <BaseButton
            title="Add"
            size="lg"
            fullWidth={true}
            onPress={handleSave}
          />
        )}
      </View>
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    screen: {
      justifyContent: 'space-between',
    },
    body: {
      width: '90%',
      padding: theme.spacing.xl,
      marginTop: theme.spacing.md,
      alignSelf: 'center',
    },
    addBudgetContainer: {
      flexDirection: 'row',
      marginVertical: theme.spacing.md,
      alignSelf: 'center',
    },
    addBudgetText: {
      color: theme.colors.color1,
      marginHorizontal: theme.spacing.xs,
    },
    checkbox: {
      paddingHorizontal: 0,
      marginVertical: theme.spacing.lg,
    },
    checkBoxText: {
      ...theme.fontStyles.h3,
      alignSelf: 'center',
      color: theme.colors.color4,
    },
    collapsible: {
      marginVertical: theme.spacing.xl,
    },
    btnContainer: {
      width: '100%',
      marginVertical: 50,
    },
  });
};

export default SetCategoryScreen;
