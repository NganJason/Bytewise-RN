import { CURRENCY } from '../api/data/model';

export const getProgress = (val, total) => {
  return val / total;
};

export const formatMonetaryVal = (val, currency) => {
  let currencySymbol = CURRENCY[currency.toUpperCase()];

  if (currencySymbol === '') {
    currencySymbol = CURRENCY.DEFAULT;
  }

  return `${currencySymbol} ${val}`;
};

export const moveMonth = (date, diff) =>
  new Date(date.setMonth(date.getMonth() + diff));
