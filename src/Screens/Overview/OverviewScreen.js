import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';

import { BaseScreen, DateNavigator } from '../../Components';
import ROUTES from '../../_shared/constant/routes';
import { BaseScrollableTab } from '../../Components/View';
import CategoryOverview from '../Category/CategoryOverview';
import BudgetOverview from '../Budget/BudgetOverview';
import { TRANSACTION_TYPE_EXPENSE } from '../../_shared/apis/enum';

const TODAY = new Date();
const scrollableTabs = [
  { name: 'Category', iconName: 'grid', iconType: 'feather' },
  { name: 'Budget', iconName: 'credit-card', iconType: 'feather' },
];

const OverviewScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [activeDate, setActiveDate] = useState(TODAY);
  const onDateMove = newDate => {
    setActiveDate(newDate);
  };

  const [activeTab, setActiveTab] = useState(scrollableTabs[0]);
  const onTabChange = tab => {
    setActiveTab(tab);
  };

  // For category screen only
  const [categoryType, setCategoryType] = useState(TRANSACTION_TYPE_EXPENSE);

  const getScreen = () => {
    switch (activeTab.name) {
      case 'Category':
        return (
          <CategoryOverview
            activeDate={activeDate}
            setTransactionType={setCategoryType}
          />
        );
      case 'Budget':
        return <BudgetOverview activeDate={activeDate} />;
      default:
        return <CategoryOverview activeDate={activeDate} />;
    }
  };

  const onFabPress = () => {
    switch (activeTab.name) {
      case 'Category':
        navigation.navigate(ROUTES.categoryForm, {
          category_type: categoryType,
        });
        break;
      case 'Budget':
        navigation.navigate(ROUTES.budgetForm);
        break;
      default:
        navigation.navigate(ROUTES.budgetForm);
        break;
    }
  };

  return (
    <BaseScreen
      allowLoadable={false}
      headerProps={{
        allowBack: false,
        allowDrawer: true,
        centerComponent: (
          <DateNavigator
            startingDate={activeDate}
            onForward={onDateMove}
            onBackward={onDateMove}
          />
        ),
      }}
      fabProps={{
        show: true,
        placement: 'right',
        iconName: 'plus',
        iconType: 'entypo',
        iconColor: theme.colors.white,
        color: theme.colors.color1,
        onPress: onFabPress,
      }}>
      <>
        <View>
          <BaseScrollableTab
            tabs={scrollableTabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
        </View>
        <View style={styles.body}>{getScreen()}</View>
      </>
    </BaseScreen>
  );
};

export default OverviewScreen;

const getStyles = _ =>
  StyleSheet.create({
    body: { marginTop: 12 },
  });
