import { Router } from 'express';
import { getUsers } from '../controllers/users.controller';
import withErrorHandling from '../middlewares/withErrorHandling.middleware';

const usersRouter = Router();

usersRouter.get('/', withErrorHandling(getUsers));

export default usersRouter;
