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
      let valueStr = String(inputStr);

      let formattedAmount =
        valueStr === ''
          ? `${currencySymbol} `
          : valueStr.startsWith('-')
          ? `-${currencySymbol} ${valueStr.slice(1)}`
          : `${currencySymbol} ${valueStr}`;
      return formattedAmount;
    };

    const handleChangeText = e => {
      e = e.replace(currencySymbol, '');
      e = e.replace(' ', '');
      const regex = /^-?\d*\.?\d*$/;

      // Validate input: allow digits, optional minus sign, and optional decimal point
      if (regex.test(e) || e === '' || e === '-') {
        onChangeText(e);
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
