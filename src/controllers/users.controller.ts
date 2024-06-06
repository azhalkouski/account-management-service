import { Request, Response } from "express-serve-static-core";
import prismaDBService from "../services/prismaDB.service";
import logger from '../utils/logger';
import { PublicUser } from '../types/index';


export const getUsers = async (req: Request, res: Response) => {
  try {
    const allUsers: PublicUser[] = await prismaDBService.findAllUsers();
    res.status(200).send(allUsers);
  } catch (e) {
    logger.error(`Failed to getAllUsers from db. Error: ${e}`);
    res.sendStatus(500);
  }
};
