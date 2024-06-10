import Decimal from 'decimal.js';
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

  abstract getAccountBalance(accountId: number): Promise<Decimal>;
  abstract updateAccountBalance(accountId: number, newBalance: Decimal): void;

  abstract registerMoneyTransfer(from: number, to: number, value: Decimal): Promise<{ transferId: number }>;
  abstract getTransactionsByAccountId(accountId: number): Promise<TransactionT[]>;

  abstract doMoneyTransferTransaction(fromId: number, toId: number, amount: Decimal): void;
}

export default AbstractDBService;
