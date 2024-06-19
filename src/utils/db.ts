import DatabaseException from '../models/DatabaseException';
import { DetailsT } from '../models/BaseException';
import { VIOLATED_CONSTRAINTS_TEXT } from '../constants/index';


export const getDBExceptionInstance = (type: string, e: Error) => {
  const stack = JSON.stringify(e.stack);
  const exception = new DatabaseException(type, stack, null);

  return exception;
}


export const getDBExceptionInstanceWithDetails = (type: string, e: Error, details: DetailsT | null) => {
  const stack = JSON.stringify(e.stack);
  const exception = new DatabaseException(type, stack, details);

  return exception;
}

export const getViolatedConstraintsText = (violatedConstraitsList: string) => {
  return `${VIOLATED_CONSTRAINTS_TEXT}: ${violatedConstraitsList}`;
};
