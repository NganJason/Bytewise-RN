import { tsToDateTimeStr } from '../util';

export const genStockUpdateTimeMsg = updateTime => {
  let formattedTime = 'NA';
  if (updateTime !== 0) {
    formattedTime = tsToDateTimeStr(updateTime);
  }
  return `Stock market info is updated every 30 minutes.\n\nLast updated at: ${formattedTime}`;
};

export const toolTipMessage = {
  annualBudgetDesc: {
    title: 'Annual Budget',
    text: 'Budget allocated for the whole year.\n\nEg: Travel, Beauty & Self-Care.',
  },
  symbolDesc: {
    title: 'Symbol',
    text: 'The latest market price of your symbols will be tracked and updated everynight at\n\n00:00 AM (UTC +08:00).',
  },
  customSymbolDesc: {
    title: 'Custom Symbol',
    text: 'Symbols or holdings that are currently not supported by us.\n\nMarket prices have to be tracked manually.',
  },
  totalLatestMarketValueDesc: {
    title: 'Latest Total Market Value',
    text: 'The latest market value of your holding.',
  },
  totalInvestedAmount: {
    title: 'Total Invested Amount',
    text: 'The total cost that you have invested into this holding.',
  },
  cashFlowDesc: {
    title: 'Cash Flow',
    text: 'Cash flow = Income - Expense',
  },
};

export const defaultErrorText1 = 'Ops, something went wrong.';
export const defaultErrorText2 = 'Please try again later.';
