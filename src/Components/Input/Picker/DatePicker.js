import Picker from './Picker';
import { MONTHS } from '../../../_shared/constant/constant';
import {
  getDate,
  getDaysInMonth,
  getMonth,
  getYear,
} from '../../../_shared/util';
import { useState } from 'react';

export const DatePickerMode = {
  Year: 0,
  YearMonth: 1,
  Date: 2,
};

const DatePicker = ({
  mode = DatePickerMode.Date,
  startingDate = new Date(),
  onChange = function () {},
}) => {
  const [selectedDate, setSelectedDate] = useState(startingDate);

  const onChangeHandler = newDate => {
    setSelectedDate(newDate);
    onChange(newDate);
  };

  const getPickers = () => {
    let pickers = [];
    for (let i = mode; i >= 0; i--) {
      switch (i) {
        case DatePickerMode.Date:
          pickers.push(getDatePicker(selectedDate, onChangeHandler));
          break;
        case DatePickerMode.YearMonth:
          pickers.push(getMonthPicker(selectedDate, onChangeHandler));
          break;
        case DatePickerMode.Year:
          pickers.push(getYearPicker(selectedDate, onChangeHandler));
          break;
        default:
          continue;
      }
    }
    return pickers;
  };

  return <Picker pickers={getPickers()} />;
};

export default DatePicker;

const getMonthPicker = (
  selectedDate = new Date(),
  onSelect = function () {},
) => {
  let items = [];

  Object.keys(MONTHS).forEach(num => {
    const string = MONTHS[num];
    items.push({ label: string, value: Number(num) });
  });

  return {
    items: items,
    selectedValue: getMonth(selectedDate),
    onChange: function (e) {
      let newDate = new Date(
        getYear(selectedDate),
        e - 1,
        getDate(selectedDate),
      );
      onSelect(newDate);
    },
  };
};

const getYearPicker = (
  selectedDate = new Date(),
  onSelect = function () {},
) => {
  let items = [];
  let futureYears = getYearList();

  futureYears.map(year => {
    items.push({ label: String(year), value: year });
  });

  return {
    items: items,
    selectedValue: getYear(selectedDate),
    onChange: function (e) {
      let newDate = new Date(
        e,
        getMonth(selectedDate) - 1,
        getDate(selectedDate),
      );
      onSelect(newDate);
    },
  };
};

const getDatePicker = (
  selectedDate = new Date(),
  onSelect = function () {},
) => {
  let year = getYear(selectedDate);
  let month = getMonth(selectedDate);

  let items = [];
  let days = getDaysInMonth(year, month);

  days.map(day => {
    items.push({ label: String(day), value: day });
  });

  return {
    items: items,
    selectedValue: getDate(selectedDate),
    onChange: function (e) {
      let newDate = new Date(
        getYear(selectedDate),
        getMonth(selectedDate) - 1,
        e,
      );
      onSelect(newDate);
    },
  };
};

const getYearList = () => {
  let start = 1950;
  let end = 2050;
  let years = [];

  for (let i = start; i <= end; i++) {
    years.push(i);
  }
  return years;
};
