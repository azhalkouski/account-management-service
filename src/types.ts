import { z } from "zod";
import { userSchema } from "./validation";

export type UserT = z.infer<typeof userSchema>;
