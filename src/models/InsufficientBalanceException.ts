import BaseException, { DetailsT } from './BaseException';

class InsufficientBalanceException extends BaseException {
  name = 'InsufficientBalanceException';

  constructor(message: string, priorErrorStack: string | null, details: DetailsT | null) {
    super(message, priorErrorStack, details);
  }
}

export default InsufficientBalanceException;
