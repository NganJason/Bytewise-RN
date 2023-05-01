import { userCollection } from './1_constant';

export const newUserRepo = firestoreInstance => {
  const repo = new UserRepo(firestoreInstance);
  return repo;
};

class UserRepo {
  constructor(firestoreInstance) {
    this.collection = userCollection;
    this.fs = firestoreInstance;
  }
}
