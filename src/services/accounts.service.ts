import { Prisma } from '@prisma/client';
import { TransactionT, AccountType } from '../types';
import prismaDBService from './db/prismaDB.service';

const DEBIT_ACCOUNT_TYPE_ID = 0;
const CREDIT_ACCOUNT_TYPE_ID = 1;


/**
 * ?accoutType=debit&currency=byn
 */
export const createDebitAccount = async (userId: number) => {
  const debitAccount = await _createAccount(userId, DEBIT_ACCOUNT_TYPE_ID);
  return debitAccount;
};

export const createCreditAccount = async (userId: number) => {
  const creditAccount = await _createAccount(userId, CREDIT_ACCOUNT_TYPE_ID);
  return creditAccount;
};

export const getAccountBalance = async (accountId: number): Promise<Prisma.Decimal> => {
  const balance = await prismaDBService.getAccountBalance(accountId);
  return balance;
}

export const getAccountTransactions = async (accountId: number): Promise<TransactionT[]> => {
  const transactions = await prismaDBService.getTransactionsByAccountId(accountId);

  return transactions;
}

export const blockAccount = async (accountId: number) => {
  // ? не понимаю зачем мне эта прослойка в виде сервиса
  // ? разве что чтобы контроллер не занд про базу данных и взаимодействие с ней
  await prismaDBService.blockAccount(accountId);
};

export const activateAccount = async (accountId: number) => {
  await prismaDBService.activateAccount(accountId);
};

export const _createAccount = async (userId: number, accountType: AccountType): Promise<{ accountId: number }> => {
  const newAccount = {
    personId: userId,
    dailyWithdrawalLimit: 100,
    accountType: accountType,
  };

  const account = await prismaDBService.createAccount(newAccount);

  return account;
};

export const isDebitAccount = (account_type: number) => {
  return account_type === DEBIT_ACCOUNT_TYPE_ID;
}
