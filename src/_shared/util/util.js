export const moveMonth = (date, diff) =>
  new Date(date.setMonth(date.getMonth() + diff));
