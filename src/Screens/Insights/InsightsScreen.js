import { StyleSheet, View } from 'react-native';
import { BaseScreenV2, BaseScrollableTab } from '../../Components';
import { NetWorthInsight } from './NetWorthInsight';
import { SpendingInsight } from './SpendingInsight';
import { useState } from 'react';
import {
  useDimension,
  useNetWorthGraph,
  useSpendingGraph,
} from '../../_shared/hooks';
import { Graph } from './common';

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
  const [disableScroll, setDisableScroll] = useState(false);
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
    let useGraph;
    switch (tabs[activeTabIdx].name) {
      case netWorth:
        useGraph = useNetWorthGraph;
        break;
      case savings:
        useGraph = useSpendingGraph;
        break;
      default:
        useGraph = useSpendingGraph;
        break;
    }
    return (
      <Graph
        height={screenHeight * 0.16}
        setDisableScroll={setDisableScroll}
        useGraph={useGraph}
      />
    );
  };

  return (
    <BaseScreenV2
      hideInfoButtonProps={{ show: true }}
      drawerButtonProps={{ show: true }}
      headerProps={{ headerStyle: styles.header }}
      subHeaderScrollable
      enableSubHeaderScroll={!disableScroll}
      bodyProps={{
        enableLinearGradientBackground: true,
        enableBodyShadow: false,
      }}
      disableScroll={disableScroll}
      subHeaderProps={{
        subHeader: (
          <View style={{ minHeight: screenHeight * 0.31 }}>
            <BaseScrollableTab
              tabs={tabs}
              activeTabIdx={activeTabIdx}
              onTabChange={onTabChange}
            />
            {renderHeader()}
          </View>
        ),
      }}
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
