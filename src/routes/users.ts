import { Request, Response } from "express-serve-static-core";
import { EMAIL_IN_USE } from '../constants';

const users = [
  { id: 1, email: "user1@gmail.com", password: "password 1" },
  { id: 2, email: "user2@gmail.com", password: "password 2" }
];

export const createUser = (req: Request, res: Response) => {
  const { body: { email, password } } = req;
  console.log(`email ${email}, password ${password}`);
  
  // TODO: validation with zod
  // for now let's just assume payload is valid
  if (email === undefined || password === undefined) {
    return res.sendStatus(400);
  }

  // TODO: try/cache save to db and handle 400 if email is not unique
  const findUserIndexByEmail = users.findIndex(
    (user) => user.email === email
  );

  if (findUserIndexByEmail >= 0) {
    return res.status(400).json({
      message: {
        email: EMAIL_IN_USE
      }
    });
  }

  const newUser = {
    id: users[users.length - 1].id + 1,
    email: email,
    password: password
  };

  users.push(newUser);
  res.sendStatus(201);
};

export const getUsers = (req: Request, res: Response) => {
  res.status(200).send(users);
};
