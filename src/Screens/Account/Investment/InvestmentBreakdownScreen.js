import { useNavigation } from '@react-navigation/native';
import { Icon, useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import useDimension from '../../../_shared/hooks/dimension';
import { EmptyContentConfig } from '../../../_shared/constant/constant';
import { graph } from '../../../_shared/constant/asset';
import ROUTES from '../../../_shared/constant/routes';
import {
  AmountText,
  BaseImage,
  BaseText,
  BaseButton,
  BaseScreen2,
  EarningText,
  BaseLoadableView,
  EmptyContent,
  HoldingRow,
} from '../../../Components';
import { capitalize } from '../../../_shared/util/string';
import { useGetAccount } from '../../../_shared/query';

const InvestmentBreakdownScreen = ({ route }) => {
  const { theme } = useTheme();
  const { screenWidth, screenHeight } = useDimension();
  const styles = getStyles(theme, screenWidth, screenHeight);
  const navigation = useNavigation();

  const { account_id: accountID = '' } = route?.params;
  const getAccount = useGetAccount(
    { account_id: accountID },
    { enabled: accountID !== '' },
  );
  const {
    account_name = '',
    latest_value = 0,
    avg_cost,
  } = getAccount?.data?.account || {};

  const renderRows = () => {
    let rows = [];
    let holdings = getAccount?.data?.account?.holdings || [];

    holdings.map(holding => {
      holding.holding_id = holding._id;
      rows.push(<HoldingRow key={holding._id} {...holding} />);
    });

    if (rows.length === 0) {
      return (
        <EmptyContent
          item={EmptyContentConfig.investment}
          route={ROUTES.transactionForm}
          marginVertical="30%"
        />
      );
    }

    return rows;
  };

  const renderHeader = () => {
    return (
      <>
        <View style={styles.title}>
          <BaseText h1 isLoading={getAccount.isLoading} loadingLen={10}>
            {capitalize(account_name)}
          </BaseText>
          <AmountText
            style={styles.titleText}
            h2
            decimal={0}
            margin={{ top: 8 }}
            isLoading={getAccount.isLoading}>
            {latest_value}
          </AmountText>
          <EarningText
            currVal={latest_value}
            initialVal={avg_cost}
            text5
            margin={{ vertical: 2 }}
            isLoading={getAccount.isLoading}
          />
          <BaseText text4>Investment</BaseText>
        </View>
        <BaseImage source={graph} containerStyle={styles.image} />
      </>
    );
  };

  return (
    <BaseScreen2
      headerProps={{
        component: renderHeader(),
        allowBack: true,
        backgroundColor: theme.colors.color13,
      }}>
      <View style={styles.body}>
        <BaseText h3>Holdings</BaseText>
        <BaseButton
          title="Add holding"
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
            navigation.navigate(ROUTES.holdingForm, { account_id: accountID });
          }}
        />
        <BaseLoadableView scrollable={true} isLoading={getAccount.isLoading}>
          {renderRows()}
        </BaseLoadableView>
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
      minHeight: '100%',
    },
  });

export default InvestmentBreakdownScreen;
