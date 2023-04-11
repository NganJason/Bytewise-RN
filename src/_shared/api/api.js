import { budgetOverviewData } from './data/mock/budget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOCALSTORAGEKEY } from './constant';

var globalDao;

export const getGlobalDao = () => {
  if (globalDao === undefined) {
    initGlobalDao();
  }

  return globalDao;
};

const initGlobalDao = () => {
  if (globalDao !== undefined) {
    return;
  }

  globalDao = new localStorage();
};

class localStorage {
  constructor() {}

  async getBudgetOverview() {
    try {
      const value = await AsyncStorage.getItem(LOCALSTORAGEKEY.budgets);
      if (value !== null) {
        console.log(value);
      }
      // TODO: REMOVE IN PROD
      // USED TO MOCK SLOW LOAD TO SEE LOADING SCREEN
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(error);
    }

    return new Promise((resolve, _) => {
      resolve(budgetOverviewData);
    });
  }

  async createCategory(req) {}
}
