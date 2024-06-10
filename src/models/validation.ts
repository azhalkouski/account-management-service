import { z } from "zod";


export const emailSchema = z.string().email();

export const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(16, { message: "Password must be at most 16 characters long" })
  .refine((value) => /[A-Z]/.test(value), { message: "Password must contain at least one uppercase letter" })
  .refine((value) => /[a-z]/.test(value), { message: "Password must contain at least one lowercase letter" })
  .refine((value) => /[0-9]/.test(value), { message: "Password must contain at least one number" })
  .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), { message: "Password must contain at least one special character" });

const baseUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string(),
  document: z.string(),
  birth_date: z.date()
});

export const createUserSchema = baseUserSchema.extend({});

export const userSchema = baseUserSchema.extend({
  id: z.number()
});

// accountId, moneyAmount

export const accountIdSchema = z.number();
export const unsignedMoneyAmountSchema = z.string().refine((value) => {
  const floatWithTwoDecimalPlacesRegex = /^\d+(\.\d{2})?$/;
  return floatWithTwoDecimalPlacesRegex.test(value);
});

export const accountTypeSchema = z.union([z.literal(0), z.literal(1)]);
