import { useTheme } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';
import { PieChart } from './PieChart';

const BaseDonutChart = ({
  items = [], // {value: 0, color: ''}
  innerLabel = { title: null, subtitle: null },
  shadow = false,
  radius = 100,
}) => {
  const { theme } = useTheme();
  const styles = getStyles();

  const renderCenterComponent = () => {
    if (innerLabel.title === '') {
      return <></>;
    }

    return (
      <View style={styles.centerContainer}>
        {innerLabel.title}
        {innerLabel.subtitle}
      </View>
    );
  };

  const processItems = () => {
    let noValue = true;
    items.map(item => {
      item.value = Math.abs(item.value);
      if (item.value > 0) {
        noValue = false;
      }
    });

    if (noValue) {
      return [{ value: 100, color: theme.colors.color9 }];
    }

    return items;
  };

  return (
    <View style={styles.container}>
      <PieChart
        data={processItems()}
        donut
        radius={radius}
        showText
        innerRadius={radius * 0.8}
        backgroundColor="white"
        shadow={shadow}
        shadowColor="grey"
        strokeWidth={2}
        strokeColor="white"
        labelsPosition="mid"
        centerLabelComponent={renderCenterComponent}
      />
    </View>
  );
};

const getStyles = _ =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    centerContainer: {
      padding: 10,
      alignItems: 'center',
    },
  });

export default BaseDonutChart;
