// Create new user
export const CREATE_USER_ERROR_TYPE = 'CREATE_USER_ERROR_TYPE';
export const EMAIL_IN_USE = 'Email is already in use.';
export const EMAIL_NOT_VALID = 'Email invalid.';
export const PASSWORD_NOT_VALID = 'Password invalid.';
export const USER_DOCUMENT_IN_USE = 'User document is already in use.';

// Account
export const ACCOUNT_ID_NOT_VALID = "Account ID is invalied."

// Make transaction
export const MAKE_TRANSACTION_ERROR_TYPE = 'MAKE_TRANSACTION_ERROR_TYPE';
export const MONEY_AMOUNT_NOT_VALID = 'Money amount is invalid.'

export const whiteListUrls = [
  '/favicon.ico',
  '/',
  '/api/v1/auth/signin',
  '/api/v1/auth/signup'
];


export const BALANCE_LOOKUP_DAILY_LIMIT = 10;
