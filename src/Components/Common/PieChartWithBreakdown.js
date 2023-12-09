import { useTheme } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Amount } from '../../_shared/object';
import { DEFAULT_CURRENCY, getColors } from '../../_shared/util';

import BaseChartLegend from '../Chart/BaseChartLegend';
import BasePieChart from '../Chart/BasePieChart';
import { AmountText, BaseText } from '../Text';
import { BaseDivider, BaseRow } from '../View';
import EmptyContent from './EmptyContent';

const defaultIdx = -1;

const PieChartWithBreakdown = ({
  donut = true,
  data = [
    {
      name: '',
      value: 0,
      currency: DEFAULT_CURRENCY,
      onRowPress: function () {},
    },
  ],
  emptyContent = <EmptyContent />,
  centerComponent = <></>,
  rowSensitive = false,
  onSelectedItemChange = function (item) {}, // item=null if nothing is toggled
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [processedData, setProcessedData] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(defaultIdx);

  const onChartPress = e => {
    let { idx = defaultIdx } = e || {};
    let finalIdx;

    if (idx === selectedIdx) {
      finalIdx = defaultIdx;
    } else if (idx !== defaultIdx) {
      finalIdx = idx;
    } else {
      finalIdx = defaultIdx;
    }
    setSelectedIdx(finalIdx);
  };

  useEffect(() => {
    let sum = 0;
    data.map(d => (sum += Number(d.value)));

    let res = [];
    let colors = getColors(data.length);
    data.map((d, idx) => {
      let percentage = (Math.abs(d.value) / sum) * 100;
      if (isNaN(percentage)) {
        percentage = 0;
      }

      d.percentage = percentage.toFixed(1);
      d.idx = idx;
      d.color = colors[idx];
      d.rowSensitive = rowSensitive;
      res.push(d);
    });
    setProcessedData(res);
  }, [data]);

  useEffect(() => {
    if (
      selectedIdx === defaultIdx ||
      selectedIdx < 0 ||
      selectedIdx >= data.length
    ) {
      onSelectedItemChange(null);
    } else {
      onSelectedItemChange(data[selectedIdx]);
    }
  }, [selectedIdx]);

  const renderRows = () => {
    let rows = [];
    processedData.map((d, idx) => {
      rows.push(<BreakdownRow key={idx} {...d} />);
    });

    if (rows.length === 0) {
      return (
        <>
          <BaseDivider margin={14} />
          <View style={styles.emptyContent}>{emptyContent}</View>
        </>
      );
    }
    return rows;
  };

  return (
    <View>
      <View style={styles.chartContainer}>
        <BasePieChart
          donut={donut}
          data={processedData}
          centerComponent={centerComponent}
          onPress={onChartPress}
        />
      </View>
      {renderRows()}
    </View>
  );
};

const BreakdownRow = ({
  name = '',
  value = 0,
  percentage = 0,
  currency = '',
  color = '',
  rowSensitive = false,
  onRowPress = function () {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <BaseRow disabled={!onRowPress} onPress={onRowPress && onRowPress}>
      <View style={styles.legend}>
        <BaseChartLegend color={color} text={name} text3 />
      </View>
      <View style={styles.rowValue}>
        <AmountText
          text3
          amount={new Amount(value, currency)}
          showNegativeOnly
          sensitive={rowSensitive}
        />
        <BaseText
          text5
          margin={{ left: 10 }}
          numberOfLines={1}
          ellipsizeMode="tail"
          color={theme.colors.color7}>{`(${percentage}%)`}</BaseText>
      </View>
    </BaseRow>
  );
};

const getStyles = _ =>
  StyleSheet.create({
    chartContainer: {
      alignItems: 'center',
    },
    legend: {
      flex: 1,
    },
    emptyContent: {
      height: '50%',
      justifyContent: 'center',
    },
    rowValue: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
  });

export default PieChartWithBreakdown;
