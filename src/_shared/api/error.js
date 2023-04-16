export class AppError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message);
  }
}

export class UninitializedError extends AppError {
  constructor(message) {
    super(message);
  }
}

export class ServerError extends AppError {
  constructor(message) {
    super(message);
  }
}
