import { MONTHS_VALUE } from '../constant/constant';

export const moveMonth = (date, diff) =>
  new Date(date.setMonth(date.getMonth() + diff));

// Range: 1 - 12
export const getMonth = (d = new Date()) => {
  return d.getMonth() + 1;
};

export const getYear = (d = new Date()) => {
  return d.getFullYear();
};

export const getDate = (d = new Date()) => {
  return d.getDate();
};

export const getDay = (d = new Date()) => {
  return d.getDay();
};

export const getUnixRangeOfMonth = (year = getYear(), month = getMonth()) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const startUnixTime = Math.floor(startDate.getTime());
  const endUnixTime = Math.floor(endDate.getTime());

  return [startUnixTime, endUnixTime];
};

export const isMonthValid = monthEnum => {
  if (monthEnum > MONTHS_VALUE.Dec || monthEnum < MONTHS_VALUE.Jan) {
    return false;
  }

  return true;
};
