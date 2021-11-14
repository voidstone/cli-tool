export class PromtErrors {
  exit(message) {
    try {
      throw new CustomError(message);
    } catch (err) {
      console.error(message);
      process.exit(1);
    }
  }
}

export class CustomError extends Error {
  constructor(message) {
    super(message);
  }
}
