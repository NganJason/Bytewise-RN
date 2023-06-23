import { paper, sapiens1, sapiens2 } from './asset';

export const MONTHS = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};

export const MONTHS_VALUE = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
};

export const DAYS = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
};

export const EQUITY_TYPE = {
  asset: 1,
  debt: 2,
};

export const EmptyContentConfig = {
  monthlyBudget: {
    text: 'No monthly budget yet',
    image: sapiens2,
  },
  annualBudget: {
    text: 'No annual budget yet',
    image: sapiens1,
  },
  category: {
    text: 'No category yet',
    image: paper,
  },
  transaction: {
    text: 'No transaction yet',
    image: paper,
  },
};
