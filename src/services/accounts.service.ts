import { PrismaClient } from '@prisma/client';


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

// ! no zod validation: this method is not public api
export const setAccountBalance = async (newBalance: number) => {
  console.log('setAccountBalance');

  // TODO: implement prisma.account.updateOne
}

// TODO: zod validation for accountId + integration test - expect 400
// ! NO, not zod because accountId comes from req.params not req.body
export const blockAccount = async (accountId: number) => {
  console.log('blockAccount');

  // TODO: implement prisma.account.updateOne
}

export const activateAccount = async (accountId: number) => {
  console.log('activateAccount');
  const prisma = new PrismaClient();

  await prisma.account.update({
    where: { id: accountId },
    data: { active: true }
  });
}

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
