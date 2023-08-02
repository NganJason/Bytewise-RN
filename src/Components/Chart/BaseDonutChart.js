import { useTheme } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';
import { PieChart } from './PieChart';
import { BaseText } from '../Text';

const BaseDonutChart = ({
  items = [], // {value: 0, color: ''}
  innerLabel = { title: '', subtitle: '' },
  shadow = false,
}) => {
  const { theme } = useTheme();
  const styles = getStyles();

  const renderCenterComponent = () => {
    if (innerLabel.title === '') {
      return <></>;
    }

    return (
      <View style={styles.centerContainer}>
        <BaseText h1 style={{ color: theme.colors.color1 }}>
          {innerLabel.title}
        </BaseText>
        <BaseText text3 style={{ color: theme.colors.color7 }}>
          {innerLabel.subtitle}
        </BaseText>
      </View>
    );
  };

  const processItems = () => {
    let noValue = true;
    items.map(item => {
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
        radius={100}
        showText
        innerRadius={80}
        backgroundColor="white"
        shadow={shadow}
        shadowColor="black"
        strokeWidth={1}
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
      alignItems: 'center',
    },
  });

export default BaseDonutChart;
