import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { useDimension } from '../../../_shared/hooks';
import { EmptyContentConfig } from '../../../_shared/constant/constant';
import { graph } from '../../../_shared/constant/asset';
import ROUTES from '../../../_shared/constant/routes';
import {
  AmountText,
  BaseImage,
  BaseText,
  BaseScreen2,
  EarningText,
  BaseLoadableView,
  EmptyContent,
  HoldingRow,
  IconButton,
  BaseDivider,
} from '../../../Components';
import { useGetAccount } from '../../../_shared/query';
import { DEFAULT_INVESTMENT_CURRENCY } from '../../../_shared/util';
import { Amount } from '../../../_shared/object';

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
    gain = 0,
    percent_gain: percentGain,
    currency = DEFAULT_INVESTMENT_CURRENCY,
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
          <View style={styles.accountNameContainer}>
            <BaseText h1 isLoading={getAccount.isLoading} loadingLen={10}>
              {account_name}
            </BaseText>
            <IconButton
              iconType="feather"
              iconName="edit"
              type="clear"
              color={theme.colors.color1}
              iconSize={18}
              buttonStyle={styles.editIcon}
              onPress={() => {
                navigation.navigate(ROUTES.accountForm, {
                  account_id: accountID,
                });
              }}
            />
          </View>
          <AmountText
            h2
            amount={new Amount(balance, currency)}
            style={styles.titleText}
            margin={{ top: 8, bottom: 8 }}
            isLoading={getAccount.isLoading}
            sensitive
          />
          <EarningText
            text5
            gain={new Amount(gain, currency)}
            percentGain={percentGain}
            isLoading={getAccount.isLoading}
            margin={{ bottom: 8 }}
            sensitive
          />

          <BaseText text4>Investment</BaseText>
        </View>
        <BaseImage source={graph} containerStyle={styles.image} />
      </>
    );
  };

  return (
    <BaseScreen2
      fabProps={{
        show: true,
        placement: 'right',
        iconName: 'plus',
        iconType: 'entypo',
        iconColor: theme.colors.white,
        color: theme.colors.color1,
        onPress: () =>
          navigation.navigate(ROUTES.holdingForm, {
            account_id: accountID,
            currency: currency,
          }),
        marginBottom: screenHeight * 0.02,
      }}
      headerProps={{
        component: renderHeader(),
        allowBack: true,
        backgroundColor: theme.colors.color4,
      }}>
      <View style={styles.body}>
        <View style={styles.columns}>
          <View style={styles.column}>
            <View>
              <BaseText text6 style={styles.columnText}>
                Price
              </BaseText>
            </View>
            <BaseDivider margin={4} orientation="vertical" />
            <View>
              <BaseText text6 style={styles.columnText}>
                1D % Change
              </BaseText>
            </View>
            <BaseDivider margin={4} orientation="vertical" />
            <View>
              <BaseText text6 style={styles.columnText}>
                Qty
              </BaseText>
            </View>
          </View>
          <View style={styles.column}>
            <View>
              <BaseText text6 style={styles.columnText}>
                Value
              </BaseText>
            </View>
            <BaseDivider margin={4} orientation="vertical" />
            <View>
              <BaseText text6 style={styles.columnText}>
                Unrealised P&L
              </BaseText>
            </View>
          </View>
        </View>
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
    accountNameContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    editIcon: {
      marginLeft: 10,
    },
    columns: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    column: {
      display: 'flex',
      flexDirection: 'row',
    },
    columnText: {
      color: theme.colors.color8,
    },
  });

export default InvestmentBreakdownScreen;
