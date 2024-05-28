import { PrismaClient } from '@prisma/client';

import { UserT } from '../types/index';
import { comparePassword } from '../utils';

// services are just functions that can throw errors
// no try/catch on this level
export const authenticate = async (email?: string, password?: string): Promise<boolean> => {
  const prisma = new PrismaClient();

  if(!email || !password) {
    return false;
  }

  const user: UserT | null = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    return false;
  }

  const isPasswordMatch = comparePassword(password, user.password);
  if (!isPasswordMatch) {
    return false;
  }

  return true;
}