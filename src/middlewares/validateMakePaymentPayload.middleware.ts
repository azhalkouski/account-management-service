import { Request, Response, NextFunction } from 'express-serve-static-core';
import {
  MAKE_TRANSACTION_ERROR_TYPE,
  ACCOUNT_ID_NOT_VALID,
  MONEY_AMOUNT_NOT_VALID
} from '../constants';
import { accountIdSchema, unsignedMoneyAmountSchema } from '../models/validation';
import ValidationException from '../models/ValidationException';

const validateMakePaymentPayload = (req: Request, res:Response, next: NextFunction) => {
  const { body: { sourceAccountId, destinationAccountId, amount } } = req;

  const parsedSourceAccountId = parseInt(sourceAccountId);
  const parsedDestinationAccountId = parseInt(destinationAccountId);
  // no parseFloat for amount because unsignedMoneyAmountSchema relies on regexp test
  // and thus expects string as input argument

  const { error: sourceAccountIdError } = accountIdSchema.safeParse(parsedSourceAccountId);
  const { error: destinationAccountIdError } = accountIdSchema.safeParse(parsedDestinationAccountId);
  const { error: amountError } = unsignedMoneyAmountSchema.safeParse(amount);

  if (sourceAccountIdError || destinationAccountIdError) {
    throw new ValidationException(`${MAKE_TRANSACTION_ERROR_TYPE} - ${ACCOUNT_ID_NOT_VALID}`);
  }

  if (amountError) {
    throw new ValidationException(`${MAKE_TRANSACTION_ERROR_TYPE} - ${MONEY_AMOUNT_NOT_VALID}`);
  }

  next();
}

export default validateMakePaymentPayload;
