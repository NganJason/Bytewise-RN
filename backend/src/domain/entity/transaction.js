export const newTransaction = (
  transaction_id,
  cat_id,
  acc_id,
  transaction_type,
  note,
  currency,
  amount,
  created_at_ms,
) => {
  return new Transaction(
    transaction_id,
    cat_id,
    acc_id,
    transaction_type,
    note,
    currency,
    amount,
    created_at_ms,
  );
};

class Transaction {
  constructor(
    transaction_id,
    cat_id,
    acc_id,
    transaction_type,
    note,
    currency,
    amount,
    created_at_ms,
  ) {
    this.transaction_id = transaction_id;
    this.cat_id = cat_id;
    this.acc_id = acc_id;
    this.transaction_type = transaction_type;
    this.note = note;
    this.currency = currency;
    this.amount = amount;
    this.created_at_ms = created_at_ms;
  }
}
