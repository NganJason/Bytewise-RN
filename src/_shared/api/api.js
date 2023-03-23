import { budgetOverviewData } from './data/mock/budget_overview';
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
    } catch (error) {
      console.log(error);
    }

    return new Promise((resolve, _) => {
      resolve(budgetOverviewData);
    });
  }

  async createCategory(req) {}
}
