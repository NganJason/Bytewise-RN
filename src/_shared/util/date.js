import { DAYS, MONTHS_VALUE } from '../constant/constant';
import { capitalizeFirstWord } from './string';

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

export const getMonthStr = (d = new Date()) => {
  const options = { month: 'short' };
  const monthString = d.toLocaleString('en-US', options);
  return capitalizeFirstWord(monthString);
};

export const renderCalendarTs = ts => {
  const d = new Date(ts);

  const yyyy = getYear(d);
  const mm = getMonth(d);
  const date = getDate(d);
  const day = DAYS[getDay(d)];

  return `${date}/${mm}/${yyyy} (${day})`;
};

export const getDateStringFromTs = ts => {
  const date = new Date(ts);
  return getFormattedDateString(date);
};

export const getDateObjFromTs = ts => {
  const d = new Date(ts);
  return d;
};

export const getDateObjFromDateStr = formattedDateStr => {
  return new Date(Date.parse(formattedDateStr));
};

export const getFormattedDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  const formattedMonth = month.toString().padStart(2, '0');
  const formattedDay = day.toString().padStart(2, '0');

  return `${year}-${formattedMonth}-${formattedDay}`;
};

export const getFirstDayOfMonthFormatted = timestamp => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const formattedMonth = month < 10 ? `0${month}` : month;

  return `${year}-${formattedMonth}-01`;
};

export const getDateStringWithoutDelim = (d = new Date()) => {
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  const formattedMonth = month.toString().padStart(2, '0');
  const formattedDay = day.toString().padStart(2, '0');

  return `${year}${formattedMonth}${formattedDay}`;
};

export const parseDateStringWithoutDelim = (dateStr = '') => {
  if (dateStr === '') {
    return new Date();
  }
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6) - 1; // Subtract 1 from month as months are 0-indexed
  const day = dateStr.slice(6, 8);

  return new Date(year, month, day);
};

export const getYearMonthString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = d.getMonth() + 1;

  const formattedMonth = month.toString().padStart(2, '0');

  return `${year}-${formattedMonth}`;
};

// 2023 Nov
export const getFormattedYearMonth = (d = new Date()) => {
  const options = { year: 'numeric', month: 'short' };
  const formattedDate = d.toLocaleDateString('en-US', options);
  return formattedDate;
};

export const getYearString = (d = new Date()) => {
  return String(d.getFullYear());
};

export const getUnixRangeOfMonth = (year = getYear(), month = getMonth()) => {
  const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const startUnixTime = Math.floor(startDate.getTime());
  const endUnixTime = Math.floor(endDate.getTime());

  return [startUnixTime, endUnixTime];
};

export const getUnixRangeOfYear = (year = getYear()) => {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

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

export const getDaysInMonth = (year, month) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  let daysArray = [];
  for (let i = 0; i < daysInMonth; i++) {
    daysArray.push(i + 1);
  }

  return daysArray;
};

export const isTsLargerThanCurrTime = ts => {
  // Convert timestamp to milliseconds if it's in seconds
  if (ts.toString().length === 10) {
    ts *= 1000;
  }

  const currTime = Date.now();
  if (ts <= currTime) {
    return false;
  }
  return true;
};

export const tsToDateTimeStr = ts => {
  let d = new Date(ts);
  let year = getYear(d);
  let month = String(getMonth(d)).padStart(2, '0');
  let date = String(getDate(d)).padStart(2, '0');

  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${date} ${hours}:${minutes}`;
};

export const getCurrDatePercentage = (activeDate = new Date()) => {
  let currMonth = getMonth();
  let activeMonth = getMonth(activeDate);

  if (currMonth !== activeMonth) {
    return 0;
  }

  const currentDate = new Date();
  const currentDay = currentDate.getDate();

  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();

  const percentage = currentDay / lastDayOfMonth;
  return percentage;
};

export const getMonthPercentage = (activeDate = new Date()) => {
  let aciveMonth = getMonth(activeDate);
  return aciveMonth / 12;
};
