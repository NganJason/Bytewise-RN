import { forwardRef } from 'react';
import { useTheme } from '@rneui/themed';
import { Icon } from '@rneui/themed';

import BaseInput from './BaseInput';

const BaseCurrencyInput = forwardRef(
  (
    {
      label = '',
      value = '',
      placeholder = '',
      onChangeText = function () {},
      onBlur = function () {},
      autoFocus = false,
    },
    ref,
  ) => {
    const { theme } = useTheme();

    return (
      <BaseInput
        ref={ref}
        label={label}
        value={value}
        placeholder={placeholder}
        onBlur={onBlur}
        onChangeText={onChangeText}
        keyboardType="numeric"
        autoFocus={autoFocus}
        leftIcon={
          <Icon
            name="dollar"
            type="font-awesome"
            color={theme.colors.primary}
          />
        }
      />
    );
  },
);

export default BaseCurrencyInput;
