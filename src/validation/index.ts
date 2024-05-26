import { z } from "zod";


export const emailSchema = z.string().email();

export const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(16, { message: "Password must be at most 16 characters long" })
  .refine((value) => /[A-Z]/.test(value), { message: "Password must contain at least one uppercase letter" })
  .refine((value) => /[a-z]/.test(value), { message: "Password must contain at least one lowercase letter" })
  .refine((value) => /[0-9]/.test(value), { message: "Password must contain at least one number" })
  .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), { message: "Password must contain at least one special character" });

export const userSchema = z.object({
  id: z.number(),
  email: emailSchema,
  password: passwordSchema
});
