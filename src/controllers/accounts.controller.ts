import { Request, Response } from 'express-serve-static-core';
import * as accountService from '../services/accounts.service';
import {
  incrementTimesBalanceShownToUserToday
} from '../services/functionalLimitsTracker.service'
import { TransactionT } from '../types';
import logger from '../utils/logger';
import { PRISMA_VALIDATION_ERROR, FOREIGN_KEY_CONSTRAINT_FAILED } from '../constants'


// ! TODO: who can create accoun for a user???
// for example, pietia CANNOT create account for vasia!
// some kind of SUPERUSER?
export const createAccount = async (req: Request, res: Response) => {
  const { params: { userId }, query: { accountType = 'dibit' } } = req;
  logger.debug(`Create ${accountType} account for userId ${userId}`);

  try {
    const parsedUserId = parseInt(userId);
    const { accountId } = accountType === 'debit'
      ? await accountService.createDebitAccount(parsedUserId)
      : await accountService.createCreditAccount(parsedUserId);

    res.status(201).json({
      accountId: accountId,
    });
  } catch (e) {
    logger.error(`Failed to createAccount for userId ${userId}`);

    if (
      e instanceof Error && e.message === FOREIGN_KEY_CONSTRAINT_FAILED ||
      e instanceof Error && e.message === PRISMA_VALIDATION_ERROR) {
      res.sendStatus(400);
    }

    // in case of PRISMA_CLIENT_INITIALIZATION_ERROR or anything else
    res.sendStatus(500);
  }
};

export const getAccountBalance = async (req: Request, res: Response) => {
  const { params: { accountId } } = req;
  
  try {
    const parsedAccountId = parseInt(accountId);
    const accountBalance = await accountService.getAccountBalance(parsedAccountId);

    // due to successful retrival increment attempts count
    incrementTimesBalanceShownToUserToday(parsedAccountId);

    res.status(200).json({
      accountBalance: accountBalance
    });
  } catch (e) {
    logger.error(`Failed to getAccoutnBalance with accountId = ${accountId} with error ${e}`);
    res.sendStatus(500);
  }
}

export const getAccountTransactions = async (req: Request, res: Response) => {
  const { params: { accountId } } = req;
  
  try {
    const parsedAccountId = parseInt(accountId);
    const transactions: TransactionT[] = await accountService.getAccountTransactions(parsedAccountId);


    res.status(200).json({
      transactions: transactions
    });
  } catch (e) {
    logger.error(`Failed to getTransactionsHistory with accountId = ${accountId} with error ${e}`);
    res.sendStatus(500);
  }
}

export const depositAmount = async (req: Request, res: Response) => {
  // TODO: implement
  res.status(500).json({
    message: 'Depositing money NOT IMPLEMENTED.'
  });
};

export const withdrawAmount = async (req: Request, res: Response) => {
  // TODO: implement
  res.status(500).json({
    message: 'Withdrawing money NOT IMPLEMENTED.'
  });
};

export const blockAccount = async (req: Request, res: Response) => {
  const { params: { accountId } } = req;

  try {
    const parsedAccountId = parseInt(accountId);
    await accountService.blockAccount(parsedAccountId);

    res.sendStatus(200);
  } catch (e) {
    logger.error(`Failed to block account ${accountId} with error ${e}`);
    res.sendStatus(500);
  }
}

export const activateAccount = async (req: Request, res: Response) => {
  const { params: { accountId } } = req;

  try {
    const parsedAccountId = parseInt(accountId);

    await accountService.activateAccount(parsedAccountId);

    res.sendStatus(200);
  } catch (e) {
    logger.error(`Failed to activate account ${accountId} with error ${e}`);
    res.sendStatus(500);
  }
}
