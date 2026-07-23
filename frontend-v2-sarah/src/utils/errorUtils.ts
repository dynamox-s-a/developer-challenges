import { ERROR_MESSAGES } from '../features/data/constants';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return ERROR_MESSAGES.UNEXPECTED_ERROR;
};
