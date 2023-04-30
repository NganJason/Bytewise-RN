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
