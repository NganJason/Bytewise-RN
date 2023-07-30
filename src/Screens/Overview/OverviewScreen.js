import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';

import { BaseScreen, DateNavigator } from '../../Components';
import ROUTES from '../../_shared/constant/routes';
import { BaseScrollableTab } from '../../Components/View';
import BudgetOverview from '../Budget/BudgetOverview';

const TODAY = new Date();
const scrollableTabs = [
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

  const getScreen = () => {
    switch (activeTab.name) {
      case 'Budget':
        return <BudgetOverview activeDate={activeDate} />;
      default:
        return <BudgetOverview activeDate={activeDate} />;
    }
  };

  const onFabPress = () => {
    switch (activeTab.name) {
      case 'Budget':
        navigation.navigate(ROUTES.budgetForm);
        break;
      default:
        navigation.navigate(ROUTES.budgetForm);
        break;
    }
  };

  const shouldShowFabs = () => {
    switch (activeTab.name) {
      case 'Budget':
        return false;
      default:
        return false;
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
        show: shouldShowFabs(),
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
