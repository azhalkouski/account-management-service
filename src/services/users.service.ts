import { PrismaClient } from '@prisma/client';

import { CreateUserT, User, UserShortcutT, PublicUser } from '../types/index';
import { comparePassword } from '../utils';

export const createUser = async (userData: CreateUserT): Promise<number> => {
  const prisma = new PrismaClient();

  const { id } = await prisma.user.create({ data: userData });

  return id;
}

export const findUserByEmailAndPassword = async (email: string, password: string): Promise<UserShortcutT | null> => {
  const prisma = new PrismaClient();

  const user: User | null = await prisma.user.findFirst({
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

export const getAllUsers = async (): Promise<PublicUser[]> => {
  const prisma = new PrismaClient();
  const allUsers: PublicUser[] = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      document: true,
      birth_date: true
    }
  });



  return allUsers;
}

export const findUserByUserId = async (id: number) => {
  const prisma = new PrismaClient();
  const user: PublicUser | null = await prisma.user.findFirst({
    where: {
      id: id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      document: true,
      birth_date: true
    }
  });

  if (!user) {
    return null;
  }

  return user;
};

export const findUserByEmail = async (email: string) => {
  const prisma = new PrismaClient();
  const user: PublicUser | null = await prisma.user.findFirst({
    where: {
      email: email,
    },
    select: {
      id: true,
      email: true,
      name: true,
      document: true,
      birth_date: true
    }
  });

  if (!user) {
    return null;
  }

  return user;
};
