import { getGlobalFirestore } from './src/dependency/firestore/firestore';
import { initDependencies } from './src/dependency/init';
import {
  initGlobalRegistry,
  newUserRepo,
  newCategoryRepo,
  newBudgetRepo,
  newTransactionRepo,
} from './src/repository';

export const initBackend = () => {
  initDependencies();

  initGlobalRegistry()
    .setUserRepo(newUserRepo(getGlobalFirestore()))
    .setCategoryRepo(newCategoryRepo(getGlobalFirestore()))
    .setBudgetRepo(newBudgetRepo(getGlobalFirestore()))
    .setTransactionRepo(newTransactionRepo(getGlobalFirestore()));
};
