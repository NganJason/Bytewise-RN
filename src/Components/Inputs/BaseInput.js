import { useTheme, Input } from '@rneui/themed';
import { StyleSheet } from 'react-native';

import BaseText from '../BaseText';

const BaseInput = ({
  label = 'Hello',
  value = '',
  placeholder = '',
  keyboardType = 'default',
  onChangeText = function () {},
  onBlur = function () {},
}) => {
  const { theme } = useTheme();
  //const styles = getStyles(theme);

  return (
    <Input
      keyboardType={keyboardType}
      onChangeText={onChangeText}
      onBlur={onBlur}
      placeholder={placeholder}
      label={label !== '' && <BaseText h3>{label}</BaseText>}
      value={value}
      selectionColor={theme.colors.primary}
    />
  );
};

export default BaseInput;

//const getStyles = _ => StyleSheet.create({});
