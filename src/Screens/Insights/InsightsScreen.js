import { StyleSheet, View } from 'react-native';
import { BaseScreenV2, BaseScrollableTab } from '../../Components';
import { NetWorthInsight, NetWorthGraph } from './NetWorthInsight';
import { SpendingInsight, SpendingGraph } from './SpendingInsight';
import { useState } from 'react';
import { useDimension } from '../../_shared/hooks';

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
  const { screenHeight } = useDimension();
  const styles = getStyles();

  const onTabChange = idx => {
    setActiveTabIdx(idx);
  };

  const renderTabContent = () => {
    switch (tabs[activeTabIdx].name) {
      case netWorth:
        return <NetWorthInsight />;
      case savings:
        return <SpendingInsight />;
      default:
        return <SpendingInsight />;
    }
  };

  const renderHeader = () => {
    switch (tabs[activeTabIdx].name) {
      case netWorth:
        return <NetWorthGraph height={screenHeight * 0.15} />;
      case savings:
        return <SpendingGraph height={screenHeight * 0.15} />;
      default:
        return <SpendingGraph height={screenHeight * 0.15} />;
    }
  };

  return (
    <BaseScreenV2
      hideInfoButtonProps={{ show: true }}
      drawerButtonProps={{ show: true }}
      headerProps={{ headerStyle: styles.header }}
      subHeader={
        <View style={{ minHeight: screenHeight * 0.31 }}>
          <BaseScrollableTab
            tabs={tabs}
            activeTabIdx={activeTabIdx}
            onTabChange={onTabChange}
          />
          {renderHeader()}
        </View>
      }
      enablePadding={true}>
      {renderTabContent()}
    </BaseScreenV2>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    header: {
      paddingBottom: 0,
    },
  });

export default InsightsScreen;
