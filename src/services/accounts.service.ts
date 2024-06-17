import { Prisma } from '@prisma/client';
import { TransactionT, AccountTypeT } from '../types';
import prismaDBService from './db/prismaDB.service';

const DEBIT_ACCOUNT_TYPE_ID = 0;
const CREDIT_ACCOUNT_TYPE_ID = 1;


/**
 * 
 * @param accountType 0 means 'credit', 1 means 'debit'
 * @param userId number
 * @returns accountId - number
 */
// ! TODO: who can create accoun for a user???
// for example, pietia CANNOT create account for vasia!
// some kind of SUPERUSER?
export const createAccount = async (accountType: AccountTypeT, userId: number) => {
  if (accountType !== 0 && accountType !== 1) {
    // throw new ValidationException();
    throw new Error('Invalid accountType');
  }
 
  const { accountId } = accountType === 0
    ? await _createDebitAccount(userId)
    : await _createCreditAccount(userId);

  return accountId;
}

export const getAccountBalance = async (accountId: number): Promise<Prisma.Decimal> => {
  const balance = await prismaDBService.getAccountBalance(accountId);
  return balance;
}

export const getAccountTransactions = async (accountId: number): Promise<TransactionT[]> => {
  const transactions = await prismaDBService.getTransactionsByAccountId(accountId);

  return transactions;
}

export const blockAccount = async (accountId: number) => {
  await prismaDBService.blockAccount(accountId);
};

export const activateAccount = async (accountId: number) => {
  await prismaDBService.activateAccount(accountId);
};

export const _createDebitAccount = async (userId: number) => {
  const debitAccount = await _createAccount(userId, DEBIT_ACCOUNT_TYPE_ID);
  return debitAccount;
};

export const _createCreditAccount = async (userId: number) => {
  const creditAccount = await _createAccount(userId, CREDIT_ACCOUNT_TYPE_ID);
  return creditAccount;
};

export const _createAccount = async (userId: number, accountType: AccountTypeT): Promise<{ accountId: number }> => {
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
