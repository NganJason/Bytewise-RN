import { View, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

const defaultData = [{ value: 100, color: 'lightgray' }];

const BasePieChart = ({
  data = defaultData,
  donut = true,
  centerComponent = <></>,
  ...props
}) => {
  return (
    <View>
      <PieChart
        donut={donut}
        innerRadius={95}
        extraRadiusForFocused={3}
        focusOnPress
        strokeWidth={2}
        strokeColor="white"
        sectionAutoFocus
        data={data.length > 0 ? data : defaultData}
        centerLabelComponent={() => ChartCenterComponent(centerComponent)}
        {...props}
      />
    </View>
  );
};

const ChartCenterComponent = (centerComponent = <></>) => {
  const styles = getStyles();
  return <View style={styles.centerContainer}>{centerComponent}</View>;
};

const getStyles = _ =>
  StyleSheet.create({
    centerContainer: {
      padding: 10,
      alignItems: 'center',
    },
  });

export default BasePieChart;
