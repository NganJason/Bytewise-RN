import { useNavigation } from '@react-navigation/native';
import { Icon, useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { useDimension } from '../../../_shared/hooks';
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
  InfoToolTip,
} from '../../../Components';
import { useGetAccount } from '../../../_shared/query';
import { genStockUpdateTimeMsg } from '../../../_shared/constant/message';
import { getStockUpdateTime } from '../../../_shared/util';

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
    balance = 0,
    total_cost = 0,
    holdings = [],
  } = getAccount?.data?.account || {};

  const renderRows = () => {
    let rows = [];
    holdings.map(holding => {
      rows.push(<HoldingRow key={holding.holding_id} {...holding} />);
    });

    if (rows.length === 0) {
      return (
        <EmptyContent
          item={EmptyContentConfig.investment}
          route={ROUTES.holdingForm}
          routeParam={{ account_id: accountID }}
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
            {account_name}
          </BaseText>
          <AmountText
            style={styles.titleText}
            h2
            margin={{ top: 8 }}
            isLoading={getAccount.isLoading}>
            {balance}
          </AmountText>
          <EarningText
            currVal={balance}
            initialVal={total_cost}
            text5
            margin={{ vertical: 4 }}
            isLoading={getAccount.isLoading}
          />

          <View style={styles.accountType}>
            <BaseText text4 margin={{ right: 6 }}>
              Investment
            </BaseText>
            {getStockUpdateTime(holdings) !== 0 && (
              <InfoToolTip
                message={genStockUpdateTimeMsg(getStockUpdateTime(holdings))}
              />
            )}
          </View>

          <BaseButton
            title="Edit Account"
            type="clear"
            align="flex-start"
            size="sm"
            textStyle={{ color: theme.colors.color1 }}
            margin={{ top: 6 }}
            icon={
              <Icon
                name="edit"
                type="feather"
                color={theme.colors.color1}
                size={13}
              />
            }
            onPress={() => {
              navigation.navigate(ROUTES.accountForm, {
                account_id: accountID,
              });
            }}
          />
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
        backgroundColor: theme.colors.color4,
      }}>
      <View style={styles.body}>
        <BaseText h3>Holdings</BaseText>
        <BaseButton
          title="Add Holding"
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
      zIndex: -1,
    },
    body: {
      flex: 1,
      paddingVertical: theme.spacing.lg,
    },
    accountType: {
      // marginTop: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default InvestmentBreakdownScreen;
