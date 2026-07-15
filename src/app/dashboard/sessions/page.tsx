import React from "react";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SessionsGrid } from "@/components/dashboard/sessions-grid";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  const sessions = await prisma.session.findMany({
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

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Session Audit Explorer</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Inspect active device sessions, geolocated IP origins, browser user-agents, and revoke auth tokens immediately.
        </p>
      </div>

      <SessionsGrid sessions={sessions} />
    </DashboardLayout>
  );
}
