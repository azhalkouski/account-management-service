import { Request, Response, ParamsDictionary, Query } from 'express-serve-static-core';
import * as accountService from '../services/accounts.service';
import {
  incrementTimesBalanceShownToUserToday
} from '../services/functionalLimitsTracker.service'
import { TransactionT, CreateAccountReqParams, CreateAccountReqQuery } from '../types';
import logger from '../utils/logger';
import { PRISMA_VALIDATION_ERROR, FOREIGN_KEY_CONSTRAINT_FAILED } from '../constants'

type CreateAccountRequestParams = ParamsDictionary & CreateAccountReqParams;
type CreateAccountRequestQuery = Query & CreateAccountReqQuery;


export const createAccount = async (req: Request, res: Response) => {
  const { userId } = req.params as CreateAccountRequestParams;
  const { accountType } = req.query as CreateAccountRequestQuery;
  logger.debug(`Create ${accountType} account for userId ${userId}`);
  logger.debug(`Typeof accountType ${typeof accountType}; typeof userId ${typeof userId}`);

  try {
    const validatedAccountType = accountType;
    const accountId = await accountService.createAccount(validatedAccountType, userId);

    res.status(201).json({
      accountId: accountId,
    });
  } catch (e) {
    logger.error(`Failed to createAccount for userId ${userId}`);

    if (// TODO: 500
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
