export const genStockUpdateTimeMsg = dateTimeStr => {
  return `Stock market info is updated every 30 minutes.\n\nLast updated at: ${dateTimeStr}`;
};

export const toolTipMessage = {
  annualBudgetDesc: {
    title: 'Annual Budget',
    message:
      'Budget allocated for the whole year.\n\nEg: Travel, Beauty & Self-Care.',
  },
  symbolDesc: {
    title: 'Symbol',
    message:
      'The latest market price of your symbols will be tracked and updated everynight at\n\n00:00 AM (UTC +08:00).',
  },
  customSymbolDesc: {
    title: 'Custom Symbol',
    message:
      'Symbols or holdings that are currently not supported by us.\n\nMarket prices have to be tracked manually.',
  },
  totalLatestMarketValueDesc: {
    title: 'Latest Total Market Value',
    message: 'The latest market value of your holding.',
  },
  totalInvestedAmount: {
    title: 'Total Invested Amount',
    message: 'The total cost that you have invested into this holding.',
  },
  cashFlowDesc: {
    title: 'Cash Flow',
    message: 'Cash flow = Income - Expense',
  },
};

export const defaultErrorText1 = 'Ops, something went wrong.';
export const defaultErrorText2 = 'Please try again later.';
