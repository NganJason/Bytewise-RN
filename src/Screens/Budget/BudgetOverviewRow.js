import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import {
  AmountText,
  BaseDivider,
  BaseLinearProgress,
  BaseText,
} from '../../Components';
import { capitalize } from '../../_shared/util/string';

const BudgetOverviewRow = ({ budget }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { budget_id = '', budget_name = '', amount = 0, used = 0 } = budget;

  return (
    <View key={budget_id} style={styles.row}>
      <View style={styles.rowInfo}>
        <BaseText text3>{capitalize(budget_name)}</BaseText>

        <View style={styles.aggr}>
          <AmountText text4 decimal={0} style={{ color: theme.colors.color7 }}>
            {used}
          </AmountText>
          <BaseDivider orientation={'vertical'} margin={5} />
          <AmountText text4 decimal={0} style={{ color: theme.colors.color7 }}>
            {amount}
          </AmountText>
        </View>
      </View>

      <View style={styles.progress}>
        <BaseLinearProgress value={used / amount} />
      </View>
    </View>
  );
};

const getStyles = _ =>
  StyleSheet.create({
    row: {
      marginBottom: 10,
    },
    rowInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    aggr: {
      flexDirection: 'row',
    },
    progress: {
      marginTop: 16,
      marginBottom: 20,
    },
  });

export default BudgetOverviewRow;
