import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';

import {
  AmountText,
  BaseButton,
  BaseHeader,
  BaseScreen,
  BaseText,
} from '../../Components';

const InvestmentLotBreakdownScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const {
    params: { holding = {} },
  } = route;

  const {
    params: {
      holding: { lot_breakdown = [] },
    },
  } = route;

  return (
    <BaseScreen style={styles.screen}>
      <View>
        <BaseHeader
          center={
            <BaseText h1 style={{ color: theme.colors.color1 }}>
              {holding.symbol}
            </BaseText>
          }
        />

        <View style={styles.rowContainer}>
          {lot_breakdown.map(d => {
            return (
              <View style={styles.row} key={d.id}>
                <BaseText h3>{d.num_lot} lot</BaseText>
                <BaseText h3>
                  <AmountText h3>{d.price}</AmountText> /lot
                </BaseText>
              </View>
            );
          })}
        </View>
      </View>

      <BaseButton title="Add Lot" size="lg" containerStyle={styles.addBtn} />
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    screen: {
      justifyContent: 'space-between',
    },
    rowContainer: {
      marginTop: '20%',
    },
    row: {
      padding: theme.spacing.xl,
      flexDirection: 'row',
      justifyContent: 'space-between',
      ...theme.borderBottom,
    },
    addBtn: {
      marginVertical: theme.spacing.xl,
    },
  });
};

export default InvestmentLotBreakdownScreen;
