import prismaDBService from './db/prismaDB.service';
import { CreateUserT, User } from '../types/index';
import { comparePassword } from '../utils';

/**
 * Database related errors are NOT caught on this level.
 * Database related errors are caught, logged, populated with ERROR_TYPE
 * and thrown further
 * Database related errors are caught on CONTROLLER LEVEL and appropriate
 * responses are sent to clients
 * 
 * Error related to business logic which UsersService directly concerned with
 * ARE CAUGHT on this level, logged, populated if needed and thrown further to
 * the CONTROLLER LEVEL
 */

export const createUser = async (userData: CreateUserT): Promise<number> => {
  const id: number = await prismaDBService.createUser(userData);
  return id;
};

export const isUserCredentialsMatch = async (email: string, password: string): Promise<boolean> => {
  const user: User | null = await prismaDBService.findUserByEmail(email);

  return !!user && comparePassword(password, user.password);
};
