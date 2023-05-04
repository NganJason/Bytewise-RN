export const EQUITY = {
  total: 3500,
  currency: 'SGD',
  asset: {
    total: 5000,
    currency: 'SGD',
    cash: {
      amount: 1000,
      currency: 'SGD',
    },
    investment: {
      amount: 4000,
      currency: 'SGD',
    },
  },
  debt: {
    total: 1500,
    currency: 'SGD',
    breakdown: [
      {
        debt_name: 'Student Loan',
        amount: 1000,
        currency: 'SGD',
      },
      {
        debt_name: 'Mortgage',
        amount: 500,
        currency: 'SGD',
      },
    ],
  },
};
