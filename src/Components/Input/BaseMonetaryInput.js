import { forwardRef, useEffect, useState } from 'react';

import BaseInput from './BaseInput';
import { DEFAULT_CURRENCY } from '../../_shared/util';
import BaseCurrencyInput from './BaseCurrencyInput';

const BaseMonetaryInput = forwardRef(
  (
    {
      label = '',
      value = 0,
      placeholder = '',
      onChangeText = function () {},
      onChangeCurrency = function (currency) {},
      onBlur = function () {},
      autoFocus = false,
      allowSelectCurrency = false,
      currency = DEFAULT_CURRENCY,
      ...props
    },
    ref,
  ) => {
    const [inputStr, setInputStr] = useState(value);
    const { onFocus = function () {} } = props || {};

    useEffect(() => {
      if (isNaN(value) || value === null) {
        setInputStr('0');
      } else {
        setInputStr(value);
      }
    }, [value]);

    const formatAmount = () => {
      return String(inputStr);
    };

    const handleChangeText = e => {
      onChangeText(e);
      setInputStr(e);
    };

    const onFocusHandler = () => {
      if (Number(inputStr) === 0) {
        setInputStr('');
      }
      onFocus();
    };

    const onBlurHandler = () => {
      if (inputStr === '') {
        setInputStr('0');
      }
      onBlur();
    };

    return (
      <BaseInput
        {...props}
        ref={ref}
        label={label}
        value={formatAmount()}
        placeholder={placeholder}
        onBlur={onBlurHandler}
        onFocus={onFocusHandler}
        onChangeText={handleChangeText}
        keyboardType="numeric"
        autoFocus={autoFocus}
        leftIcon={
          <BaseCurrencyInput
            value={currency}
            allowSelect={allowSelectCurrency}
            onSelect={onChangeCurrency}
          />
        }
      />
    );
  },
);

export default BaseMonetaryInput;
