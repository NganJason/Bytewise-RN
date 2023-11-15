import { useTheme } from '@rneui/themed';
import { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  AmountText,
  BaseScreenV2,
  BaseText,
  DateNavigator,
  BaseLoadableView,
  Transactions,
  IconButton,
} from '../../Components';
import ROUTES from '../../_shared/constant/routes';
import { ACCOUNT_TYPES, ACCOUNT_TYPE_CASH } from '../../_shared/apis/enum';
import { useNavigation } from '@react-navigation/native';
import { useGetAccount } from '../../_shared/query';
import {
  getMonth,
  getUnixRangeOfMonth,
  getYear,
  isAccountTypeAsset,
} from '../../_shared/util';
import { ACCOUNT_TYPE_LOAN } from '../../_shared/apis/enum';
import {
  useError,
  useDimension,
  useTransactionGroups,
} from '../../_shared/hooks';
import { Amount } from '../../_shared/object';
import { UserMetaContext } from '../../_shared/context/UserMetaContext';

const AccountBreakdownScreen = ({ route }) => {
  const { theme } = useTheme();
  const { screenWidth, screenHeight } = useDimension();
  const styles = getStyles(theme, screenWidth, screenHeight);
  const navigation = useNavigation();

  const {
    account_id: accountID = '',
    account_type: accountType = ACCOUNT_TYPE_CASH,
  } = route?.params || {};

  const { getUserBaseCurrency } = useContext(UserMetaContext);
  const [activeDate, setActiveDate] = useState(new Date());

  const { setTimeRange, transactionGroups, isLoading, getErrors } =
    useTransactionGroups(activeDate, accountID);

  const onDateMove = newDate => {
    setActiveDate(newDate);
    setTimeRange(getUnixRangeOfMonth(getYear(newDate), getMonth(newDate)));
  };

  const getAccount = useGetAccount(
    { account_id: accountID },
    { enabled: accountID !== '' },
  );

  const renderRows = () => {
    return <Transactions transactionGroups={transactionGroups} />;
  };

  const renderHeader = () => {
    const {
      account_name = '',
      account_type = 0,
      balance = '0',
      currency = getUserBaseCurrency(),
    } = getAccount?.data?.account || {};

    return (
      <>
        <View style={styles.title}>
          <View style={styles.accountNameContainer}>
            <BaseText
              h1
              isLoading={getAccount.isLoading}
              loadingLen={10}
              numberOfLines={1}>
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
            showNegativeOnly={isAccountTypeAsset(accountType)}
            margin={{ top: 8, bottom: 8 }}
            isLoading={getAccount.isLoading}
            sensitive
          />

          <BaseText text4 isLoading={getAccount.isLoading}>
            {ACCOUNT_TYPES[account_type]}
          </BaseText>
        </View>
      </>
    );
  };

  const renderContent = () => {
    return (
      <>
        <View style={styles.dataNavigator}>
          <DateNavigator
            date={activeDate}
            onForward={onDateMove}
            onBackward={onDateMove}
          />
        </View>
        <BaseLoadableView scrollable={true} isLoading={isLoading}>
          {renderRows()}
        </BaseLoadableView>
      </>
    );
  };

  useError([getAccount, ...getErrors()]);

  return (
    <BaseScreenV2
      subHeader={renderHeader()}
      backButtonProps={{ show: true }}
      fabProps={{
        show: accountType !== ACCOUNT_TYPE_LOAN,
        onPress: () =>
          navigation.navigate(ROUTES.transactionForm, {
            accountID: accountID,
          }),
      }}>
      <View style={styles.body}>{renderContent()}</View>
    </BaseScreenV2>
  );
};

const getStyles = (theme, screenWidth, screenHeight) =>
  StyleSheet.create({
    body: {
      flex: 1,
    },
    dataNavigator: {
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    debtContainer: {
      marginVertical: '30%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    debtTextContainer: {
      alignItems: 'center',
    },
    debtText: {
      marginBottom: theme.spacing.md,
      color: theme.colors.color7,
    },
    accountNameContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: '75%',
    },
    editIcon: {
      marginLeft: 10,
    },
  });

export default AccountBreakdownScreen;
