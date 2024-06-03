import { Router } from 'express';
import { handleMakePayment } from '../controllers/payments.controller';
import validateMakePaymentPayload from '../middlewares/validateMakePaymentPayload.middleware';

const paymentRouter = Router();

paymentRouter.post('/make', validateMakePaymentPayload, handleMakePayment);

export default paymentRouter;
