import { forwardRef } from 'react';

import BaseInput from './BaseInput';

import { CURRENCY } from '../../_shared/mock_data/user';

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
    const formatAmount = () => {
      if (value !== '') {
        return `${CURRENCY} ${value}`;
      }
    };

    const handleChangeText = e => {
      const arr = e.split(' ');
      // remove currency symbol
      if (arr.length === 2) {
        onChangeText(arr[1]);
        return;
      }
      onChangeText(e);
    };

    return (
      <BaseInput
        ref={ref}
        label={label}
        value={formatAmount()}
        placeholder={placeholder}
        onBlur={onBlur}
        onChangeText={handleChangeText}
        keyboardType="numeric"
        autoFocus={autoFocus}
      />
    );
  },
);

export default BaseCurrencyInput;
