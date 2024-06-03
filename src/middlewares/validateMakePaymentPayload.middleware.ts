import { Request, Response, NextFunction } from 'express-serve-static-core';

const validateMakePaymentPayload = (req: Request, res:Response, next: NextFunction) => {
  const { body: { sourceAccountId, destinationAccountId, amount } } = req;

  console.log(sourceAccountId, destinationAccountId, amount);

  next();
}

export default validateMakePaymentPayload;
