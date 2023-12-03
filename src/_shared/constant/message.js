import {
  METRIC_DEBT_RATIO,
  METRIC_INVESTMENT_RATIO,
  METRIC_SAVING_RATIO,
} from '../apis/enum';

export const defaultErrorText1 = 'Ops, something went wrong.';
export const defaultErrorText2 = 'Please try again later.';

export const metricMessage = {
  [METRIC_DEBT_RATIO]: threshold => `
Debt ratio evaluates your debt level.

Debt Ratio = Total Debt / Total Asset

Recommended range = ${threshold}.
  `,
  [METRIC_INVESTMENT_RATIO]: threshold => `
Investment ratio shows how much of your assets powers long-term growth.

Investment Ratio = Invested Asset / Net Worth

Recommended range = ${threshold}.
`,
  [METRIC_SAVING_RATIO]: threshold => `
Savings ratio calculates the amount of income you set aside for savings.

Savings Ratio = Monthly Savings / Monthly Income

Recommended range = ${threshold}.
`,
};
