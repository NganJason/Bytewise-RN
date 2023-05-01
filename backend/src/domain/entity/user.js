export const newUser = device_id => {
  return new User(device_id);
};

class User {
  constructor(device_id) {
    this.device_id = device_id;
  }
}
