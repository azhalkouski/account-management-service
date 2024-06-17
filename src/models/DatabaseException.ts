import BaseException from "./BaseException";

class DatabaseException extends BaseException {
  name = 'DatabaseException';
  message = "Exception occured at the database level."

  constructor(message: string, stack: string) {
    super(stack);
    this.message = message;
  }
}

export default DatabaseException;
