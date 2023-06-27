import { useNavigation } from '@react-navigation/native';
import { Icon, useTheme } from '@rneui/themed';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import {
  BaseScreen3,
  BaseText,
  EmptyContent,
  BaseLoadableView,
  AmountText,
  EarningText,
  BaseButton,
} from '../../../Components';
import HoldingBreakdown from '../../../Components/Common/HoldingBreakdown';
import { EmptyContentConfig } from '../../../_shared/constant/constant';
import ROUTES from '../../../_shared/constant/routes';

const HoldingBreakdownScreen = ({}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const renderRows = () => {
    let rows = [];

    rows.push(<HoldingBreakdown key={1} />);
    if (rows.length === 0) {
      return (
        <View style={styles.emptyContent}>
          <EmptyContent
            item={EmptyContentConfig.investment}
            route={ROUTES.investmentForm}
          />
        </View>
      );
    }

    return rows;
  };

  const getHeader = () => {
    return (
      <View style={styles.header}>
        <BaseText h1>VTI</BaseText>
        <BaseText text5>Current value</BaseText>
        <AmountText style={styles.titleText} h2 decimal={0}>
          21000
        </AmountText>

        <View style={styles.headerRow}>
          <BaseText text5>Invested amount</BaseText>
          <AmountText text5>21000</AmountText>
        </View>

        <View style={styles.headerRow}>
          <BaseText text5>Profit/Loss</BaseText>
          <EarningText currVal={3300} initialVal={3000} text5 />
        </View>

        <View style={styles.headerRow}>
          <BaseText text5>Quantity</BaseText>
          <BaseText text5>10.3184</BaseText>
        </View>

        <View style={styles.headerRow}>
          <BaseText text5>WAC</BaseText>
          <AmountText text5>23.09</AmountText>
        </View>
      </View>
    );
  };

  return (
    <BaseScreen3 headerProps={{ allowBack: true, component: getHeader() }}>
      <>
        <BaseText h3>History</BaseText>
        <BaseButton
          title="Add holdings"
          type="clear"
          align="flex-start"
          size="sm"
          icon={
            <Icon
              name="plus-circle"
              type="feather"
              color={theme.colors.color1}
              size={13}
              iconStyle={styles.icon}
            />
          }
          onPress={() => {
            navigation.navigate(ROUTES.investmentForm);
          }}
        />
        <BaseLoadableView scrollable={true}>{renderRows()}</BaseLoadableView>
      </>
    </BaseScreen3>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: theme.spacing.xs,
    },
    header: { padding: theme.spacing.xl },
  });

export default HoldingBreakdownScreen;
