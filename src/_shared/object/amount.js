import { DEFAULT_CURRENCY } from '../util';

class Amount {
  constructor(amount = 0, currency = DEFAULT_CURRENCY) {
    this.amount = Number(amount);
    this.currency = currency;
  }

  getAmount = () => {
    return Number(this.amount.toFixed(2));
  };

  getCurrency = () => {
    return this.currency;
  };
}

export default Amount;
