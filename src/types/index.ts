import { z } from "zod";
import { Prisma } from '@prisma/client';
import { createUserSchema, userSchema } from "../models/validation";

export type CreateUserT = z.infer<typeof createUserSchema>;

// a User model without password
export type User = z.infer<typeof userSchema>; 
export type PublicUser = Omit<z.infer<typeof userSchema>, 'password'>;

export interface TransactionT {
  id: number;
  from: number;
  to: number;
  value: Prisma.Decimal;
  transactionDate: Date;
}

export type AccountType = 0 | 1;

export interface CreateAccountT {
  personId: number,
  dailyWithdrawalLimit: number,
  accountType: AccountType,
}

export interface AccountT {
  id: number;
  person_id: number;
  balance: Prisma.Decimal;
  daily_withdrawal_limit: Prisma.Decimal;
  active: boolean;
  account_type: number;
  create_date: Date;
}
