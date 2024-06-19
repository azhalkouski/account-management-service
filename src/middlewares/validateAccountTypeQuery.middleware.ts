import { Request, Response, NextFunction } from 'express-serve-static-core';
import { accountTypeSchema } from '../models/validation';
import ValidationException from '../models/ValidationException';
import { INVALID_ACCOUNT_TYPE } from '../constants'

const validateAccountTypeQuery = (req: Request, res: Response, next: NextFunction) => {
  const { query: { accountType } } = req;

  const { error: accountTypeError } = accountTypeSchema.safeParse(accountType);

  if (accountTypeError !== undefined) {
    throw new ValidationException(INVALID_ACCOUNT_TYPE, null, null);
  }

}

export default validateAccountTypeQuery;
