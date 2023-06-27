import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import ROUTES from '../../_shared/constant/routes';
import { AmountText, BaseText } from '../Text';
import { BaseRow } from '../View';

const mockData = [
  {
    id: '1',
    unit: 150,
    date: '12-06-2023',
    amount: 3000,
    cost_per_unit: 20,
  },
  {
    id: '2',
    unit: 52.5,
    date: '27-04-2023',
    amount: 1000,
    cost_per_unit: 22,
  },
  {
    id: '3',
    unit: 31.7,
    date: '03-04-2023',
    amount: 500,
    cost_per_unit: 15,
  },
];

const HoldingBreakdown = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  return (
    <View>
      {mockData.map(d => (
        <BaseRow
          onPress={() => {
            navigation.navigate(ROUTES.investmentForm);
          }}>
          <View>
            <BaseText text3>{d.unit} units</BaseText>
            <BaseText text5 style={styles.subRow}>
              {d.date}
            </BaseText>
          </View>

          <View style={styles.amount}>
            <AmountText text3>{d.amount}</AmountText>
            <AmountText text5 style={styles.subRow} suffix="/unit">
              {d.cost_per_unit}
            </AmountText>
          </View>
        </BaseRow>
      ))}
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    subRow: {
      marginTop: 4,
      color: theme.colors.color8,
    },
    amount: {
      alignItems: 'flex-end',
    },
  });

export default HoldingBreakdown;
