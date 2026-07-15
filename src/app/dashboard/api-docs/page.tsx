import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ApiDocsPanel } from "@/components/dashboard/api-docs-panel";

export const dynamic = "force-dynamic";

export default function ApiDocsPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Interactive API Documentation</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review paths, schemas, scopes, and test REST operations against the database using our live console playground.
        </p>
      </div>

      <ApiDocsPanel />
    </DashboardLayout>
  );
}
