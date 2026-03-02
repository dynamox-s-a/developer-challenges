import { describe, it, expect } from 'vitest';
import { faker } from '@faker-js/faker';
import { INTERNAL_SERVER_ERROR, withCause } from '../../../src/shared/errors/errors';

describe('withCause', () => {
  describe('when cause is an Error', () => {
    it('should attach the error as cause and return the original error', () => {
      const error = new INTERNAL_SERVER_ERROR();
      const cause = new Error(faker.lorem.sentence());

      const result = withCause(error, cause);

      expect(result).toBe(error);
      expect(result.cause).toBe(cause);
    });
  });

  describe('when cause is not an Error', () => {
    it('should wrap the cause in a new Error and return the original error', () => {
      const error = new INTERNAL_SERVER_ERROR();
      const cause = faker.lorem.sentence();

      const result = withCause(error, cause);

      expect(result).toBe(error);
      expect(result.cause).toBeInstanceOf(Error);
      expect((result.cause as Error).message).toBe(cause);
    });
  });
});
