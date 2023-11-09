import { useTheme } from '@rneui/themed';
import { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  AmountText,
  BaseImage,
  BaseScreen2,
  BaseText,
  DateNavigator,
  BaseLoadableView,
  Transactions,
  IconButton,
} from '../../Components';
import { card, coin, coinsack } from '../../_shared/constant/asset';
import ROUTES from '../../_shared/constant/routes';
import {
  ACCOUNT_TYPES,
  ACCOUNT_TYPE_CASH,
  ACCOUNT_TYPE_CREDIT_CARD,
} from '../../_shared/apis/enum';
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
import { sapiens3 } from '../../_shared/constant/asset';
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

    const getImg = () => {
      if (isAccountTypeAsset(accountType)) {
        return coin;
      }
      if (accountType === ACCOUNT_TYPE_CREDIT_CARD) {
        return card;
      }
      return coinsack;
    };

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
            showNegativeOnly={isAccountTypeAsset(accountType)}
            margin={{ top: 8, bottom: 8 }}
            isLoading={getAccount.isLoading}
            sensitive
          />

          <BaseText text4 isLoading={getAccount.isLoading}>
            {ACCOUNT_TYPES[account_type]}
          </BaseText>
        </View>
        <BaseImage source={getImg()} containerStyle={styles.image} />
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

  const renderMoreFeature = () => {
    return (
      <View style={styles.debtContainer}>
        <BaseImage
          width={screenWidth * 0.4}
          height={screenWidth * 0.4}
          source={sapiens3}
        />
        <View style={styles.debtTextContainer}>
          <BaseText text3 style={styles.debtText}>
            More features coming soon.
          </BaseText>
          <BaseText text3 style={styles.debtText}>
            Stay tuned!
          </BaseText>
        </View>
      </View>
    );
  };

  useError([getAccount, ...getErrors()]);

  return (
    <BaseScreen2
      headerProps={{
        component: renderHeader(),
        allowBack: true,
        backgroundColor: isAccountTypeAsset(accountType)
          ? theme.colors.color4
          : theme.colors.color13,
      }}
      fabProps={
        accountType !== ACCOUNT_TYPE_LOAN && {
          show: true,
          placement: 'right',
          iconName: 'plus',
          iconType: 'entypo',
          iconColor: theme.colors.white,
          color: theme.colors.color1,
          onPress: () =>
            navigation.navigate(ROUTES.transactionForm, {
              accountID: accountID,
            }),
          marginBottom: screenHeight * 0.02,
        }
      }>
      <View style={styles.body}>{renderContent()}</View>
    </BaseScreen2>
  );
};

const getStyles = (theme, screenWidth, screenHeight) =>
  StyleSheet.create({
    body: {
      flex: 1,
    },
    image: {
      width: screenHeight * 0.2,
      height: screenHeight * 0.18,
      position: 'absolute',
      right: screenWidth * -0.15,
      zIndex: -1,
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
    },
    editIcon: {
      marginLeft: 10,
    },
  });

export default AccountBreakdownScreen;
