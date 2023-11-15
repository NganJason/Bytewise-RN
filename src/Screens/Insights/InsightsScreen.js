import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { BaseScreen2, BaseScrollableTab, BaseText } from '../../Components';

import EquityInsight from './EquityInsight';
import SpendingInsight from './SpendingInsight';
import { useState } from 'react';

const netWorth = 'Net Worth';
const savings = 'Savings';

const tabs = [
  {
    name: netWorth,
    iconName: 'filetext1',
    iconType: 'ant-design',
  },
  {
    name: savings,
    iconName: 'filetext1',
    iconType: 'ant-design',
  },
];
const InsightsScreen = () => {
  const { theme } = useTheme();
  const [activeTabIdx, setActiveTabIdx] = useState(0);

  const onTabChange = idx => {
    setActiveTabIdx(idx);
  };

  const renderTabContent = () => {
    switch (tabs[activeTabIdx].name) {
      case netWorth:
        return <EquityInsight />;
      case savings:
        return <SpendingInsight />;
      default:
        return <SpendingInsight />;
    }
  };

  return (
    <BaseScreen2
      headerProps={{
        allowDrawer: true,
        allowHideInfo: true,
        component: (
          <View style={{ height: 200 }}>
            <BaseScrollableTab
              tabs={tabs}
              activeTabIdx={activeTabIdx}
              onTabChange={onTabChange}
            />
          </View>
        ),
      }}
      enablePadding={true}>
      {}
      {renderTabContent()}
    </BaseScreen2>
  );
};

const getStyles = theme => StyleSheet.create({});

export default InsightsScreen;
