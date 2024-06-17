import logger from '../../utils/logger';
import {
  isPrismaClientInitializationError,
  isPrismaClientValidationError,
  isPrismaClientKnownRequestError,
  isPrismaClientNotFoundError
} from '../../utils/prisma';
import {
  PRISMA_CLIENT_INITIALIZATION_ERROR,
  PRISMA_VALIDATION_ERROR,
  UNIQUE_CONSTRAINT_FAILED,
  FOREIGN_KEY_CONSTRAINT_FAILED,
  NOT_FOUND_IN_DATABASE
} from '../../constants';
import DatabaseException from '../../models/DatabaseException';

/**
 * Handles the following errors:
 * - InitializationError - if db service is down
 * - ValidationError
 * - UniqueConstraintError
 * - ForeignKeyConstraintError
 * - NotFoundError
 * - other UNEXPECTED errors
 * 
 * Caught error are logged, cleared from details and thrown further.
 * The involved controlled catches the error and responds to clients with 400 or 500
 * 
 * DON'T EXPOSE ANY SPECIFIC DETAILS
 * Due to security concerns don't expose details. Log details for OWN benefit.
 * But DO NOT let the crowd explore the implementation details leveraging our `friendly` error messages.
 * 
 * @param algorithm - function with db operations wrapped with try/ctch
 */
const withPrismaErrorHandlers =  async <T>(algorithm: () => Promise<T>): Promise<T> => {
  try {
    const result: T = await algorithm();
    return result;
  } catch (e) {

    if (isPrismaClientInitializationError(e)) {
      const stack = JSON.stringify(e.stack);

      const customError = new DatabaseException(
        PRISMA_CLIENT_INITIALIZATION_ERROR, stack
      );
      throw customError;
    }

    if (isPrismaClientValidationError(e)) {
      const originalError = JSON.stringify(e);
      logger.error(`PRISMA::VALIDATION error::error: ${originalError}`);
      const customError = new Error(PRISMA_VALIDATION_ERROR);
      throw customError;
    }

    if (isPrismaClientKnownRequestError(e) && e.code === 'P2002') {
      // * P2002 is an error when the Unique constraint failed
      const violatedConstraints = JSON.stringify(e.meta);
      logger.error(`PRISMA::Unique CONSTRAINT failed::error: ${violatedConstraints}`);
      const customError = new Error(UNIQUE_CONSTRAINT_FAILED);
      throw customError;
    }

    if (isPrismaClientKnownRequestError(e) && e.code === 'P2003') {
      // * P2003 is an error when the Foreign Key constraint failed
      const violatedConstraints = JSON.stringify(e.meta);
      logger.info(`PRISMA::Foreign Key CONSTRAINT failed::error: ${violatedConstraints}`);
      const customError = new Error(FOREIGN_KEY_CONSTRAINT_FAILED);
      throw customError;
    }

    if (isPrismaClientNotFoundError(e) && e.code === 'P2025') {
      // * P2025 means NOT FOUND
      const originalError = JSON.stringify(e);
      logger.info(`PRISMA::NOT FOUND::error: ${originalError}`);
      const customError = new Error(NOT_FOUND_IN_DATABASE);
      throw customError;
    }

    /**
       * If we've reached this point, then obviously we have no idea what just happened.
       * This should be handled as 500 error
       */
    const stringError = JSON.stringify(e);
    logger.error(`Something UNEXPECTED happened at the Prisma level: ${stringError}`);
    throw e;
  }
}

export default withPrismaErrorHandlers;
