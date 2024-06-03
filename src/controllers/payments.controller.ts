import { Request, Response } from "express-serve-static-core";
import * as paymentsService from '../services/payments.service';

export const handleMakePayment = async (req: Request, res: Response) => {
  // TODO: implement
  const { body: { sourceAccountId, destinationAccountId, amount } } = req;

  await paymentsService.makePayment(sourceAccountId, destinationAccountId, amount);

  // try/catch

}
