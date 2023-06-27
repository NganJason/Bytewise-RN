import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import ROUTES from '../../_shared/constant/routes';
import { AmountText, BaseText, EarningText } from '../Text';
import { BaseRow } from '../View';

const InvestmentBreakdown = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  return (
    <View>
      <BaseRow
        onPress={() => {
          navigation.navigate(ROUTES.holdingBreakdown);
        }}>
        <View>
          <BaseText text3>VTI</BaseText>
          <BaseText text5 style={styles.subRow}>
            12 units
          </BaseText>
        </View>

        <View style={styles.rightContainer}>
          <AmountText text3>3000</AmountText>

          <EarningText
            currVal={3000}
            initialVal={3200}
            text5
            style={styles.subRow}
          />
        </View>
      </BaseRow>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    subRow: {
      marginTop: 4,
      color: theme.colors.color8,
    },
    rightContainer: {
      alignItems: 'flex-end',
    },
  });

export default InvestmentBreakdown;
