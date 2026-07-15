import { describe, it, expect } from 'vitest';
import { getDbClient } from '@/lib/db';
import { auth } from '@/lib/auth';

describe('Auth & DB Services', () => {
  it('should initialize Prisma db client successfully', () => {
    const client = getDbClient();
    expect(client).toBeDefined();
  });

  it('should initialize Better Auth instance', () => {
    expect(auth).toBeDefined();
    expect(auth.handler).toBeTypeOf('function');
  });
});
