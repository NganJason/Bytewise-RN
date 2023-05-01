import { transactionCollection } from './1_constant';

export const newTransactionRepo = firestoreInstance => {
  const repo = new TransactionRepo(firestoreInstance);
  return repo;
};

class TransactionRepo {
  constructor(firestoreInstance) {
    this.collection = transactionCollection;
    this.fs = firestoreInstance;
  }
}
