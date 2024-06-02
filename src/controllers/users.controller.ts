import { Request, Response } from "express-serve-static-core";
import { PrismaClient } from '@prisma/client';
import * as usersService from '../services/users.service';
import { PublicUser } from '../types/index';


export const getUsers = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();

  try {
    const allUsers: PublicUser[] = await usersService.getAllUsers();
    res.status(200).send(allUsers);
    await prisma.$disconnect();
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    res.sendStatus(500);
  }
};