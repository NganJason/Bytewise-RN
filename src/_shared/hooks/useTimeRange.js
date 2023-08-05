import { useState } from 'react';
import { getMonth, getUnixRangeOfMonth, getYear } from '../util/date';

const useTimeRange = activeD => {
  const [activeDate, setActiveDate] = useState(new Date(activeD));
  const [timeRange, setTimeRange] = useState(
    getUnixRangeOfMonth(getYear(activeDate), getMonth(activeDate)),
  );

  const onDateMove = newDate => {
    setActiveDate(newDate);
    setTimeRange(getUnixRangeOfMonth(getYear(newDate), getMonth(newDate)));
  };

  return { activeDate, timeRange, onDateMove };
};

export default useTimeRange;
