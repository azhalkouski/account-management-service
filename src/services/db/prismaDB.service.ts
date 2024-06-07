import AbstractDBService from './abstractDB.service';
import { Prisma, PrismaClient,  } from '@prisma/client';
import {
  CreateUserT,
  User,
  PublicUser,
  CreateAccountT,
  AccountT,
  TransactionT
} from '../../types/index';
import logger from '../../utils/logger';
import {
  UNIQUE_CONSTRAINT_FAILED,
  PRISMA_VALIDATION_ERROR,
  PRISMA_CLIENT_INITIALIZATION_ERROR,
  FOREIGN_KEY_CONSTRAINT_FAILED,
  NOT_FOUND_IN_DATABASE
} from '../../constants/index';

/**
 * ERROR HANDLING
 * 
 * 1) catch and log error on this level
 * 2) for know errors throw further: UNIQUE_CONSTRAINT_FAILED, PRISMA_VALIDATION_ERROR, PRISMA_CLIENT_INITIALIZATION_ERROR
 * 3) for unknow error throw further::expected to be handled as 500
 * 
 * DON'T EXPOSE ANY MORE SPECIFIC DETAILS
 * Due to security concerns we don't expose details. We log details for OUR OWN benefit.
 * But we DO NOT let the crowd explore our implementation details leveraging our `friendly` error messages.
 */

// ! что на счёт закрытия конекшена? Как призма это делает? Она это делает?
class PrismaDBService extends AbstractDBService {
  private prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    super();
    this.prismaClient = prismaClient;
  }

  async createUser(userData: CreateUserT) {
    try {
      const { id } = await this.prismaClient.user.create({ data: userData });
      return id;
    } catch(e) {
      if (isPrismaClientKnownRequestError(e) && e.code === 'P2002') {
        // * P2002 is an error when the Unique constraint failed
        const violatedConstraints = JSON.stringify(e.meta);
        logger.info(`Unique constraint failed: ${violatedConstraints}`);
        const customError = new Error(UNIQUE_CONSTRAINT_FAILED);
        throw customError;
      }

      if (isPrismaClientValidationError(e)) {
        logger.info(`Attempt to create invalid user. Some mondatory fields might
        be missing or of wrong data type. Provided user keys: ${Object.keys(userData)}.`);
        const customError = new Error(PRISMA_VALIDATION_ERROR);
        throw customError;
      }

      if (isPrismaClientInitializationError(e)) {
        logger.error(`Prisma client failed to initialize. Make sure your database
        server is running.`);
        const customError = new Error(PRISMA_CLIENT_INITIALIZATION_ERROR);
        throw customError;
      }

      /**
       * If we've reached this point then obviously we've got no idea of what has
       * just happened. This is definitely 500 error
       */
      const stringError = JSON.stringify(e);
      logger.error(`Something UNEXPECTED happened: ${stringError}`);
      throw e;
    }
  };

  async findUserByEmail(email: string) {
    try {
      const user: User | null = await this.prismaClient.user.findFirst({
        where: {
          email: email,
        },
      });
      return user;
    } catch(e) {
      if (isPrismaClientInitializationError(e)) {
        logger.error(`Prisma client failed to initialize. Make sure your database
        server is running.`);
        const customError = new Error(PRISMA_CLIENT_INITIALIZATION_ERROR);
        throw customError;
      }

      const stringError = JSON.stringify(e);
      logger.error(`PrismaDBService: Failed to findUserByEmail with email: ${email} with error: ${stringError}`);
      throw e;
    }
  };

  async findAllUsers() {
    try {
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
    } catch(e) {
      if (isPrismaClientInitializationError(e)) {
        logger.error(`Prisma client failed to initialize. Make sure your database
        server is running.`);
        const customError = new Error(PRISMA_CLIENT_INITIALIZATION_ERROR);
        throw customError;
      }

      const stringError = JSON.stringify(e);
      logger.error(`PrismaDBService: findAllUsers failed to obtain users
        with error: ${stringError}`);
      throw e;
    }
  };

  async createAccount(accountData: CreateAccountT) {
    const newAccount = {
      person_id: accountData.personId,
      daily_withdrawal_limit: accountData.dailyWithdrawalLimit,
      account_type: accountData.accountType,
    };

    try {
      const { id } = await this.prismaClient.account.create({
        data: newAccount
      });

      return { accountId: id };
    } catch(e) {
      if (isPrismaClientInitializationError(e)) {
        logger.error(`Prisma client failed to initialize. Make sure your database
        server is running.`);
        const customError = new Error(PRISMA_CLIENT_INITIALIZATION_ERROR);
        throw customError;
      };

      if (isPrismaClientKnownRequestError(e) && e.code === 'P2003') {
        // * P2003 is an error when the Foreign Key constraint failed
        const violatedConstraints = JSON.stringify(e.meta);
        logger.info(`Foreign Key constraint failed: ${violatedConstraints}`);
        const customError = new Error(FOREIGN_KEY_CONSTRAINT_FAILED);
        throw customError;
      }

      if (isPrismaClientValidationError(e)) {
        logger.info(`Attempt to create invalid account. Some mondatory fields might
        be missing or of wrong data type. Provided account keys: ${Object.keys(accountData)}.`);
        const customError = new Error(PRISMA_VALIDATION_ERROR);
        throw customError;
      }

      const stringError = JSON.stringify(e);
      logger.error(`PrismaDBService: Failed to createAccount with error: ${stringError}`);
      throw e;
    }
  };

  async activateAccount(accountId: number) {
    try {
      await this.prismaClient.account.update({
        where: { id: accountId },
        data: { active: true }
      });
    } catch (e) {
      if (isPrismaClientInitializationError(e)) {
        logger.error(`Prisma client failed to initialize. Make sure your database
        server is running.`);
        const customError = new Error(PRISMA_CLIENT_INITIALIZATION_ERROR);
        throw customError;
      };

      if (isPrismaClientValidationError(e)) {
        logger.info('Invalid arguments on activateAccount.');
        const customError = new Error(PRISMA_VALIDATION_ERROR);
        throw customError;
      };

      if (isPrismaClientNotFoundError(e) && e.code === 'P2025') {
        // * P2025 means NOT FOUND
        logger.info(`Account with id ${accountId} not found.`);
        const customError = new Error(NOT_FOUND_IN_DATABASE);
        throw customError;
      }

      const stringError = JSON.stringify(e);
      logger.error(`PrismaDBService: Failed to activateAccount with error: ${stringError}`);
      throw e;
    }
  };

  async blockAccount(accountId: number) {
    try {
      await this.prismaClient.account.update({
        where: { id: accountId },
        data: { active: false }
      });
    } catch (e) {
      if (isPrismaClientInitializationError(e)) {
        logger.error(`Prisma client failed to initialize. Make sure your database
        server is running.`);
        const customError = new Error(PRISMA_CLIENT_INITIALIZATION_ERROR);
        throw customError;
      };

      if (isPrismaClientValidationError(e)) {
        logger.info('Invalid arguments on blockAccount.');
        const customError = new Error(PRISMA_VALIDATION_ERROR);
        throw customError;
      };

      if (isPrismaClientNotFoundError(e) && e.code === 'P2025') {
        // * P2025 means NOT FOUND
        logger.info(`Account with id ${accountId} not found.`);
        const customError = new Error(NOT_FOUND_IN_DATABASE);
        throw customError;
      }

      const stringError = JSON.stringify(e);
      logger.error(`PrismaDBService: Failed to blockAccount with error: ${stringError}`);
      throw e;
    }
  };

  async findAccountByIdOrThrow(accountId: number) {
    try {
      const account: AccountT = await this.prismaClient.account.findFirstOrThrow({
        where: {
          id: accountId
        }
      });
  
      return account;
    } catch (e) {
      if (isPrismaClientInitializationError(e)) {
        logger.error(`Prisma client failed to initialize. Make sure your database
        server is running.`);
        const customError = new Error(PRISMA_CLIENT_INITIALIZATION_ERROR);
        throw customError;
      }

      if (isPrismaClientValidationError(e)) {
        const stringError = JSON.stringify(e);
        logger.info(`Failed to find account by id due to invalid arguments.
        Provided type of accountIs is ${typeof accountId}. Error: ${stringError}`);
        const customError = new Error(PRISMA_VALIDATION_ERROR);
        throw customError;
      }

      // ! isPrismaClientNotFoundError
      if (isPrismaClientKnownRequestError(e) && e.code === 'P2025') {
        // * P2025 means NOT FOUND
        logger.info(`Account with id ${accountId} not found.`);
        const customError = new Error(NOT_FOUND_IN_DATABASE);
        throw customError;
      }

      /**
       * If we've reached this point then obviously we've got no idea of what has
       * just happened. This is definitely 500 error
       */
      const stringError = JSON.stringify(e);
      logger.error(`Something UNEXPECTED happened: ${stringError}`);
      throw e;
    }
  };

  async updateAccountBalance(accountId: number, newBalance: Prisma.Decimal) {
    if (!Prisma.Decimal.isDecimal(newBalance)) {
      const error = new Error('Balance value must be of type Decimal');
      logger.error(`Programming error: ${JSON.stringify(error)}`);
      throw error;
    }

    try {
      await this.prismaClient.account.update({
        where: { id: accountId },
        data: { balance: newBalance }
      });
    } catch (e) {
      if (isPrismaClientInitializationError(e)) {
        logger.error(`Prisma client failed to initialize. Make sure your database
        server is running.`);
        const customError = new Error(PRISMA_CLIENT_INITIALIZATION_ERROR);
        throw customError;
      };

      if (isPrismaClientValidationError(e)) {
        logger.error(`Update balance failed due to validation error.
        AccountId: ${accountId}, newBalance: ${newBalance}.`);
        const customError = new Error(PRISMA_VALIDATION_ERROR);
        throw customError;
      }

      // ! isPrismaClientNotFoundError
      if (isPrismaClientKnownRequestError(e) && e.code === 'P2025') {
        // * P2025 means NOT FOUND
        logger.info(`Account with id ${accountId} not found.`);
        const customError = new Error(NOT_FOUND_IN_DATABASE);
        throw customError;
      }

      /**
       * If we've reached this point then obviously we've got no idea of what has
       * just happened. This is definitely 500 error
       */
      const stringError = JSON.stringify(e);
      logger.error(`Something UNEXPECTED happened: ${stringError}`);
      throw e;
    }

  };

  async getAccountBalance(accountId: number): Promise<Prisma.Decimal> {
    try {
      const { balance } = await this.prismaClient.account.findFirstOrThrow({
        where: { id: 123 },
        select: { balance: true }
      });
  
      return balance;
    } catch(e) {
      if (isPrismaClientInitializationError(e)) {
        logger.error(`Prisma client failed to initialize. Make sure your database
        server is running.`);
        const customError = new Error(PRISMA_CLIENT_INITIALIZATION_ERROR);
        throw customError;
      };

      if (isPrismaClientValidationError(e)) {
        logger.error(`Update balance failed due to validation error.
        AccountId: ${accountId}.`);
        const customError = new Error(PRISMA_VALIDATION_ERROR);
        throw customError;
      }

      if (isPrismaClientNotFoundError(e) && e.code === 'P2025') {
      // if (isPrismaClientKnownRequestError(e) && e.code === 'P2025') {
        // * P2025 means NOT FOUND
        logger.info(`Account with id ${accountId} not found.`);
        const customError = new Error(NOT_FOUND_IN_DATABASE);
        throw customError;
      }

      /**
       * If we've reached this point then obviously we've got no idea of what has
       * just happened. This is definitely 500 error
       */
      const stringError = JSON.stringify(e);
      logger.error(`Something UNEXPECTED happened: ${stringError}`);
      throw e;
    }
  };

  async createTransaction(from: number, to: number, amount: Prisma.Decimal) {
    if (!Prisma.Decimal.isDecimal(amount)) {
      const error = new Error(`createTransaction is called with Amount of type NOT
      DECIMAL value must be of type Decimal`);
      logger.error(`Programming error: ${JSON.stringify(error)}`);
      throw error;
    }

    try {
      const { id } = await this.prismaClient.transaction.create({
        data: {
          from: from,
          to: to,
          value: amount,
          accounts: {
            connect: [{ id: from }, { id: to }]
          }
        }
      });
  
      return { transactionId: id };
    } catch (e) {
      if (isPrismaClientInitializationError(e)) {
        logger.error(`Prisma client failed to initialize. Make sure your database
        server is running.`);
        const customError = new Error(PRISMA_CLIENT_INITIALIZATION_ERROR);
        throw customError;
      }

      if (isPrismaClientValidationError(e)) {
        logger.info(`Error: create. prismaClient.transaction.create is likely invoked
        with arguments of invalid data types: from:${typeof from}, to:${typeof to},
        amount:${typeof amount}.`);
        const customError = new Error(PRISMA_VALIDATION_ERROR);
        throw customError;
      }

      if (isPrismaClientKnownRequestError(e) && e.code === 'P2003') {
        // * P2003 is an error when the Foreign Key constraint failed
        const violatedConstraints = JSON.stringify(e.meta);
        logger.info(`Foreign Key constraint failed: ${violatedConstraints}`);
        const customError = new Error(FOREIGN_KEY_CONSTRAINT_FAILED);
        throw customError;
      }

      /**
       * If we've reached this point then obviously we've got no idea of what has
       * just happened. This is definitely 500 error
       */
      const stringError = JSON.stringify(e);
      logger.error(`Something UNEXPECTED happened: ${stringError}`);
      throw e;
    }
  };

  async getTransactionsByAccountId(accountId: number) {
    try {
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
    } catch (e) {
      if (isPrismaClientInitializationError(e)) {
        logger.error(`Prisma client failed to initialize. Make sure your database
        server is running.`);
        const customError = new Error(PRISMA_CLIENT_INITIALIZATION_ERROR);
        throw customError;
      }

      if (isPrismaClientValidationError(e)) {
        logger.info(`Error: create. prismaClient.getTransactionsByAccountId.create is likely invoked
        with arguments of invalid data types: amount:${typeof accountId}.`);
        const customError = new Error(PRISMA_VALIDATION_ERROR);
        throw customError;
      }

      const stringError = JSON.stringify(e);
      logger.error(`Something UNEXPECTED happened: ${stringError}`);
      throw e;
    }
  };
}


const prismaDBService = new PrismaDBService(new PrismaClient());

export default prismaDBService;


//
// FOR PRIVATE USE
//

const isPrismaClientNotFoundError =
  isPrismaClientErrorOfType('NotFoundError');

  const isPrismaClientKnownRequestError =
  isPrismaClientErrorOfType('PrismaClientKnownRequestError');

const isPrismaClientValidationError =
  isPrismaClientErrorOfType('PrismaClientValidationError');

  const isPrismaClientInitializationError =
  isPrismaClientErrorOfType('PrismaClientInitializationError');

function isPrismaClientErrorOfType(errTypeName: string) {
  return function (error: unknown): error is Prisma.PrismaClientKnownRequestError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      error.name === errTypeName
    );
  }
}
