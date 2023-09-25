import { useTheme } from '@rneui/themed';
import { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BaseBottomSheet, BaseText, TouchInput } from '../../Components';
import CountryFlag from 'react-native-country-flag';
import { OnboardingDataContext } from '../../_shared/context';
import { currencies, supportedBaseCurrencies } from '../../_shared/util';

const CurrencyOnboarding = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { addBaseCurrency } = useContext(OnboardingDataContext);

  const [selectedCurrency, setSeletectedCurrency] = useState(currencies.SGD);

  const [isCurrencySheetVisible, setIsCurrencySheetVisible] = useState(false);
  const toggleCurrencySheet = () => {
    setIsCurrencySheetVisible(!isCurrencySheetVisible);
  };

  const getCurrencyOptions = () => {
    let options = [];
    supportedBaseCurrencies.map(currency => {
      currency.leftIcon = <CountryFlag isoCode={currency.iso_code} size={20} />;
      options.push(currency);
    });
    return options;
  };

  const onCurrencyChange = item => {
    setSeletectedCurrency(item);
    addBaseCurrency(item.code);
    toggleCurrencySheet();
  };

  return (
    <View style={styles.container}>
      <View>
        <BaseText h1>Select your</BaseText>
        <BaseText h1>base currency</BaseText>
        <BaseText text2 style={styles.subtitle}>
          All monetary values will be displayed in base currency
        </BaseText>
      </View>

      <View>
        <TouchInput
          leftIcon={
            <CountryFlag isoCode={selectedCurrency.iso_code} size={20} />
          }
          value={selectedCurrency.name}
          onPress={toggleCurrencySheet}
        />
        <BaseBottomSheet
          isVisible={isCurrencySheetVisible}
          onBackdropPress={toggleCurrencySheet}
          close={toggleCurrencySheet}
          onSelect={onCurrencyChange}
          items={getCurrencyOptions()}
          label="name"
        />
      </View>
    </View>
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
  });
};

export default CurrencyOnboarding;
