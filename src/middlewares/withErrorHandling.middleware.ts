import { MiddlewareFunctionT } from '../types';


/**
 * This middleware has only one responsibility:
 * Catch err in async code. Pass it to the Express error middleware.
 * 
 * Logging is done in the the Express error middleware.
 */
const withErrorHandling = (asyncFn: MiddlewareFunctionT): MiddlewareFunctionT =>
  (req, res, next) => {
  Promise.resolve(asyncFn(req, res, next)).catch((e) => {
    next(e);
  })
};

export default withErrorHandling;
