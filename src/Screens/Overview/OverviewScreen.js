import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';

import { BaseScreen, DateNavigator } from '../../Components';
import ROUTES from '../../_shared/constant/routes';
import { BaseScrollableTab } from '../../Components/View';
import BudgetOverview from '../Budget/BudgetOverview';
import BreakdownOverviewScreen from './BreakdownOverviewScreen';
import { useTimeRange } from '../../_shared/hooks';
import {
  TIME_RANGE_MONTHLY,
  TIME_RANGE_YEARLY,
} from '../../_shared/constant/constant';

const TODAY = new Date();
const scrollableTabs = [
  {
    name: 'Budget',
    iconName: 'filetext1',
    iconType: 'ant-design',
  },
  { name: 'Breakdown', iconName: 'grid', iconType: 'feather' },
];

const OverviewScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { activeDate, timeRange, onDateMove, timeRangeType, setTimeRangeType } =
    useTimeRange(TODAY.valueOf(), TIME_RANGE_MONTHLY);

  const [activeTab, setActiveTab] = useState(scrollableTabs[0]);
  const onTabChange = tab => {
    if (tab.name === 'Budget') {
      setTimeRangeType(TIME_RANGE_MONTHLY);
    }
    setActiveTab(tab);
  };

  const getScreen = () => {
    switch (activeTab.name) {
      case 'Budget':
        return <BudgetOverview activeDate={activeDate} />;
      case 'Breakdown':
        return (
          <BreakdownOverviewScreen
            activeTs={activeDate.valueOf()}
            timeRange={timeRange}
            timeRangeType={timeRangeType}
            setTimeRangeType={setTimeRangeType}
          />
        );
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
            date={activeDate}
            onForward={onDateMove}
            onBackward={onDateMove}
            year={timeRangeType === TIME_RANGE_YEARLY}
            enablePicker
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
    body: { marginTop: 12, flex: 1 },
  });
