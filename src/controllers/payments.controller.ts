import { Request, Response } from "express-serve-static-core";
import * as paymentsService from '../services/payments.service';
import logger from '../utils/logger';

export const handleMakePayment = async (req: Request, res: Response) => {
  const { body: { sourceAccountId, destinationAccountId, amount } } = req;

  try {
    await paymentsService.makePayment(sourceAccountId, destinationAccountId, amount);

    res.sendStatus(200);
  } catch (e) {
    const stringError = JSON.stringify(e);
    logger.error(`Failed to make transaction for sourceAccId: ${sourceAccountId}
    destinationAccId: ${destinationAccountId} amount: ${amount}
    with error ${stringError}`);

    // for transactions don't expose any details
    res.sendStatus(500);
  }
}
