import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { BaseScreen, BaseText } from '../../Components';
import { BaseCard, BaseGrid, BaseScrollView } from '../../Components/View';
import {
  EQUITY_TYPE_ASSET,
  EQUITY_TYPE_LIABILITY,
} from '../../_shared/apis/enum';
import ROUTES from '../../_shared/constant/routes';
import { capitalizeWords } from '../../_shared/util/string';

const assets = ['cash', 'bank account', 'investment'];
const liabilities = ['credit card', 'loan', 'mortgage'];

const AccountSelectionScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const renderContent = (type = EQUITY_TYPE_ASSET) => {
    let items = [];
    if (type === EQUITY_TYPE_ASSET) {
      items = assets;
    } else {
      items = liabilities;
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
              navigation.navigate(ROUTES.account);
            }}
            color={
              type === EQUITY_TYPE_ASSET
                ? theme.colors.color4
                : theme.colors.color13
            }>
            <BaseText
              text3
              style={{
                ...styles.cardText,
                color:
                  type === EQUITY_TYPE_ASSET
                    ? theme.colors.color10
                    : theme.colors.color12,
              }}>
              {capitalizeWords(item)}
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
            <BaseText h2>Add Account</BaseText>
          </View>
        ),
      }}>
      <BaseScrollView>
        <View>
          <BaseText h3>Assets</BaseText>
          {renderContent(EQUITY_TYPE_ASSET)}
        </View>

        <View>
          <BaseText h3>Liabilities</BaseText>
          {renderContent(EQUITY_TYPE_LIABILITY)}
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
    cardText: {
      marginVertical: 10,
    },
  });
};

export default AccountSelectionScreen;
