import { Request, Response } from "express-serve-static-core";
import * as paymentsService from '../services/payments.service';
import logger from '../utils/logger';

export const handleMakePayment = async (req: Request, res: Response) => {
  const { body: { sourceAccountId, destinationAccountId, amount } } = req;

  try {
    await paymentsService.makePayment(sourceAccountId, destinationAccountId, amount);

    res.sendStatus(200);
  } catch (e) {
    logger.error(`Failed to make transaction for sourceAccId: ${sourceAccountId}
    destinationAccId: ${destinationAccountId} amount: ${amount} with error ${e}`);

    res.sendStatus(500);
  }
}
