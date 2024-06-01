import { PrismaClient } from '@prisma/client';

import { UserT } from '../types/index';
import { comparePassword } from '../utils';

export interface UserShortcutT {
  id: string,
  email: string
};

export const findUserByEmailAndPassword = async (email: string, password: string): Promise<UserShortcutT | null> => {
  const prisma = new PrismaClient();

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
  };

  return UserShortcut;
};

export const getAllUsers = async (): Promise<UserT[]> => {
  const prisma = new PrismaClient();
  const allUsers: UserT[] = await prisma.user.findMany();

  return allUsers;
}

export const findUserByUserId = async (id: number) => {
  const prisma = new PrismaClient();
  const user: UserT | null = await prisma.user.findFirst({
    where: {
      id: id,
    }
  });

  if (!user) {
    return null;
  }

  const { password, ...restUser } = user;

  return restUser;
};
