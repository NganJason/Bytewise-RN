export const getTotalInvestmentCost = (totalShares = 0, avgCost = 0) => {
  return totalShares * avgCost;
};

export const getStockUpdateTime = (holdings = []) => {
  let stockUpdateTime = 0;

  holdings.map(d => {
    let { quote = { update_time: 0 } } = d;
    if (quote.update_time !== 0) {
      stockUpdateTime = quote.update_time;
      return;
    }
  });

  return stockUpdateTime;
};
