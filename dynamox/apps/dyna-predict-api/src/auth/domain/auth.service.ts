/**
 * @fileoverview Authentication domain service. Contains business logic for
 * credential validation, keeping it decoupled from HTTP transport concerns.
 */

import type { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { findUserByEmail } from '../data-access/user.repository';
import { AUTH_ERR_INVALID_CREDENTIALS } from '../../shared/errors/errors';

export async function validateUserCredentials(
  fastify: FastifyInstance,
  email: string,
  password: string,
) {
  const user = await findUserByEmail(fastify, email);

  if (!user) throw new AUTH_ERR_INVALID_CREDENTIALS();

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) throw new AUTH_ERR_INVALID_CREDENTIALS();

  return user;
}
