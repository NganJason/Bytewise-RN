import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { useTheme, Header, CheckBox, Icon } from '@rneui/themed';
import {
  BaseButton,
  BaseCurrencyInput,
  BaseInput,
  BaseScreen,
  BaseText,
} from '../../Components';
import Collapsible from 'react-native-collapsible';

import ROUTES from '../../_shared/constant/routes';
import { BUDGETOPTIONS } from '../../_shared/constant/constant';
import { useCreateCategory } from '../../_shared/mutation/mutation';

const AddCategoryScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [expanded, setExpanded] = useState(false);
  const [option, setOption] = useState(BUDGETOPTIONS.monthly);
  const [categoryInput, setCategoryInput] = useState('');
  const [budgetInput, setBudgetInput] = useState('');

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
      navigation.navigate(ROUTES.budget);
    },
    onError: err => {
      console.log(err);
    },
  });

  return (
    <BaseScreen>
      <View style={styles.screen}>
        <Header
          centerComponent={
            <BaseText h2 style={{ color: theme.colors.grey6 }}>
              Add a category
            </BaseText>
          }
          containerStyle={styles.header}
          centerContainerStyle={styles.headerItem}
        />

        <View style={styles.body}>
          <BaseInput
            label="Category"
            value={categoryInput}
            carretHidden
            showSoftInputOnFocus={false}
            onChangeText={onCategoryInputChange}
          />

          <TouchableWithoutFeedback onPress={toggleAccordion}>
            <View style={styles.addBudgetContainer}>
              {expanded ? (
                <Icon name="minus" type="entypo" color={theme.colors.grey4} />
              ) : (
                <Icon name="plus" type="entypo" color={theme.colors.grey4} />
              )}

              <BaseText h2 style={styles.addBudgetText}>
                Add budget
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
                onOptionChange(BUDGETOPTIONS.monthly);
              }}
              checked={option === BUDGETOPTIONS.monthly}
              containerStyle={styles.checkbox}
              textStyle={styles.checkBoxText}
            />

            <CheckBox
              left
              title="One-time budget (Annual)"
              onPress={() => {
                onOptionChange(BUDGETOPTIONS.annually);
              }}
              checked={option === BUDGETOPTIONS.annually}
              containerStyle={styles.checkbox}
              textStyle={styles.checkBoxText}
              name={BUDGETOPTIONS.annually}
            />
          </Collapsible>
        </View>

        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <BaseButton title="Save" width={150} size="lg" onPress={handleSave} />
        )}
      </View>
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    screen: {
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    header: {
      alignSelf: 'center',
      backgroundColor: theme.colors.white,
      borderBottomColor: theme.colors.white,
      paddingVertical: theme.spacing.xl,
    },
    body: {
      width: '90%',
      height: '70%',
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
      color: theme.colors.primary,
      marginHorizontal: theme.spacing.xs,
    },
    checkbox: {
      paddingHorizontal: 0,
      marginVertical: theme.spacing.lg,
    },
    checkBoxText: {
      ...theme.fontStyles.h3,
      alignSelf: 'center',
      color: theme.colors.grey6,
    },
    collapsible: {
      marginVertical: theme.spacing.xl,
    },
    btn: {
      width: '50%',
      marginBottom: theme.spacing.xl,
    },
  });
};

export default AddCategoryScreen;
