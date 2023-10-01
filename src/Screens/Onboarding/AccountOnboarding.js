import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  AmountText,
  BaseButton,
  BaseRow,
  BaseScrollView,
  BaseText,
} from '../../Components';
import { EQUITY_TYPE_ASSET, EQUITY_TYPE_DEBT } from '../../_shared/apis/enum';
import ROUTES from '../../_shared/constant/routes';
import { OnboardingDataContext } from '../../_shared/context';
import { Amount } from '../../_shared/object';
import { getEquityType } from '../../_shared/util';

const AccountOnboarding = ({}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const { data } = useContext(OnboardingDataContext);
  const { accounts = [] } = data;

  const renderRows = (equityType = EQUITY_TYPE_ASSET) => {
    let rows = [];

    accounts.map((a, idx) => {
      let {
        account_name: accountName = '',
        account_type: accountType,
        balance = 0,
      } = a || {};
      if (equityType !== getEquityType(accountType)) {
        return;
      }

      const onPress = () => {
        navigation.navigate(ROUTES.accountForm, {
          is_onboarding: true,
          account_onboarding_idx: idx,
        });
      };

      rows.push(
        <BaseRow
          key={idx}
          onPress={onPress}
          dividerMargin={0}
          showDivider={false}>
          <View style={styles.account}>
            <BaseText
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.accountName}>
              {accountName}
            </BaseText>
          </View>
          <AmountText amount={new Amount(balance, data.currency)} />
        </BaseRow>,
      );
    });

    if (rows.length === 0) {
      rows.push(<ExampleRow key="example" equityType={equityType} />);
    }

    return rows;
  };

  return (
    <View style={styles.container}>
      <View>
        <BaseText h1>Setup your</BaseText>
        <BaseText h1>accounts</BaseText>
        <BaseText text2 style={styles.subtitle}>
          Accounts keep track of your money and net worth
        </BaseText>
      </View>

      <View style={styles.buttonContainer}>
        <BaseButton
          title="Add more"
          type="secondary"
          align="flex-end"
          size="sm"
          onPress={() =>
            navigation.navigate(ROUTES.accountSelection, {
              is_onboarding: true,
            })
          }
        />
      </View>

      <BaseScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <BaseRow dividerMargin={0} disabled>
            <BaseText text1>Asset</BaseText>
          </BaseRow>
          {renderRows(EQUITY_TYPE_ASSET)}
        </View>

        <View style={styles.section}>
          <BaseRow dividerMargin={0} disabled>
            <BaseText text1>Debt</BaseText>
          </BaseRow>
          {renderRows(EQUITY_TYPE_DEBT)}
        </View>
      </BaseScrollView>
    </View>
  );
};

const ExampleRow = ({ equityType = EQUITY_TYPE_ASSET }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { data } = useContext(OnboardingDataContext);

  if (equityType === EQUITY_TYPE_ASSET) {
    return (
      <BaseRow
        showDivider={false}
        onPress={() =>
          navigation.navigate(ROUTES.accountSelection, {
            is_onboarding: true,
          })
        }>
        <BaseText style={{ color: theme.colors.color8 }}>
          Eg: OCBC Savings Account
        </BaseText>
        <AmountText
          amount={new Amount(300, data.currency)}
          style={{ color: theme.colors.color8 }}
        />
      </BaseRow>
    );
  }

  return (
    <BaseRow
      showDivider={false}
      onPress={() =>
        navigation.navigate(ROUTES.accountSelection, {
          is_onboarding: true,
        })
      }>
      <BaseText style={{ color: theme.colors.color8 }}>
        Eg: Tuition Fee Loan
      </BaseText>
      <AmountText
        amount={new Amount(4000, data.currency)}
        style={{ color: theme.colors.color8 }}
      />
    </BaseRow>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    subtitle: {
      marginTop: 10,
      marginBottom: 12,
      color: theme.colors.color8,
    },
    section: {
      marginBottom: 24,
    },
    buttonContainer: {
      marginBottom: 8,
    },
    account: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    accountName: {
      maxWidth: '50%',
    },
  });
};

export default AccountOnboarding;
