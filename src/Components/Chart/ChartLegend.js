import { StyleSheet, View } from 'react-native';
import { BaseText } from '../Text';

const ChartLegend = ({ color = '', text = '', ...props }) => {
  const styles = getStyles();
  return (
    <View style={styles.container}>
      <View
        style={{
          ...styles.legend,
          backgroundColor: color,
        }}
      />

      <BaseText
        margin={{ left: 12 }}
        {...props}
        numberOfLines={1}
        ellipsizeMode="tail">
        {text}
      </BaseText>
    </View>
  );
};

const getStyles = _ =>
  StyleSheet.create({
    legend: { width: 10, height: 10, borderRadius: 100 },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default ChartLegend;
