import BaseInput from './BaseInput';

import CurrencyInput from 'react-native-currency-input';

const BaseCurrencyInput = ({
  label = '',
  value = '100',
  placeholder = '',
  onChangeText = function () {},
  onBlur = function () {},
}) => {
  console.log(label);
  return (
    <CurrencyInput
      onChangeValue={onChangeText}
      renderTextInput={textInputProps => {
        console.log(textInputProps);
        return <BaseInput {...textInputProps} />;
      }}
      value={value}
      renderText
      prefix="R$"
      delimiter="."
      separator=","
      precision={2}
      onBlur={onBlur}
      placeholder={placeholder}
      label={label}
    />
  );
};

export default BaseCurrencyInput;
