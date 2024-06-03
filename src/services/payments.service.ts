import { PrismaClient } from '@prisma/client';
import Decimal from "decimal.js"; 
import { isDebitAccount } from '../services/accounts.service';

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
  const prisma = new PrismaClient();

  const parsedSource = parseInt(sourceAccountId);
  const parsedDestination = parseInt(destinationAccountId);
  const decimalAmount = new Decimal(parseFloat(amount));

  const { account_type: sourceAccoutType } = await prisma.account.findFirstOrThrow({
    where: {
      id: parsedSource
    },
    select: {
      account_type: true
    }
  })


  if (isDebitAccount(sourceAccoutType)) {
    throw new Error(`Only debit accounts currently supported, but got CREDIT ACCOUNT
    of id: ${parsedSource}`);
  }

  try {
    // TRANSACTION BEGIN
    await prisma.$transaction(async (prisma) => {


      const { balance: sourceBalance } = await prisma.account.findFirstOrThrow({
        where: { id: parsedSource },
        select: { balance: true }
      });
      const { balance: destinationBalance } = await prisma.account.findFirstOrThrow({
        where: { id: parsedDestination },
        select: { balance: true }
      });
      console.log('OLD sourceBalance', sourceBalance);
      console.log('OLD destinationBalance', destinationBalance);

      const newSourceBalance = new Decimal(sourceBalance).sub(decimalAmount);
      const newDestinationBalance = new Decimal(destinationBalance).add(decimalAmount);

      // check if balance has required amount
      if (newSourceBalance.lessThan(0)){
        throw new Error(`Insufficient amount on account with id: ${parsedSource}`);
      }

      // update source and destination balance
      const { balance: updatedSourceBalance } = await prisma.account.update({
        where: { id: parsedSource },
        data: { balance: newSourceBalance }
      });
      const { balance: updatedDestinationBalance } = await prisma.account.update({
        where: { id: parsedDestination },
        data: { balance: newDestinationBalance }
      });
      console.log('NEW sourceBalance', updatedSourceBalance);
      console.log('NEW destinationBalance', updatedDestinationBalance);
  
      // create transaction
      const transaction = await prisma.transaction.create({
        data: {
          from: parsedSource,
          to: parsedDestination,
          value: decimalAmount,
          accounts: {
            connect: [{ id: parsedSource }, { id: parsedDestination }]
          }
        }
      });
      console.log('transaction', transaction);
    });
    // TRANSACTION END;
  } catch (e) {
    console.error(`Transaction failed with error: ${e}`);
    throw e;
  }
}
