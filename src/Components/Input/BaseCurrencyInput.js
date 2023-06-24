import { forwardRef, useState } from 'react';

import BaseInput from './BaseInput';

import { CURRENCY } from '../../_shared/mock_data/user';

const BaseCurrencyInput = forwardRef(
  (
    {
      label = '',
      value = 0,
      placeholder = '',
      onChangeText = function () {},
      onBlur = function () {},
      autoFocus = false,
      ...props
    },
    ref,
  ) => {
    const [inputStr, setInputStr] = useState(value);

    const formatAmount = () => {
      return `${CURRENCY} ${inputStr}`;
    };

    const handleChangeText = e => {
      e = e.replace(CURRENCY, '');
      e = e.replace(' ', '');
      e = removeAlphabets(e);

      onChangeText(Number(e));
      setInputStr(e);
    };

    const onFocus = () => {
      if (Number(inputStr) === 0) {
        setInputStr('');
      }
    };

    const onBlurHandler = () => {
      if (inputStr === '') {
        setInputStr('0');
      }
      onBlur();
    };

    const removeAlphabets = input => {
      let val = input.replace(/[^\d]/g, '');
      return val;
    };

    return (
      <BaseInput
        ref={ref}
        label={label}
        value={formatAmount()}
        placeholder={placeholder}
        onBlur={onBlurHandler}
        onFocus={onFocus}
        onChangeText={handleChangeText}
        keyboardType="numeric"
        autoFocus={autoFocus}
        {...props}
      />
    );
  },
);

export default BaseCurrencyInput;
