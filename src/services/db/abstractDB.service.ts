import { Prisma } from '@prisma/client';
import {
  CreateUserT,
  User,
  PublicUser,
  AccountT,
  CreateAccountT,
  TransactionT
} from '../../types/index';


abstract class AbstractDBService {
  abstract createUser(userData: CreateUserT): Promise<number>;
  abstract findUserByEmail(email: string): Promise<User | null>;
  abstract findAllUsers(): Promise<PublicUser[]>;

  abstract createAccount(accountData: CreateAccountT): Promise<{ accountId: number }>;
  abstract activateAccount(accountId: number): void;
  abstract blockAccount(accountId: number): void;

  abstract findAccountByIdOrThrow(id: number): Promise<AccountT>;

  abstract getAccountBalance(accountId: number): Promise<Prisma.Decimal>;
  abstract updateAccountBalance(accountId: number, newBalance: Prisma.Decimal): void;

  abstract registerMoneyTransfer(from: number, to: number, value: Prisma.Decimal): Promise<{ transferId: number }>;
  abstract getTransactionsByAccountId(accountId: number): Promise<TransactionT[]>;

  // ! uncomment and IMPLEMENT
  // abstract doMoneyTransferTransaction(from: string, to: string, amount: Prisma.Decimal): void;
}

export default AbstractDBService;
