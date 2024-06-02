import { PrismaClient } from '@prisma/client';

import { CreateUserT, UserT, UserShortcutT } from '../types/index';
import { comparePassword } from '../utils';

export const createUser = async (userData: CreateUserT): Promise<number> => {
  const prisma = new PrismaClient();

  const { id } = await prisma.user.create({ data: userData });

  return id;
}

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
