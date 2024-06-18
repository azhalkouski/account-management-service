import BaseException from "./BaseException";

class DatabaseException extends BaseException {
  name = 'DatabaseException';
  message = "Exception occured at the database level."

  constructor(message: string, priorErrorStack: string, details?: string) {
    super(message, priorErrorStack, details);
    this.message = message;
  }
}

export default DatabaseException;
