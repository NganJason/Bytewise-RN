import {
  METRIC_DEBT_RATIO,
  METRIC_INVESTMENT_RATIO,
  METRIC_SAVING_RATIO,
} from '../apis/enum';

export const defaultErrorText1 = 'Ops, something went wrong.';
export const defaultErrorText2 = 'Please try again later.';

export const metricHealthyThreshold = {
  [METRIC_DEBT_RATIO]: val => val <= 50,
  [METRIC_INVESTMENT_RATIO]: val => val >= 50,
  [METRIC_SAVING_RATIO]: val => val >= 20,
};

export const metricMessage = {
  [METRIC_DEBT_RATIO]: `
Debt ratio evaluates your debt level.

Debt Ratio = Total Debt / Total Asset

Recommended range = 50% or less.
  `,
  [METRIC_INVESTMENT_RATIO]: `
Investment ratio shows how much of your assets powers long-term growth.

Investment Ratio = Invested Asset / Net Worth

Recommended range = 50% or more.
`,
  [METRIC_SAVING_RATIO]: `
Savings ratio calculates the amount of income you set aside for savings.

Savings Ratio = Monthly Savings / Monthly Income

Recommended range = 20% or more.
`,
};
