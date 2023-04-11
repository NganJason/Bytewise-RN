import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';

import { AmountText, BaseButton, BaseScreen, BaseText } from '../../Components';

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
    <BaseScreen
      bodyStyle={styles.screen}
      headerProps={{
        show: true,
        allowBack: true,
        centerComponent: (
          <BaseText h1 style={{ color: theme.colors.color1 }}>
            {holding.symbol}
          </BaseText>
        ),
      }}>
      <View>
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

      <BaseButton
        title="Add Lot"
        size="lg"
        fullWidth={true}
        containerStyle={styles.addBtn}
      />
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    screen: {
      justifyContent: 'space-between',
    },
    rowContainer: {
      marginTop: '5%',
    },
    row: {
      padding: theme.spacing.xl,
      flexDirection: 'row',
      justifyContent: 'space-between',
      ...theme.borderBottom,
    },
    addBtn: {
      marginVertical: 50,
    },
  });
};

export default InvestmentLotBreakdownScreen;
