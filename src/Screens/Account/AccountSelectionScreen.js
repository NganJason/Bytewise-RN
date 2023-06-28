import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import {
  BaseScreen,
  BaseText,
  BaseCard,
  BaseGrid,
  BaseScrollView,
} from '../../Components';
import {
  ACCOUNT_TYPES,
  ACCOUNT_TYPE_BANK_ACCOUNT,
  ACCOUNT_TYPE_CASH,
  ACCOUNT_TYPE_CREDIT_CARD,
  ACCOUNT_TYPE_INVESTMENT,
  ACCOUNT_TYPE_LOAN,
  ACCOUNT_TYPE_MORTGAGE,
  EQUITY_TYPE_ASSET,
  EQUITY_TYPE_DEBT,
} from '../../_shared/apis/enum';
import ROUTES from '../../_shared/constant/routes';
import { capitalize } from '../../_shared/util/string';

const assets = [
  ACCOUNT_TYPE_CASH,
  ACCOUNT_TYPE_BANK_ACCOUNT,
  ACCOUNT_TYPE_INVESTMENT,
];
const debts = [
  ACCOUNT_TYPE_CREDIT_CARD,
  ACCOUNT_TYPE_LOAN,
  ACCOUNT_TYPE_MORTGAGE,
];

const AccountSelectionScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const renderContent = (type = EQUITY_TYPE_ASSET) => {
    let items = [];
    if (type === EQUITY_TYPE_ASSET) {
      items = assets;
    } else {
      items = debts;
    }

    return (
      <BaseGrid
        items={items}
        spacing={30}
        containerStyle={styles.grid}
        renderItem={item => (
          <BaseCard
            key={item.account_id}
            onPress={() => {
              navigation.navigate(ROUTES.accountForm, { account_type: item });
            }}
            color={
              type === EQUITY_TYPE_ASSET
                ? theme.colors.color4
                : theme.colors.color13
            }>
            <BaseText
              text3
              margin={{ vertical: 10 }}
              color={
                type === EQUITY_TYPE_ASSET
                  ? theme.colors.color10
                  : theme.colors.color12
              }>
              {capitalize(ACCOUNT_TYPES[item])}
            </BaseText>
          </BaseCard>
        )}
      />
    );
  };

  return (
    <BaseScreen
      headerProps={{
        allowBack: true,
        centerComponent: (
          <View style={styles.header}>
            <BaseText h2>Add account</BaseText>
          </View>
        ),
      }}>
      <BaseScrollView>
        <View>
          <BaseText h3>Assets</BaseText>
          {renderContent(EQUITY_TYPE_ASSET)}
        </View>

        <View>
          <BaseText h3>Debts</BaseText>
          {renderContent(EQUITY_TYPE_DEBT)}
        </View>
      </BaseScrollView>
    </BaseScreen>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    grid: {
      marginTop: 0,
    },
  });
};

export default AccountSelectionScreen;
