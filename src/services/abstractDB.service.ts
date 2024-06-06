import {
  CreateUserT,
  User,
  PublicUser,
  AccountType,
  CreateAccountT
} from '../types/index';


abstract class AbstractDBService {
  abstract createUser(userData: CreateUserT): Promise<number>;
  abstract findUserByEmail(email: string): Promise<User | null>;
  abstract findAllUsers(): Promise<PublicUser[]>;

  abstract createAccount(accountData: CreateAccountT): Promise<{ accountId: number }>;
  abstract activateAccount(): void;
  abstract blockAccount(): void;

  abstract findAccountById(id: number): Promise<AccountType | null>;

  abstract getAccountBalance(): void;
  abstract updateAccountBalance(): void;

  abstract createTransaction(): void;
  abstract getTransactionsByAccountId(): void;
}

export default AbstractDBService;
