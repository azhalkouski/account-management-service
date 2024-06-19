import AbstractDBService from './abstractDB.service';
import { Prisma, PrismaClient } from '@prisma/client';
import Decimal from "decimal.js"; 
import withPrismaErrorHandlers from './withPrismaErrorHandlers';
import {
  CreateUserT,
  User,
  PublicUser,
  CreateAccountT,
  AccountT,
  TransactionT
} from '../../types/index';
import logger from '../../utils/logger';
import { isDebitAccount } from '../../services/accounts.service';
import { INSUFFICIENT_AMOUNT_ON_ACCOUNT_ERROR } from '../../constants';
import BaseException from '../../models/BaseException';
import InsufficientBalanceException from '../../models/InsufficientBalanceException';

/**
 * ERROR HANDLING abstracted away into withPrismaErrorHandlers
 * at ./withPrismaErrorHandlers.ts
 */

// ! что на счёт закрытия конекшена? Как призма это делает? Она это делает?
class PrismaDBService extends AbstractDBService {
  private prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    super();
    this.prismaClient = prismaClient;
  }

  async createUser(userData: CreateUserT) {
    const createUserPrisma = async () => {
      const { id } = await this.prismaClient.user.create({ data: userData });
      return id;
    }

    const userId = await withPrismaErrorHandlers(createUserPrisma);
    return userId;
  };

  async findUserByEmail(email: string) {
    const findUserByEmailPrisma = async() => {
      const user: User | null = await this.prismaClient.user.findFirst({
        where: {
          email: email,
        },
      });
      return user;
    }

    const user = await withPrismaErrorHandlers(findUserByEmailPrisma);
    return user;
  };

  async findAllUsers() {
    const findAllUsersPrisma = async() => {
      const allUsers: PublicUser[] = await this.prismaClient.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          document: true,
          birth_date: true
        }
      });
      return allUsers;
    }

    const allUsers = await withPrismaErrorHandlers(findAllUsersPrisma);
    return allUsers;
  };

  async createAccount(accountData: CreateAccountT) {
    const newAccount = {
      person_id: accountData.personId,
      daily_withdrawal_limit: accountData.dailyWithdrawalLimit,
      account_type: accountData.accountType,
    };

    const createAccountPrisma = async() => {
      const { id } = await this.prismaClient.account.create({
        data: newAccount
      });
      return { accountId: id };
    }

    const accountIdObj = await withPrismaErrorHandlers(createAccountPrisma);
    return accountIdObj;
  };

  async activateAccount(accountId: number) {
    const activateAccountPrisma = async() => {
      await this.prismaClient.account.update({
        where: { id: accountId },
        data: { active: true }
      });
    }

    await withPrismaErrorHandlers(activateAccountPrisma);
  };

  async blockAccount(accountId: number) {
    const blockAccountPrisma = async() => {
      await this.prismaClient.account.update({
        where: { id: accountId },
        data: { active: false }
      });
    }

    await withPrismaErrorHandlers(blockAccountPrisma);
  };

  async findAccountByIdOrThrow(accountId: number) {
    const findAccountByIdOrThrowPrisma = async() => {
      const account: AccountT = await this.prismaClient.account.findFirstOrThrow({
        where: {
          id: accountId
        }
      });
      return account;
    }

    const account = await withPrismaErrorHandlers(findAccountByIdOrThrowPrisma);
    return account;
  };

  async updateAccountBalance(accountId: number, newBalance: Prisma.Decimal) {
    if (!Prisma.Decimal.isDecimal(newBalance)) {
      const error = new Error('Balance value must be of type Decimal');
      logger.error(`Programming error: ${JSON.stringify(error)}`);
      throw error;
    }

    const updateAccountBalancePrisma = async() => {
      await this.prismaClient.account.update({
        where: { id: accountId },
        data: { balance: newBalance }
      });
    }

    await withPrismaErrorHandlers(updateAccountBalancePrisma);
  };

  async getAccountBalance(accountId: number): Promise<Prisma.Decimal> {
    const getAccountBalancePrisma = async() => {
      const { balance } = await this.prismaClient.account.findFirstOrThrow({
        where: { id: accountId },
        select: { balance: true }
      });
      return balance;
    }

    const balance = await withPrismaErrorHandlers(getAccountBalancePrisma);
    return balance;
  };

  async registerMoneyTransfer(fromId: number, to: number, amount: Prisma.Decimal) {
    if (!Prisma.Decimal.isDecimal(amount)) {
      const error = new Error(`registerMoneyTransfer is called with Amount of type NOT
      DECIMAL value must be of type Decimal`);
      logger.error(`Programming error: ${JSON.stringify(error)}`);
      throw error;
    }

    const registerMoneyTransferPrisma = async() => {
      const { id } = await this.prismaClient.transaction.create({
        data: {
          from: fromId,
          to: to,
          value: amount,
          accounts: {
            connect: [{ id: fromId }, { id: to }]
          }
        }
      });
      return { transferId: id };
    }

    const transferIdObject = await withPrismaErrorHandlers(registerMoneyTransferPrisma);
    return transferIdObject;
  };

  async getTransactionsByAccountId(accountId: number) {
    const getTransactionsByAccountIdPrisma = async () => {
      const transactions = await this.prismaClient.transaction.findMany({
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
          transactionDate: transaction_date
        };
      })

      return adaptedTransaction;
    }

    const userId = await withPrismaErrorHandlers(getTransactionsByAccountIdPrisma);
    return userId;
  };

  /**
   * 
   * @param fromId - money sender accountId
   * @param to  - money receiver accountId
   * @param amount - Decimal amount of money
   */
  async doMoneyTransferTransaction(fromId: number, toId: number, amount: Prisma.Decimal) {
    try {
      // TRANSACTION BEGIN
      await this.prismaClient.$transaction(async (_) => {
  
        const {
          account_type: sourceAccountType,
          balance: sourceBalance
        } = await prismaDBService.findAccountByIdOrThrow(fromId);
        const {
          balance: destinationBalance
        } = await prismaDBService.findAccountByIdOrThrow(toId);
  
        if (isDebitAccount(sourceAccountType)) {
          const exception = new BaseException(
            `Only debit accounts payments are currently supported, but got CREDIT ACCOUNT of id: ${fromId}`,
            null,
            null
          );
          throw exception;
        }
  
        const newSourceBalance = new Decimal(sourceBalance).sub(amount);
        const newDestinationBalance = new Decimal(destinationBalance).add(amount);
  
        // check if balance has required amount
        if (newSourceBalance.lessThan(0)){
          const exception = new InsufficientBalanceException(
            INSUFFICIENT_AMOUNT_ON_ACCOUNT_ERROR, null, { accountId: fromId.toString() }
          );
          throw exception;
        }

        await prismaDBService.updateAccountBalance(fromId, newSourceBalance);
        await prismaDBService.updateAccountBalance(toId, newDestinationBalance);

        // record transaction
        await prismaDBService.registerMoneyTransfer(fromId, toId, amount);
        // TODO: this.prismaClient.$disconnect();
      });
      // TRANSACTION END;
    } catch (e) {
      const stack = e instanceof Error ? JSON.stringify(e.stack) : null;
      const exception = new BaseException(
        `Transaction failed with error: ${e}`,
        stack,
        null
      );
      throw exception;
    }
  }
}


const prismaDBService = new PrismaDBService(new PrismaClient());

export default prismaDBService;
