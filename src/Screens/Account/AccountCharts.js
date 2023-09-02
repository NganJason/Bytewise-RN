import { useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BaseBottomSelectTab,
  BaseDonutChartWithRows,
  EmptyContent,
} from '../../Components';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import ROUTES from '../../_shared/constant/routes';
import { useDimension } from '../../_shared/hooks';
import { isAccountTypeAsset, isAccountTypeDebt } from '../../_shared/util';

const assets = 'Assets Breakdown';
const debts = 'Debts Breakdown';
const chartTypes = [
  { name: assets, short: 'Assets', value: 0 },
  { name: debts, short: 'Debts', value: 1 },
];

const AccountCharts = ({
  accounts = [],
  assetSum = 0,
  debtSum = 0,
  onAccountPress = function (account) {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { screenHeight } = useDimension();
  const [currChartIdx, setCurrChartIdx] = useState(chartTypes[0]?.value || 0);

  const donutChartLabel = () => {
    let type = chartTypes[currChartIdx];
    switch (type.name) {
      case assets:
        return {
          title: `S$ ${assetSum.toFixed(2)}`,
          subtitle: 'Assets',
        };
      case debts:
        return {
          title: `S$ ${Math.abs(debtSum.toFixed(2))}`,
          subtitle: 'Debts',
        };
      default:
        return {};
    }
  };

  const donutChartItems = () => {
    let items = [];

    accounts.map(d => {
      const { account_type: accountType, account_name: accountName } = d;
      let value = d.latest_value || d.balance;

      // Only abs for debt
      // For asset, there might be negative value and we will keep it
      if (isAccountTypeDebt(accountType)) {
        value = Math.abs(value);
      }

      if (isAccountCurrChart(accountType)) {
        items.push({
          name: accountName,
          value: value,
          onPress: () => {
            onAccountPress(d);
          },
        });
      }
    });

    return items;
  };

  const isAccountCurrChart = accountType => {
    let type = chartTypes[currChartIdx];
    if (type.name === assets && isAccountTypeAsset(accountType)) {
      return true;
    }
    if (type.name === debts && isAccountTypeDebt(accountType)) {
      return true;
    }
    return false;
  };

  return (
    <View style={styles.body} scrollable>
      <View style={styles.bottomSelectTab}>
        <BaseBottomSelectTab
          currTabText={chartTypes[currChartIdx].short}
          items={chartTypes}
          onSelect={e => setCurrChartIdx(e.value)}
        />
      </View>

      <BaseDonutChartWithRows
        items={donutChartItems()}
        donutInnerLabel={donutChartLabel()}
        donutRadius={screenHeight * 0.125}
        emptyContent={
          <EmptyContent
            item={
              chartTypes[currChartIdx].name === assets
                ? EmptyContentConfig.asset
                : EmptyContentConfig.debt
            }
            route={ROUTES.accountSelection}
          />
        }
      />
    </View>
  );
};

const getStyles = _ =>
  StyleSheet.create({
    body: {
      paddingHorizontal: 26,
      flex: 1,
    },
    bottomSelectTab: {
      alignItems: 'flex-end',
    },
  });

export default AccountCharts;
