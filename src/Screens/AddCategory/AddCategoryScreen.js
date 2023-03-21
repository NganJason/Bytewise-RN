import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Collapsible from 'react-native-collapsible';
import BaseText from '../../Components/BaseText';
import {
  useTheme,
  Header,
  Input,
  CheckBox,
  Icon,
  BottomSheet,
  ListItem,
} from '@rneui/themed';

import { BUDGETOPTIONS } from '../../_shared/constant/constant';

const AddCategoryScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [categoryInput, setCategoryInput] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [option, setOption] = useState(BUDGETOPTIONS.monthly);

  const [currencyModalVisible, setCurrencyModelVisible] = useState(false);

  const list = [{ title: 'MYR' }, { title: 'USD' }];

  const onCategoryInputChange = e => {
    setCategoryInput(e);
  };

  const onOptionChange = o => {
    setOption(o);
  };

  const toggleAccordion = () => {
    setExpanded(!expanded);
  };

  const toggleCurrencyModal = () => {
    setCurrencyModelVisible(!currencyModalVisible);
  };

  return (
    <SafeAreaProvider>
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
          <Input
            onChangeText={onCategoryInputChange}
            label={
              <BaseText h2 style={{ color: theme.colors.grey6 }}>
                Category:
              </BaseText>
            }
            inputComponent={
              <BaseText h2 style={{ color: theme.colors.grey6 }}>
                {categoryInput}
              </BaseText>
            }
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
            <Input
              keyboardType="numeric"
              onChangeText={onCategoryInputChange}
              label={
                <BaseText h2 style={{ color: theme.colors.grey6 }}>
                  Budget:
                </BaseText>
              }
              inputComponent={
                <BaseText h2 style={{ color: theme.colors.grey6 }}>
                  {categoryInput}
                </BaseText>
              }
              leftIcon={
                <TouchableWithoutFeedback onPress={toggleCurrencyModal}>
                  <View style={styles.addBudgetContainer}>
                    <Icon
                      name="chevron-down"
                      type="entypo"
                      color={theme.colors.primary}
                    />
                    <BaseText>MYR</BaseText>
                  </View>
                </TouchableWithoutFeedback>
              }
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

        <BottomSheet
          isVisible={currencyModalVisible}
          onBackdropPress={toggleCurrencyModal}>
          {list.map((l, i) => (
            <ListItem
              key={i}
              containerStyle={l.containerStyle}
              onPress={l.onPress}>
              <ListItem.Content>
                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </BottomSheet>
      </View>
    </SafeAreaProvider>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    header: {
      alignSelf: 'center',
      backgroundColor: theme.colors.white,
      borderBottomColor: theme.colors.white,
      paddingVertical: theme.spacing.xl,
    },
    body: {
      width: '90%',
      height: '100%',
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
  });
};

export default AddCategoryScreen;
