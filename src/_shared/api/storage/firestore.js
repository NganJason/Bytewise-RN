import { getFirestore, addDoc, collection } from 'firebase/firestore';

import { AppError, UninitializedError } from '../error';

var firestore;

class FirestoreError extends AppError {
  constructor(message) {
    super(message);
  }
}

class Firestore {
  constructor(app) {
    this.db = getFirestore(app);
  }

  async addDoc(collectionName = '', doc = {}) {
    try {
      await addDoc(collection(this.db, collectionName), doc);
    } catch (err) {
      throw new FirestoreError(err.message);
    }
  }
}

export const initFs = app => {
  if (firestore !== undefined) {
    return;
  }
  firestore = new Firestore(app);
};

export const getFs = () => {
  if (firestore === undefined) {
    throw new UninitializedError('firestore uninitialized');
  }
  return firestore;
};

export const addFsDoc = async (collectionName = '', doc = {}) => {
  await firestore.addDoc(collectionName, doc);
};
