import { Router } from 'express';
import { getUsers } from '../controllers/users.controller';
import withAsyncErrorHandling from '../middlewares/withAsyncErrorHandling.middleware';

const usersRouter = Router();

usersRouter.get('/', withAsyncErrorHandling(getUsers));

export default usersRouter;
