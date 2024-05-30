import { PrismaClient } from '@prisma/client';

import { UserT } from '../types/index';
import { comparePassword } from '../utils';

export interface UserShortcutT {
  id: string,
  email: string
};

export const findUserByEmailAndPassword = async (email?: string, password?: string): Promise<UserShortcutT | null> => {
  const prisma = new PrismaClient();

  if(!email || !password) {
    return null;
  }

  const user: UserT | null = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    return null;
  }

  const isPasswordMatch = comparePassword(password, user.password);
  if (!isPasswordMatch) {
    return null;
  }

  const UserShortcut: UserShortcutT = {
    id: user.id.toString(),
    email: user.email
  }

  return UserShortcut;
}