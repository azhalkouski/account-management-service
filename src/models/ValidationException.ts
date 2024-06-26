import BaseException, { DetailsT } from './BaseException';

class ValidationException extends BaseException {
  name = 'ValidationException';

  constructor(message: string, priorErrorStack: string | null, details: DetailsT | null) {
    super(message, priorErrorStack, details);
  }
}

export default ValidationException;
