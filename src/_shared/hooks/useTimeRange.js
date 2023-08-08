import { useEffect, useState } from 'react';
import { TIME_RANGE_MONTHLY, TIME_RANGE_YEARLY } from '../constant/constant';
import {
  getMonth,
  getUnixRangeOfMonth,
  getUnixRangeOfYear,
  getYear,
} from '../util/date';

const useTimeRange = (activeTs = 0, rangeType = TIME_RANGE_MONTHLY) => {
  const [timeRangeType, setTimeRangeType] = useState(rangeType);

  const [activeDate, setActiveDate] = useState(new Date(activeTs));
  const [timeRange, setTimeRange] = useState(
    getTimeRange(activeDate, timeRangeType),
  );

  const onDateMove = newDate => {
    setActiveDate(newDate);
  };

  useEffect(() => {
    setTimeRange(getTimeRange(activeDate, timeRangeType));
  }, [activeDate, timeRangeType]);

  return { activeDate, timeRange, onDateMove, timeRangeType, setTimeRangeType };
};

const getTimeRange = (
  date = new Date(),
  timeRangeType = TIME_RANGE_MONTHLY,
) => {
  if (timeRangeType === TIME_RANGE_YEARLY) {
    return getUnixRangeOfYear(getYear(date));
  }
  return getUnixRangeOfMonth(getYear(date), getMonth(date));
};

export default useTimeRange;
