import { z } from "zod";
import { createUserSchema, userSchema } from "../models/validation";

export type CreateUserT = z.infer<typeof createUserSchema>;

// a User model without password
export type User = z.infer<typeof userSchema>; 
export type PublicUser = Omit<z.infer<typeof userSchema>, 'password'>;

export interface UserShortcutT {
  id: string,
  email: string
};

export interface TransactionT {
  id: number;
  from: number;
  to: number;
  value: number;
  transactionDate: Date;
}
