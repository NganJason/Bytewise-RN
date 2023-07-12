import { forwardRef, useEffect, useState } from 'react';

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
    const { onFocus = function () {} } = props || {};

    useEffect(() => {
      setInputStr(value);
    }, [value]);

    const formatAmount = () => {
      return `${CURRENCY} ${inputStr}`;
    };

    const handleChangeText = e => {
      e = e.replace(CURRENCY, '');
      e = e.replace(' ', '');

      if (!isNaN(e)) {
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
