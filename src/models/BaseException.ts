class BaseException extends Error {
  name = 'BaseException';
  statusCode = 500;
  stack: string;
  details?: string;

  constructor(stack: string, details?: string) {
    // I need to call super() to ensure the prototype chain is correctly established.
    // This allows instances of my custom error class to be recognized as
    // instances of Error.
    // Also, the the Error class has its own properties, such as message, name, and
    // stack, which need to be initialized
    super();
    this.message = `This is a base exception message. You should override this in your subclass.`;
    this.stack = stack;
    this.details = details;
  }
}

export default BaseException;
