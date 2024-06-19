import BaseException, { DetailsT } from "./BaseException";

class DatabaseException extends BaseException {
  name = 'DatabaseException';

  constructor(message: string, priorErrorStack: string | null, details: DetailsT | null) {
    super(message, priorErrorStack, details);
    this.message = message;
  }
}

export default DatabaseException;
