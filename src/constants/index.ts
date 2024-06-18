// VALIDATION ERRORS
export const EMAIL_NOT_VALID = 'Email invalid.';
export const PASSWORD_NOT_VALID = 'Password invalid.';
export const ACCOUNT_ID_NOT_VALID = "Account ID is invalied."
export const MONEY_AMOUNT_NOT_VALID = 'Money amount is invalid.'
export const INVALID_ACCOUNT_TYPE = 'Invalid account type';

// TRANSACTIONS ERRORS
export const MAKE_TRANSACTION_ERROR_TYPE = 'MAKE_TRANSACTION_ERROR_TYPE';
export const INSUFFICIENT_AMOUNT_ON_ACCOUNT_ERROR = 'INSUFFICIENT_AMOUNT_ON_ACCOUNT_ERROR';

// PRISMA ERRORS
export const UNIQUE_CONSTRAINT_FAILED = 'Unique constraint failed';
export const PRISMA_VALIDATION_ERROR = 'Invalid model argument passed to prismaClient.';
export const PRISMA_CLIENT_INITIALIZATION_ERROR = 'PRISMA_CLIENT_INITIALIZATION_ERROR';
export const FOREIGN_KEY_CONSTRAINT_FAILED = 'FOREIGN_KEY_CONSTRAINT_FAILED';
export const NOT_FOUND_IN_DATABASE = 'NOT_FOUND_IN_DATABASE';
export const VIOLATED_CONSTRAINTS_TEXT = 'Violated constraints';


export const BALANCE_LOOKUP_DAILY_LIMIT = 10;


export const whiteListUrls = [
  '/favicon.ico',
  '/',
  '/api/v1/auth/signin',
  '/api/v1/auth/signup'
];
