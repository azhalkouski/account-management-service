import { Request, Response } from "express-serve-static-core";
import * as usersService from '../services/users.service';
import { PublicUser } from '../types/index';


export const getUsers = async (req: Request, res: Response) => {
  const allUsers: PublicUser[] = await usersService.findAllUsers();
  res.status(200).send(allUsers);
};
