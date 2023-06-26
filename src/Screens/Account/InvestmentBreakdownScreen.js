import { useNavigation } from '@react-navigation/native';
import { Icon, useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import {
  AmountText,
  BaseButton,
  BaseImage,
  BaseScreen2,
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

  const getHeader = () => {
    return (
      <>
        <View style={styles.title}>
          <BaseText h1>Stocks</BaseText>
          <AmountText style={styles.titleText} h2 decimal={0}>
            21000
          </AmountText>
          <BaseText text4>Investment</BaseText>
        </View>
        <BaseImage source={graph} containerStyle={styles.image} />
      </>
    );
  };

  return (
    <BaseScreen2
      headerProps={{
        component: getHeader(),
        allowBack: true,
        backgroundColor: theme.colors.color13,
      }}>
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
    </BaseScreen2>
  );
};

const getStyles = (theme, screenWidth, screenHeight) =>
  StyleSheet.create({
    image: {
      width: screenHeight * 0.2,
      height: screenHeight * 0.18,
      position: 'absolute',
      right: screenWidth * -0.12,
    },
    body: {
      paddingVertical: theme.spacing.lg,
    },
    titleText: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
    emptyContent: {
      marginTop: '30%',
    },
  });

export default InvestmentBreakdownScreen;
