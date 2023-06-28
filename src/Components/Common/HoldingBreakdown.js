import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import ROUTES from '../../_shared/constant/routes';
import { AmountText, BaseText } from '../Text';
import { BaseRow } from '../View';

const HoldingBreakdown = ({ share }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const {
    share_id = '',
    unit = 0,
    date = '',
    cost_per_unit = 0,
    amount = 0,
  } = share;

  return (
    <BaseRow
      onPress={() => {
        navigation.navigate(ROUTES.investmentForm, { share_id: share_id });
      }}>
      <View>
        <BaseText text3>{unit} units</BaseText>
        <BaseText text5 color={theme.colors.color8} margin={{ top: 4 }}>
          {date}
        </BaseText>
      </View>

      <View style={styles.rightContainer}>
        <AmountText text3>{amount}</AmountText>
        <AmountText
          text5
          color={theme.colors.color8}
          margin={{ top: 4 }}
          suffix="/unit">
          {cost_per_unit}
        </AmountText>
      </View>
    </BaseRow>
  );
};

const getStyles = _ =>
  StyleSheet.create({
    rightContainer: {
      alignItems: 'flex-end',
    },
  });

export default HoldingBreakdown;
