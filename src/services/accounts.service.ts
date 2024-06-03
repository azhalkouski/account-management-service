import { PrismaClient } from '@prisma/client';
import { TransactionT } from '../types';

const DEBIT_ACCOUNT_TYPE_ID = 0;
const CREDIT_ACCOUNT_TYPE_ID = 1;

type AccountType = 0 | 1;

/**
 * ?accoutType=debit&currency=byn
 */
// TODO: zod validation for accountId + integration test - expect 400
// ! NO, not zod because accountId comes from req.params not req.body
export const createDebitAccount = async (userId: number) => {
  const debitAccount = await _createAccount(userId, DEBIT_ACCOUNT_TYPE_ID);
  return debitAccount;
};

// TODO: zod validation for accountId + integration test - expect 400
// ! NO, not zod because accountId comes from req.params not req.body
export const createCreditAccount = async (userId: number) => {
  const creditAccount = await _createAccount(userId, CREDIT_ACCOUNT_TYPE_ID);
  return creditAccount;
};

  export const getAccountBalance = async (accountId: number): Promise<number> => {
    console.log('accountService::getAccountBalance');
  
    const prisma = new PrismaClient();
  
  const decimalBalance = await prisma.account.findFirstOrThrow({
    where: {
      id: accountId
    },
    select: {
      balance: true
    }
  });

  const numberBalance: number = decimalBalance.balance.toNumber();

  return numberBalance;
}

export const getAccountTransactions = async (accountId: number): Promise<TransactionT[]> => {
  const prisma = new PrismaClient();

  const transactions = await prisma.transaction.findMany({
    where: {
      accounts: {
        some: {
          id: accountId
        }
      }
    }
  });

  const adaptedTransaction: TransactionT[] = transactions.map((t) => {
    const { transaction_date, ...restT } = t;
    return {
      ...restT,
      value: Number(t.value),
      transactionDate: transaction_date
    };
  })

  return adaptedTransaction;
}

export const updateAccountBalance = async (accountId: number, newBalance: number) => {
  const prisma = new PrismaClient();

  await prisma.account.update({
    where: { id: accountId },
    data: { balance: newBalance }
  });
}

export const blockAccount = async (accountId: number) => {
  console.log('blockAccount');
  const prisma = new PrismaClient();

  await prisma.account.update({
    where: { id: accountId },
    data: { active: false }
  });
};

export const activateAccount = async (accountId: number) => {
  console.log('activateAccount');
  const prisma = new PrismaClient();

  await prisma.account.update({
    where: { id: accountId },
    data: { active: true }
  });
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

export const isDebitAccount = (account_type: number) => {
  return account_type === DEBIT_ACCOUNT_TYPE_ID;
}
