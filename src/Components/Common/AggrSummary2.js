import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { AmountText, BaseText } from '../Text';

const AggrSummary2 = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View>
      <View style={styles.aggr}>
        <AmountText h2>7205</AmountText>
        <BaseText text4>Asset</BaseText>
      </View>
      <View></View>
      <View></View>
    </View>
  );
};

const getStyles = _ => {
  return StyleSheet.create({
    aggr: {
      alignItems: 'center',
    },
  });
};

export default AggrSummary2;
