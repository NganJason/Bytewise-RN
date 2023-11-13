import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { Amount } from '../../_shared/object';
import { AmountText, BaseText } from '../Text';

const AggrSummary2 = ({ items = [{ val: '', title: '' }] }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const isItemMid = (idx = 0) => {
    const isOdd = items.length % 2 !== 0;
    if (!isOdd) {
      return false;
    }
    return Math.ceil(items.length / 2) === idx + 1;
  };

  return (
    <View style={styles.container}>
      {items.map((d, idx) => (
        <AggrSummaryItem
          key={idx}
          idx={idx}
          val={d.val}
          title={d.title}
          large={isItemMid(idx)}
        />
      ))}
    </View>
  );
};

const AggrSummaryItem = ({ idx = 0, val = '', title = '', large = false }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  if (title === '') {
    return;
  }

  return (
    <View key={idx} style={styles.aggr}>
      <AmountText
        h2={large}
        h3={!large}
        showCurrency={false}
        sensitive
        amount={new Amount(val)}
        decimal={0}
      />
      <BaseText text6 color={theme.colors.color8}>
        {title}
      </BaseText>
    </View>
  );
};

const getStyles = _ => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
    },
    aggr: {
      alignItems: 'center',
    },
  });
};

export default AggrSummary2;
