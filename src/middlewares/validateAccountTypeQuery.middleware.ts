import { Request, Response, NextFunction } from 'express-serve-static-core';
import { accountTypeSchema } from '../models/validation';
import ValidationException from '../models/ValidationException';

const INVALID_ACCOUNT_TYPE = 'Invalid account type from req.query';

const validateAccountTypeQuery = (req: Request, res: Response, next: NextFunction) => {
  const { query: { accountType } } = req;

  const { error: accountTypeError } = accountTypeSchema.safeParse(accountType);

  if (accountTypeError !== undefined) {
    throw new ValidationException(INVALID_ACCOUNT_TYPE);
  }

}

export default validateAccountTypeQuery;
