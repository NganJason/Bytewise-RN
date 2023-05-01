import { initGlobalFirestore } from './firestore/firestore';

export const initDependencies = () => {
  initGlobalFirestore();
};
