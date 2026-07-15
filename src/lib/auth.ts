import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { admin, twoFactor, organization } from "better-auth/plugins";
import { passkey } from "@better-auth/passkey";
import { apiKey } from "@better-auth/api-key";

const getDatabaseProvider = () => {
  const dbUrl = process.env.DATABASE_URL || "";
  if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
    return "postgresql";
  }
  return "sqlite";
};

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: getDatabaseProvider(),
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    admin(),
    twoFactor(),
    passkey(),
    organization(),
    apiKey(),
  ],
  logger: {
    disabled: process.env.NODE_ENV === "test",
  },
});
export type Auth = typeof auth;
