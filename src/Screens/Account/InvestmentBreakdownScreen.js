import { useNavigation } from '@react-navigation/native';
import { Icon, useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AmountText,
  BaseButton,
  BaseImage,
  BaseScreen,
  BaseText,
} from '../../Components';
import { EmptyContent } from '../../Components/Common';
import InvestmentHoldings from '../../Components/Common/InvestmentHoldings';
import { BaseLoadableView } from '../../Components/View';
import { graph } from '../../_shared/constant/asset';
import { EmptyContentConfig } from '../../_shared/constant/constant';
import ROUTES from '../../_shared/constant/routes';
import useDimension from '../../_shared/hooks/dimension';

const mockData = [];

const InvestmentBreakdownScreen = ({ route }) => {
  const { theme } = useTheme();
  const { screenWidth, screenHeight } = useDimension();
  const styles = getStyles(theme, screenWidth, screenHeight);
  const navigation = useNavigation();

  const account_id = route.params?.account_id || '';

  const renderRows = () => {
    let rows = [];

    rows.push(<InvestmentHoldings key={account_id} />);

    if (rows.length === 0) {
      return (
        <View style={styles.emptyContent}>
          <EmptyContent
            item={EmptyContentConfig.investment}
            route={ROUTES.transactionForm}
          />
        </View>
      );
    }

    return rows;
  };

  return (
    <BaseScreen enablePadding={false}>
      <SafeAreaView style={styles.header}>
        <View style={styles.title}>
          <BaseText h1>Stocks</BaseText>
          <AmountText style={styles.titleText} h2 decimal={0}>
            21000
          </AmountText>
          <BaseText text4>Investment</BaseText>
        </View>
        <BaseImage source={graph} containerStyle={styles.image} />
      </SafeAreaView>

      <View style={styles.body}>
        <BaseText h3>Holdings</BaseText>
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
      </View>
    </BaseScreen>
  );
};

const getStyles = (theme, screenWidth, screenHeight) =>
  StyleSheet.create({
    header: {
      minHeight: screenHeight * 0.25,
      marginTop: theme.spacing.lg,
      paddingHorizontal: 26,
      flexDirection: 'row',
      justifyContent: 'left',
      alignItems: 'center',
      backgroundColor: theme.colors.color13,
    },
    image: {
      width: screenHeight * 0.2,
      height: screenHeight * 0.18,
      position: 'absolute',
      right: screenWidth * -0.05,
    },
    titleText: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
    body: {
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: 26,
      backgroundColor: theme.colors.white,
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 2,
        height: -5,
      },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 10,
    },
    emptyContent: {
      marginTop: '30%',
    },
  });

export default InvestmentBreakdownScreen;
