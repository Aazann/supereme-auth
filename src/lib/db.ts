import { PrismaClient } from "../generated/prisma";

declare global {
  var prisma: PrismaClient | undefined;
}

// Fallback to local SQLite file database if no database URL is set in environment
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}

// Default Prisma client pointing to the environment-configured database
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// Client cache for multi-workspace support
const clientCache = new Map<string, PrismaClient>();

/**
 * Retrieve a database client for a specific workspace DB URL.
 * If no URL is provided, returns the default studio client.
 */
export function getDbClient(dbUrl?: string): PrismaClient {
  const url = dbUrl || process.env.DATABASE_URL || "file:./dev.db";

  if (clientCache.has(url)) {
    return clientCache.get(url)!;
  }

  const client = new PrismaClient({
    datasources: {
      db: {
        url: url,
      },
    },
  });

  clientCache.set(url, client);
  return client;
}
