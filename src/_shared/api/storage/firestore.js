import { getFirestore as getFs } from 'firebase/firestore';

import { UninitializedError } from '../error';

var firestore;

export class Firestore {
  constructor(app) {
    this.db = getFs(app);
  }
}

export const initFirestore = app => {
  if (firestore !== undefined) {
    return;
  }

  firestore = new Firestore(app);
};

export const getFirestore = () => {
  if (firestore === undefined) {
    throw new UninitializedError('firestore uninitialized');
  }
  return firestore;
};
