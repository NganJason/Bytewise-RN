import { View } from 'react-native';
import { BaseScreenV2, BaseScrollableTab } from '../../Components';

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
    <BaseScreenV2
      headerProps={{
        allowDrawer: true,
        allowHideInfo: true,
        centerComponent: <></>,
      }}
      subHeader={
        <View style={{ height: 200 }}>
          <BaseScrollableTab
            tabs={tabs}
            activeTabIdx={activeTabIdx}
            onTabChange={onTabChange}
          />
        </View>
      }
      enablePadding={true}>
      {renderTabContent()}
    </BaseScreenV2>
  );
};

export default InsightsScreen;
