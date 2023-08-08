import { forwardRef, useEffect, useState } from 'react';

import BaseInput from './BaseInput';
import { CURRENCY_SGD, getCurrencySymbol } from '../../_shared/util/currency';

const BaseCurrencyInput = forwardRef(
  (
    {
      label = '',
      value = 0,
      placeholder = '',
      onChangeText = function () {},
      onBlur = function () {},
      autoFocus = false,
      currency = CURRENCY_SGD,
      isNegative = false,
      ...props
    },
    ref,
  ) => {
    const [inputStr, setInputStr] = useState(value);
    const { onFocus = function () {} } = props || {};
    let currencySymbol = getCurrencySymbol(currency);

    useEffect(() => {
      if (isNaN(value) || value === null) {
        setInputStr('0');
      } else {
        setInputStr(value);
      }
    }, [value]);

    const formatAmount = () => {
      if (isNegative || Number(inputStr) < 0) {
        return `- ${currencySymbol} ${Math.abs(Number(inputStr))}`;
      }
      return `${currencySymbol} ${inputStr}`;
    };

    const handleChangeText = e => {
      e = e.replace(`- ${currencySymbol}`, '');
      e = e.replace(currencySymbol, '');
      e = e.replace(' ', '');

      if (!isNaN(e) || e === '-') {
        onChangeText(Number(e));
        setInputStr(e);
      }
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
      />
    );
  },
);

export default BaseCurrencyInput;
