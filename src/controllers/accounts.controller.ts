import { Request, Response } from 'express-serve-static-core';
import { findUserByUserId } from '../services/users.service';
import { createCreditAccount, createDebitAccount } from '../services/accounts.service';


export const createAccount = async (req: Request, res: Response) => {
  const { params: { userId }, query: { accountType = 'dibit' } } = req;
  console.log('userId', userId);

  try {
    // check if user with userId exists
    const parsedUserId = parseInt(userId);
    const user = findUserByUserId(parsedUserId);

    if (!user) {
      console.log(`Attempt to create an account for non existent user.
        Provided userId: ${userId}`);

      return res.sendStatus(400);
    }
  
    // create account for userId
    const account = accountType === 'debit'
      ? await createDebitAccount(parsedUserId)
      : await createCreditAccount(parsedUserId);

      console.log('account', account);

    res.sendStatus(201);
  } catch (e) {
    console.error(e);
    // TODO: winston.log(e)
    // TODO: next(e)
    res.sendStatus(500);
  }
};
