import { useTheme } from '@rneui/themed';
import { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BaseBottomSheet,
  BaseScrollView,
  BaseText,
  TouchInput,
} from '../../Components';
import CountryFlag from 'react-native-country-flag';
import { OnboardingDataContext } from '../../_shared/context';
import { getCurrencyMap, supportedBaseCurrencies } from '../../_shared/util';

const CurrencyOnboarding = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { data, addBaseCurrency } = useContext(OnboardingDataContext);

  const [isCurrencySheetVisible, setIsCurrencySheetVisible] = useState(false);
  const toggleCurrencySheet = () => {
    setIsCurrencySheetVisible(!isCurrencySheetVisible);
  };

  const getCurrencyOptions = () => {
    let options = [];
    supportedBaseCurrencies.map(currency => {
      let c = getCurrencyMap(currency);
      c.leftIcon = c.countryFlag;
      options.push(c);
    });
    return options;
  };

  const onCurrencyChange = item => {
    addBaseCurrency(item.code);
    toggleCurrencySheet();
  };

  return (
    <View style={styles.container}>
      <View>
        <BaseText h1>Select your</BaseText>
        <BaseText h1>base currency</BaseText>
        <BaseText text2 style={styles.subtitle} numberOfLines={0}>
          All monetary values will be displayed in base currency
        </BaseText>
      </View>

      <BaseScrollView showsVerticalScrollIndicator={false}>
        <TouchInput
          leftIcon={
            <CountryFlag
              isoCode={getCurrencyMap(data.currency).iso_code}
              size={20}
              style={styles.flag}
            />
          }
          value={getCurrencyMap(data.currency).name}
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
      </BaseScrollView>
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
    flag: {
      marginRight: 10,
    },
  });
};

export default CurrencyOnboarding;
