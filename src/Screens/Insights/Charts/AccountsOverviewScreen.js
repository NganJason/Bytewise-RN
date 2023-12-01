import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet } from 'react-native';
import {
  AmountText,
  BaseScreenV2,
  BaseText,
  PieChartWithBreakdown,
} from '../../../Components';
import {
  ACCOUNT_TYPE_BANK_ACCOUNT,
  ACCOUNT_TYPE_INVESTMENT,
  EQUITY_TYPES,
  EQUITY_TYPE_ASSET,
} from '../../../_shared/apis/enum';
import { useAccounts, useError } from '../../../_shared/hooks';
import { Amount } from '../../../_shared/object';
import { capitalize } from '../../../_shared/util';
import ROUTES from '../../../_shared/constant/routes';
import { useState } from 'react';

const AccountsOverviewScreen = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const { type = EQUITY_TYPE_ASSET } = route?.params || {};
  const [selectedAccount, setSelectedAccount] = useState(null);
  const {
    getSortedAssetAccounts,
    getSortedDebtAccounts,
    getTotalAsset,
    getTotalDebt,
    getErrors,
    isLoading,
  } = useAccounts();

  const parseAccountData = () => {
    let acc;
    if (type === EQUITY_TYPE_ASSET) {
      acc = getSortedAssetAccounts();
    } else {
      acc = getSortedDebtAccounts();
    }
    return acc.map(d => {
      d.name = d.account_name;
      d.value = Math.abs(Number(d.balance));
      d.onRowPress = () => onAccountPress(d);
      return d;
    });
  };

  const onAccountPress = (account = {}) => {
    const {
      account_id: accountID = '',
      account_type: accountType = ACCOUNT_TYPE_BANK_ACCOUNT,
    } = account;

    let rt = ROUTES.accountBreakdown;
    if (accountType === ACCOUNT_TYPE_INVESTMENT) {
      rt = ROUTES.investmentBreakdown;
    }

    navigation.navigate(rt, {
      account_id: accountID,
      account_type: accountType,
    });
  };

  const getTotal = () => {
    if (selectedAccount !== null) {
      const { balance = 0, currency = '' } = selectedAccount || {};
      return new Amount(Math.abs(balance), currency);
    } else if (type === EQUITY_TYPE_ASSET) {
      return getTotalAsset();
    } else {
      return getTotalDebt();
    }
  };

  useError(getErrors());

  return (
    <BaseScreenV2
      isLoading={isLoading}
      hideInfoButtonProps={{ show: true }}
      drawerButtonProps={{ show: true }}
      backButtonProps={{ show: true }}
      headerProps={{
        allowBack: true,
        centerComponent: (
          <BaseText h2>{capitalize(EQUITY_TYPES[type])}</BaseText>
        ),
      }}>
      <PieChartWithBreakdown
        rowSensitive
        data={parseAccountData()}
        onSelectedItemChange={d => setSelectedAccount(d)}
        centerComponent={
          <>
            <AmountText h1 sensitive amount={getTotal()} adjustsFontSizeToFit />
            <BaseText>
              {selectedAccount ? selectedAccount.account_name : 'Total'}
            </BaseText>
          </>
        }
      />
    </BaseScreenV2>
  );
};

const getStyles = theme => StyleSheet.create({});

export { AccountsOverviewScreen };
