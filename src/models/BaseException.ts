class BaseException extends Error {
  name = 'BaseException';
  message = `This is a base exception message. You should override this in your subclass.`;
  statusCode = 500;
  priorErrorStack?: string;
  details?: string;

  constructor(message:string, priorErrorStack?: string, details?: string) {
    // I need to call super() to ensure the prototype chain is correctly established.
    // This allows instances of my custom error class to be recognized as
    // instances of Error.
    // Also, the the Error class has its own properties, such as message, name, and
    // stack, which need to be initialized
    super();
    this.message = message;
    this.priorErrorStack = priorErrorStack;
    this.details = details;

    Error.captureStackTrace(this);
  }
}

export default BaseException;
