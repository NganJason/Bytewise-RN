export class AppError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class UninitializedError extends AppError {
  constructor(message) {
    super(message);
  }
}

export class CategoryError extends AppError {
  constructor(message) {
    super(message);
  }
}
