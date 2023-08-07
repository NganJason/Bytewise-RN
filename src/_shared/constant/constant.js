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

export const TIME_RANGE_MONTHLY = 1;
export const TIME_RANGE_YEARLY = 2;

export const TIME_RANGE_TYPES = {
  [TIME_RANGE_MONTHLY]: 'Monthly',
  [TIME_RANGE_YEARLY]: 'Yearly',
};

export const EmptyContentConfig = {
  monthlyBudget: {
    text: ['Plan your budget for the month'],
    image: sapiens2,
  },
  annualBudget: {
    text: ['Allocate budget for annual expenses'],
    image: sapiens1,
  },
  category: {
    text: ['Category groups and ', 'tracks your transactions'],
    image: paper,
  },
  categoryOverview: {
    text: ['No category yet'],
    image: paper,
  },
  transaction: {
    text: ['Your everyday transactions'],
    image: paper,
  },
  investment: {
    text: ['No holding yet'],
    image: paper,
  },
  unit: {
    text: ['No unit yet'],
    image: paper,
  },
  account: {
    text: ['No account yet'],
    image: paper,
  },
  asset: {
    text: ['Your asset accounts'],
    image: paper,
  },
  debt: {
    text: ['Your outstanding liabilities'],
    image: paper,
  },
  noSearchDataFound: {
    text: ['No data found'],
    image: paper,
  },
  emptySearchText: {
    text: ['Type something to search'],
    image: sapiens1,
  },
};

export const DonutChartColors = [
  '#2D4356',
  '#FFC6AC',
  '#5B9A8B',
  '#BA704F',
  '#FFD89C',
  '#E57C23',
  '#F99B7D',
];
