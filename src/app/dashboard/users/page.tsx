import React from "react";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { UsersGrid } from "@/components/dashboard/users-grid";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: {
      sessions: {
        select: {
          id: true,
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
        <h1 className="text-xl font-bold tracking-tight text-foreground">User Management</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Search, audit, ban, suspend, or update permissions for any registered user.
        </p>
      </div>

      <UsersGrid users={users} />
    </DashboardLayout>
  );
}
