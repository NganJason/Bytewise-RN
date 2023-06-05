export const groupTransactionsByDate = (transactions = []) => {
  const transactionGroups = {};
  const transactionTimes = [];

  transactions.forEach(t => {
    // group by date
    const tt = new Date(t.transaction_time).setHours(0, 0, 0, 0);
    if (!(tt in transactionGroups)) {
      transactionTimes.push(tt);
    }
    transactionGroups[tt] = [...(transactionGroups[tt] || []), t];
  });
  transactionTimes.sort().reverse();

  return { transactionTimes, transactionGroups };
};
