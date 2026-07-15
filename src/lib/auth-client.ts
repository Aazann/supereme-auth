import { createAuthClient } from "better-auth/client";
import { adminClient, twoFactorClient, organizationClient } from "better-auth/client/plugins";
import { passkeyClient } from "@better-auth/passkey/client";
import { apiKeyClient } from "@better-auth/api-key/client";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : undefined,
  plugins: [
    adminClient(),
    twoFactorClient(),
    passkeyClient(),
    organizationClient(),
    apiKeyClient(),
  ],
});

export const { useSession, signIn, signOut } = authClient;
