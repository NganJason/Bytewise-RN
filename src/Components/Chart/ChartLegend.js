import { StyleSheet, View } from 'react-native';
import { BaseText } from '../Text';

const ChartLegend = ({ color = '', text = '', ...props }) => {
  const styles = getStyles();
  return (
    <View style={styles.container}>
      <View
        style={{
          width: 10,
          height: 10,
          backgroundColor: color,
          borderRadius: 100,
        }}></View>

      <BaseText margin={{ left: 12 }} {...props}>
        {text}
      </BaseText>
    </View>
  );
};

const getStyles = _ =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default ChartLegend;
