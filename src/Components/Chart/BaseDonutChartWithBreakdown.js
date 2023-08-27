import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { DonutChartColors } from '../../_shared/constant/constant';
import BaseDonutChart from './BaseDonutChart';
import BaseRow from '../View/BaseRow';
import ChartLegend from './ChartLegend';
import { AmountText, BaseText } from '../Text';
import { BaseDivider, BaseLoadableView } from '../View';
import { useTheme } from '@rneui/themed';

const BaseDonutChartWithRows = ({
  items = [{ name: '', value: 0, onPress: function () {} }],
  donutInnerLabel = { title: '', subtitle: '' },
  isLoading = false,
  emptyContent = <></>,
}) => {
  const [processedItems, setProcessedItems] = useState([]);
  const { theme } = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    let p = [];
    let sum = 0;
    items.map(d => (sum += d.value));

    items.map((d, idx) => {
      if (d.name === '') {
        return;
      }
      d.color = DonutChartColors[idx];
      d.percentage = ((d.value / sum) * 100).toFixed(0);
      p.push(d);
    });
    setProcessedItems(p);
  }, [items]);

  const renderRows = () => {
    let rows = [];

    processedItems.map((d, idx) => {
      rows.push(
        <BaseRow key={idx} onPress={d.onPress}>
          <ChartLegend color={d.color} text={d.name} text3 />
          <View style={styles.rowValue}>
            <AmountText text3>{d.value}</AmountText>
            <BaseText
              margin={{ left: 10 }}
              color={theme.colors.color7}>{`(${d.percentage}%)`}</BaseText>
          </View>
        </BaseRow>,
      );
    });

    if (rows.length === 0) {
      return emptyContent;
    }

    return rows;
  };

  return (
    <View style={styles.container}>
      <BaseDonutChart items={processedItems} innerLabel={donutInnerLabel} />
      {processedItems.length === 0 && <BaseDivider margin={10} />}
      <BaseLoadableView
        scrollable
        containerStyle={styles.rowsContainer}
        isLoading={isLoading}>
        {renderRows()}
      </BaseLoadableView>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    rowsContainer: {
      flex: 1,
    },
    rowValue: {
      flexDirection: 'row',
    },
  });

export default BaseDonutChartWithRows;
