import { MONTHS_VALUE } from '../constant/constant';

export const moveMonth = (date, diff) =>
  new Date(date.setMonth(date.getMonth() + diff));

export const getCurrMonth = () => {
  let d = new Date();
  return d.getMonth();
};

export const getCurrYear = () => {
  let d = new Date();
  return d.getFullYear();
};

export const isMonthValid = monthEnum => {
  if (monthEnum > MONTHS_VALUE.Dec || monthEnum < MONTHS_VALUE.Jan) {
    return false;
  }

  return true;
};
