import { z } from "zod";
import { createUserSchema, userSchema } from "../validation";

export type CreateUserT = z.infer<typeof createUserSchema>;

export type UserT = z.infer<typeof userSchema>;
