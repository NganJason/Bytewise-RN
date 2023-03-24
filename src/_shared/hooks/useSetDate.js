import { useState } from 'react';
import { MONTHS } from '../constant/constant';
import { moveMonth } from '../util/util';

const useSetDate = () => {
  const TODAY = new Date();
  const [date, setDate] = useState(TODAY);

  const addOneMonth = () => setDate(moveMonth(date, 1));
  const subOneMonth = () => setDate(moveMonth(date, -1));

  const renderDate = () => {
    const month = MONTHS[date.getMonth()];
    return `${month} ${date.getFullYear()}`;
  };

  return { renderDate, addOneMonth, subOneMonth };
};

export default useSetDate;
