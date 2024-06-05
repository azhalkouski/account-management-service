import prismaClient from './prismaClient.service';
import { TransactionT } from '../types';

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

  export const getAccountBalance = async (accountId: number): Promise<number> => {
    console.log('accountService::getAccountBalance');
  
  const decimalBalance = await prismaClient.account.findFirstOrThrow({
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
  const transactions = await prismaClient.transaction.findMany({
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
  await prismaClient.account.update({
    where: { id: accountId },
    data: { balance: newBalance }
  });
}

export const blockAccount = async (accountId: number) => {
  console.log('blockAccount');
  await prismaClient.account.update({
    where: { id: accountId },
    data: { active: false }
  });
};

export const activateAccount = async (accountId: number) => {
  console.log('activateAccount');

  await prismaClient.account.update({
    where: { id: accountId },
    data: { active: true }
  });
};

export const _createAccount = async (userId: number, accountType: AccountType) => {

  const newAccount = {
    person_id: userId,
    daily_withdrawal_limit: 100,
    account_type: accountType,
  };

  const createdAccount = await prismaClient.account.create({
    data: newAccount
  });

  return createdAccount;
};

export const isDebitAccount = (account_type: number) => {
  return account_type === DEBIT_ACCOUNT_TYPE_ID;
}
