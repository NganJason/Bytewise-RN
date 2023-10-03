import { Icon, useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  currencies,
  DEFAULT_CURRENCY,
  getSupportedCurrencyOptions,
} from '../../_shared/util';
import { BaseText } from '../Text';
import { BaseBottomSheet } from '../View';

const BaseCurrencyInput = ({
  value = DEFAULT_CURRENCY,
  allowSelect = true,
  onSelect = function (currency) {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const onPress = item => {
    onSelect(item);
    toggleModal();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={toggleModal}
      disabled={!allowSelect}>
      {allowSelect && (
        <Icon
          name={'chevron-down'}
          type={'entypo'}
          size={20}
          color={theme.colors.color7}
        />
      )}
      <BaseText text2 color={theme.colors.color6}>
        {currencies[value].symbol}
      </BaseText>
      <BaseBottomSheet
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        close={toggleModal}
        onSelect={onPress}
        items={getSupportedCurrencyOptions()}
        label="name"
      />
    </TouchableOpacity>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default BaseCurrencyInput;
