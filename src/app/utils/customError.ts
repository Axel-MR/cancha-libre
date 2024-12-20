// utils/customError.ts

export class CustomError extends Error {
    code: string;
  
    constructor(message: string, code: string) {
      super(message);
      this.name = this.constructor.name;
      this.code = code;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  