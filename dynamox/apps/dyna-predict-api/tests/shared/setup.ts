import { vi } from 'vitest';

vi.mock('../src/prisma/plugins/prisma', () => ({
  default: vi.fn(),
}));
