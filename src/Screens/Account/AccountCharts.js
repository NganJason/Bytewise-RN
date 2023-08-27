import { useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  AmountText,
  BaseBottomSelectTab,
  BaseDonutChart,
  BaseLoadableView,
  BaseRow,
  ChartLegend,
} from '../../Components';
import { isAccountTypeAsset, isAccountTypeDebt } from '../../_shared/util';

const AccountCharts = ({ accounts = [], assetSum = 0, debtSum = 0 }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [currChartType, setCurrChartType] = useState(1);

  const donutChartTitle = () => {
    switch (currChartType) {
      case 1:
        return `S$ ${assetSum}`;
      case 2:
        return `S$ ${debtSum}`;
      default:
        return '';
    }
  };

  const donutChartSubtitle = () => {
    switch (currChartType) {
      case 1:
        return 'Assets';
      case 2:
        return 'Debts';
      default:
        return '';
    }
  };

  const donutChartItems = () => {
    let items = [];
    switch (currChartType) {
      case 1:
        accounts.map(account => {
          if (isAccountTypeAsset(account.account_type)) {
            let value = account.latest_value || account.balance;
            items.push({
              value: Math.abs(value),
            });
          }
        });
        return items;
      case 2:
        accounts.map(account => {
          if (isAccountTypeDebt(account.account_type)) {
            let value = account.latest_value || account.balance;
            items.push({
              value: Math.abs(value),
            });
          }
        });
        return items;

      default:
        return '';
    }
  };

  const renderRows = () => {
    let rows = [];

    accounts.forEach(account => {
      const { account_type: accountType } = account;
      if (currChartType === 1 && isAccountTypeDebt(accountType)) {
        return;
      }

      if (currChartType === 2 && isAccountTypeAsset(accountType)) {
        return;
      }

      rows.push(
        <BaseRow key={account.account_id}>
          <ChartLegend text3 text={account.account_name} />
          <AmountText text3>
            {account.balance || account.latest_value}
          </AmountText>
        </BaseRow>,
      );
    });

    return rows;
  };

  return (
    <View style={styles.body} scrollable>
      <View style={styles.bottomSelectTab}>
        <BaseBottomSelectTab
          currTabText={currChartType}
          items={[
            { name: '1. Assets Breakdown', value: 1 },
            { name: '2. Debts Breakdown', value: 2 },
          ]}
          onSelect={e => setCurrChartType(e.value)}
        />
      </View>

      <BaseDonutChart
        items={donutChartItems()}
        innerLabel={{
          title: donutChartTitle(),
          subtitle: donutChartSubtitle(),
        }}
      />
      <BaseLoadableView scrollable containerStyle={{ flex: 1 }}>
        {renderRows()}
      </BaseLoadableView>
    </View>
  );
};

const getStyles = theme =>
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
