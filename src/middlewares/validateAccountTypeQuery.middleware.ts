import { Request, Response, NextFunction } from 'express-serve-static-core';
import { accountTypeSchema } from '../models/validation';

const validateAccountTypeQuery = (req: Request, res: Response, next: NextFunction) => {
  const { query: { accountType } } = req;

  const { error: accountTypeError } = accountTypeSchema.safeParse(accountType);

  if (accountTypeError !== undefined) {
    // throw new ValidationException();
    throw new Error();
  }

  next();
}

export default validateAccountTypeQuery;
