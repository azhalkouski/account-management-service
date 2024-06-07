import prismaDBService from './db/prismaDB.service';
import Decimal from "decimal.js"; 

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

  await prismaDBService.doMoneyTransferTransaction(parsedSource, parsedDestination, decimalAmount);
}
