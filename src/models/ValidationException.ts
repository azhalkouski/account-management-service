import BaseException from './BaseException';

class ValidationException extends BaseException {
  name = 'ValidationException';

  constructor(message: string) {
    super(message);
  }
}

export default ValidationException;
