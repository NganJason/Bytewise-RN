import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  BaseButton,
  BaseCurrencyInput,
  BaseInput,
  BaseRow,
  BaseScreen,
  BaseText,
  SearchBottomSheetInput,
} from '../../../Components';
import { useSearchSecurities } from '../../../_shared/mutations/security';

const InvestmentForm = ({ route }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const shareID = route.params?.share_id || '';
  const isAddHolding = () => {
    return shareID === '';
  };

  const [investmentForm, setInvestmentForm] = useState({
    ticker_symbol: '',
    cost_per_unit: 0,
    num_unit: 0,
  });

  const searchSecurities = useSearchSecurities();

  const onTickerSymbolChange = e => {
    setInvestmentForm({ ...investmentForm, ticker_symbol: e });
  };

  const onCostPerUnitChange = e => {
    setInvestmentForm({ ...investmentForm, cost_per_unit: e });
  };

  const onNumUnitChange = e => {
    setInvestmentForm({ ...investmentForm, num_unit: e });
  };

  const onSave = () => {
    navigation.goBack();
  };

  return (
    <BaseScreen
      headerProps={{
        allowBack: true,
        centerComponent: (
          <View style={styles.header}>
            <BaseText h2>
              {isAddHolding() ? 'Add holding' : 'Edit holding'}
            </BaseText>
          </View>
        ),
      }}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        enableOnAndroid={true}
        keyboardOpeningTime={0}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formBody}>
        <SearchBottomSheetInput
          label="Symbol"
          itemLabel="symbol"
          onChangeText={onTickerSymbolChange}
          query={searchSecurities}
          data={searchSecurities?.data?.securities || []}
          renderItem={(item, onPress) => (
            <BaseRow dividerMargin={2} onPress={onPress}>
              <View>
                <BaseText text3>{item.symbol}</BaseText>
                <BaseText
                  text4
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.securityName}>
                  {item.security_name}
                </BaseText>
              </View>
            </BaseRow>
          )}
        />

        <BaseCurrencyInput
          label="Cost per unit"
          value={investmentForm.cost_per_unit}
          onChangeText={onCostPerUnitChange}
        />

        <BaseInput
          label="Number of unit"
          value={String(investmentForm.num_unit)}
          keyboardType="numeric"
          onChangeText={onNumUnitChange}
          clearButtonMode="always"
          maxLength={120}
        />

        <View style={styles.btnContainer}>
          <BaseButton title="Save" size="lg" width={200} onPress={onSave} />
        </View>
      </KeyboardAwareScrollView>
    </BaseScreen>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    btnContainer: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    securityName: {
      marginTop: 4,
      color: theme.colors.color8,
    },
  });

export default InvestmentForm;
