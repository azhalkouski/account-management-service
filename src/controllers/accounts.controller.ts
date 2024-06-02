import { Request, Response } from 'express-serve-static-core';
import { findUserByUserId } from '../services/users.service';
import * as accountService from '../services/accounts.service';


// ! TODO: who can create accoun for a user???
// for example, pietia CANNOT create account for vasia!
// some kind of SUPERUSER?
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
      ? await accountService.createDebitAccount(parsedUserId)
      : await accountService.createCreditAccount(parsedUserId);

      console.log('account', account);

    res.sendStatus(201);
  } catch (e) {
    console.error(e);
    // TODO: winston.log(e)
    // TODO: next(e)
    res.sendStatus(500);
  }
};

export const getAccountBalance = async (req: Request, res: Response) => {
  console.log('accounts.controller::getAccountBalance');
  const { params: { id } } = req;
  
  try {
    const parsedId = parseInt(id);
    const accountBalance: number = await accountService.getAccountBalance(parsedId);


    // TODO: accountService.getAccountBalance(accountId)
    // write to file ONLY IF SUCCESS getAccountBalance - fair deal
    // TODO: fs.writeFile - async
    // userActivityTracker.incrementBalanceShownCountForUser(userId)

    res.status(200).json({
      accountBalance: accountBalance
    });
  } catch (e) {
    console.log(`Failed to getAccoutnBalance with accountId = ${id}`)
    res.sendStatus(500);
  }
}

export const blockAccount = (req: Request, res: Response) => {
  console.log('accounts.controller::blockAccount');

  try {
    // TODO: accountService.blockAccount(accountId)
    /**
     * Это должно быть на уровне схемы базы данных
     * Добавить констрейнт на аккаунт: документ нельзя апдэйтить
    // TRIGGER
    // if active = false
    // RAISE EXCEPTION 'Update not allowed on blocked accont'
     */
  } catch (e) {
    res.sendStatus(500);
  }
}

export const activateAccount = (req: Request, res: Response) => {
  console.log('accounts.controller::activateAccount');

  try {
    // TODO: accountService.activateAccount(accountId)
  } catch (e) {
    res.sendStatus(500);
  }
}
