import React from "react";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ApiKeysGrid } from "@/components/dashboard/api-keys-grid";

export const dynamic = "force-dynamic";

export default async function ApiKeysPage() {
  // Fetch API Keys
  const apiKeys = await prisma.apiKey.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch Rate Limits / Blocked IPs
  const rateLimits = await prisma.rateLimit.findMany({
    orderBy: {
      blockedUntil: "desc",
    },
  });

  // Fetch simple user list to populate selector
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Developer APIs & Rate Limits</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Generate API keys for external applications, toggle permission scopes, and block malicious network traffic using rate limit limits.
        </p>
      </div>

      <ApiKeysGrid apiKeys={apiKeys} rateLimits={rateLimits} users={users} />
    </DashboardLayout>
  );
}
