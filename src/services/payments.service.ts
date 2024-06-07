import prismaClient from './prismaClient.service';
import prismaDBService from './db';
import Decimal from "decimal.js"; 
import { isDebitAccount } from '../services/accounts.service';
import { INSUFFICIENT_AMOUNT_ON_ACCOUNT_ERROR } from '../constants';
import logger from '../utils/logger';

/**
 * Crrent support: DEBIT ACCOUNTS ONLY
 * 
 * TEST CASES:
 * 1. transaction on blocked account:: expect db error
 * 2. transaction on credit account:: expect Error('Only debit accounts currently supported')
 * 3. source exists, destination does not exist:: expect Error
 * 4. source does not exist, destination exists:: expect Error
 * 5. source exists but doesn't have enough money:: expect Error
 * 6. source and has sufficient amount, destination exists, both are active:: SUCCESS
 */
export const makePayment = async (sourceAccountId: string, destinationAccountId: string, amount: string) => {
  const parsedSource = parseInt(sourceAccountId);
  const parsedDestination = parseInt(destinationAccountId);
  const decimalAmount = new Decimal(parseFloat(amount));

  try {
    // TRANSACTION BEGIN
    await prismaClient.$transaction(async (prisma) => {

      const { account_type: sourceAccountType, balance: sourceBalance } = await prismaDBService.findAccountByIdOrThrow(parsedSource);
      const { balance: destinationBalance } = await prismaDBService.findAccountByIdOrThrow(parsedDestination);

      if (isDebitAccount(sourceAccountType)) {
        const err = new Error(`Only debit accounts payments are currently supported,
        but got CREDIT ACCOUNT of id: ${parsedSource}`);
        logger.error(`Error while making payment. Error: ${err}`);
        throw err;
      }

      const newSourceBalance = new Decimal(sourceBalance).sub(decimalAmount);
      const newDestinationBalance = new Decimal(destinationBalance).add(decimalAmount);

      // check if balance has required amount
      if (newSourceBalance.lessThan(0)){
        const error = new Error(INSUFFICIENT_AMOUNT_ON_ACCOUNT_ERROR);
        logger.info(`Transaction failed due to error: ${JSON.stringify(error)}.
        Insufficient amount on account with id: ${parsedSource}`);
        throw error;
      }

      await prismaDBService.updateAccountBalance(parsedSource, newSourceBalance);
      await prismaDBService.updateAccountBalance(parsedDestination, newDestinationBalance);

      // record transaction
      await prismaDBService.createTransaction(parsedSource, parsedDestination, decimalAmount);
    });
    // TRANSACTION END;
  } catch (e) {
    console.error(`Transaction failed with error: ${e}`);
    throw e;
  }
}
