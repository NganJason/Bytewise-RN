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
import { BaseChip } from '../../Components/View';
import ROUTES from '../../_shared/constant/routes';
import { OnboardingDataContext } from '../../_shared/context';
import { isAccountTypeAsset } from '../../_shared/util';

const AccountOnboarding = ({}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const { data } = useContext(OnboardingDataContext);
  const { accounts = [] } = data;

  const renderRows = () => {
    let rows = [];

    accounts.map((a, idx) => {
      let {
        account_name: accountName = '',
        account_type: accountType,
        balance = 0,
      } = a || {};
      let isAsset = isAccountTypeAsset(accountType);

      const onPress = () => {
        navigation.navigate(ROUTES.accountForm, {
          is_onboarding: true,
          account_onboarding_idx: idx,
        });
      };

      rows.push(
        <BaseRow key={idx} onPress={onPress}>
          <View style={styles.account}>
            <BaseText
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.accountName}>
              {accountName}
            </BaseText>
            {accountType && (
              <BaseChip type={isAsset ? 'primary' : 'secondary'}>
                {isAsset ? 'Asset' : 'Debt'}
              </BaseChip>
            )}
          </View>
          <AmountText>{balance}</AmountText>
        </BaseRow>,
      );
    });

    if (rows.length === 0) {
      rows.push(<ExampleRows key="example" />);
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
        {renderRows()}
      </BaseScrollView>
    </View>
  );
};

const ExampleRows = () => {
  const { theme } = useTheme();

  return (
    <>
      <BaseRow disabled={true}>
        <BaseText style={{ color: theme.colors.color8 }}>
          Eg: My OCBC Account
        </BaseText>
        <AmountText style={{ color: theme.colors.color8 }}>300</AmountText>
      </BaseRow>
      <BaseRow disabled={true}>
        <BaseText style={{ color: theme.colors.color8 }}>
          Eg: Tuition Fee Loan
        </BaseText>
        <AmountText style={{ color: theme.colors.color8 }}>300</AmountText>
      </BaseRow>
    </>
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
