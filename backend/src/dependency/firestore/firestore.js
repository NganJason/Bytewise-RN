import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  addDoc,
  getDocs,
  collection,
  doc,
  runTransaction,
} from 'firebase/firestore';
import { firebaseConfig } from '../../common/config';

import { AppError, UninitializedError } from '../../util/error';

var firestore;

export const initGlobalFirestore = () => {
  if (firestore !== undefined) {
    return;
  }

  const app = initializeApp(firebaseConfig);
  firestore = new Firestore(getFirestore(app));
};

export const getGlobalFirestore = () => {
  if (firestore === undefined) {
    throw new UninitializedError('firestore uninitialized');
  }
  return firestore;
};

class FirestoreError extends AppError {
  constructor(message) {
    super(message);
  }
}

class Firestore {
  // Init Firestore with a Firestore instance
  constructor(db) {
    this.db = db;
  }

  // Create a Firestore transaction instance
  async withTx(fn) {
    try {
      await runTransaction(this.db, async tx => {
        const fsTx = new FirestoreTx(this.db, tx);
        await fn(fsTx);
      });
    } catch (err) {
      throw new FirestoreError(err.message);
    }
  }

  async insertOne(data = {}, path = '', subPath = []) {
    try {
      const docRef = await addDoc(collection(this.db, path, ...subPath), data);
      return docRef.id;
    } catch (err) {
      throw new FirestoreError(err.message);
    }
  }

  async getMany(path = '', subPath = []) {
    try {
      const data = [];
      const snapshot = await getDocs(collection(this.db, path, ...subPath));
      snapshot.forEach(d => {
        data.push(d);
      });
      return data;
    } catch (err) {
      throw new FirestoreError(err.message);
    }
  }
}

class FirestoreTx extends Firestore {
  constructor(db, tx) {
    super(db);
    this.tx = tx;
  }

  async insertOne(data = {}, path = '', subPath = []) {
    try {
      await this.tx.set(doc(collection(this.db, path, ...subPath)), data);
    } catch (err) {
      throw new FirestoreError(err.message);
    }
  }
}
