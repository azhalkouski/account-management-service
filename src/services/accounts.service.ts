import { PrismaClient } from '@prisma/client';


const DEBIT_ACCOUNT_TYPE_ID = 0;
const CREDIT_ACCOUNT_TYPE_ID = 1;

type AccountType = 0 | 1;

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

export const _createAccount = async (userId: number, accountType: AccountType) => {
  const prisma = new PrismaClient();

  const newAccount = {
    person_id: userId,
    daily_withdrawal_limit: 100,
    account_type: accountType,
  };

  const createdAccount = await prisma.account.create({
    data: newAccount
  });

  return createdAccount;
};
