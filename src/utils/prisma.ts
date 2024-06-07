import { Prisma } from '@prisma/client';


export const isPrismaClientNotFoundError =
  isPrismaClientErrorOfType('NotFoundError');

// used in conjunction with e.code === 'P_code'
export const isPrismaClientKnownRequestError =
  isPrismaClientErrorOfType('PrismaClientKnownRequestError');

export const isPrismaClientValidationError =
  isPrismaClientErrorOfType('PrismaClientValidationError');

export const isPrismaClientInitializationError =
  isPrismaClientErrorOfType('PrismaClientInitializationError');

function isPrismaClientErrorOfType(errTypeName: string) {
  return function (error: unknown): error is Prisma.PrismaClientKnownRequestError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      error.name === errTypeName
    );
  }
}
