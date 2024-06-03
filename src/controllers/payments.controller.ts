import { Request, Response } from "express-serve-static-core";
import * as paymentsService from '../services/payments.service';

export const handleMakePayment = async (req: Request, res: Response) => {
  const { body: { sourceAccountId, destinationAccountId, amount } } = req;

  try {
    await paymentsService.makePayment(sourceAccountId, destinationAccountId, amount);

    res.sendStatus(200);
  } catch (e) {
    console.error(`Failed to make transaction for sourceAccId: ${sourceAccountId}
    destinationAccId: ${destinationAccountId} amount: ${amount} with error ${e}`);

    // TODO: winston
    res.sendStatus(500);
  }
}
