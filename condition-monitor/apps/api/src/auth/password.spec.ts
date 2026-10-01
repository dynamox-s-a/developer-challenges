import bcrypt from 'bcrypt';
import {
  BCRYPT_COST,
  hashPassword,
  needsRehash,
  UNKNOWN_USER_HASH,
  verifyPassword,
} from './password';

describe('password hashing', () => {
  it('hashes with the configured cost and verifies only the right password', async () => {
    const hash = await hashPassword('correct horse battery');

    expect(bcrypt.getRounds(hash)).toBe(BCRYPT_COST);
    expect(await verifyPassword('correct horse battery', hash)).toBe(true);
    expect(await verifyPassword('correct horse batterx', hash)).toBe(false);
  });

  it('makes the unknown-user hash with the same cost as real ones, so timing matches', () => {
    expect(bcrypt.getRounds(UNKNOWN_USER_HASH)).toBe(BCRYPT_COST);
  });

  it('asks for a rehash only when the cost differs', () => {
    expect(needsRehash(bcrypt.hashSync('x', BCRYPT_COST))).toBe(false);
    expect(needsRehash(bcrypt.hashSync('x', BCRYPT_COST + 2))).toBe(true);
  });
});
