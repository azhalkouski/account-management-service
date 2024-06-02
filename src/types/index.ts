import { z } from "zod";
import { createUserSchema, userSchema } from "../models/validation";

export type CreateUserT = z.infer<typeof createUserSchema>;

// a User model without password
// TODO: export type UserT = Omit<z.infer<typeof userSchema>, 'password'>;
export type UserT = z.infer<typeof userSchema>; 

export interface UserShortcutT {
  id: string,
  email: string
};
