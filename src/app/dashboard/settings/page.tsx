import React from "react";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const workspaces = await prisma.workspace.findMany();

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Console Settings</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Configure profile properties, target workspace databases, and general console adjustments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workspace Connection String Profiles */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs uppercase tracking-wider font-bold text-muted-foreground pl-1">Workspace Connection String Profiles</h3>
          <div className="space-y-3">
            {workspaces.map((ws) => (
              <div
                key={ws.id}
                className="bg-card/25 backdrop-blur-xl border border-border/40 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <span className="font-semibold text-foreground text-sm">{ws.name}</span>
                  </div>
                  {ws.isActive && (
                    <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      Active
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Database Endpoint URL:</span>
                    <span className="font-mono text-foreground font-medium">{ws.dbUrl}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Redis Cache Connection:</span>
                    <span className="font-mono text-muted-foreground/90">{ws.redisUrl || "Mock Local Cache"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global policies */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs uppercase tracking-wider font-bold text-muted-foreground pl-1">Global Console Profile</h3>
          <div className="bg-card/25 backdrop-blur-xl border border-border/40 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/10">
                <span className="text-muted-foreground">Console Access Role:</span>
                <span className="font-semibold text-foreground capitalize">Owner/Admin</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/10">
                <span className="text-muted-foreground">Session Expiration:</span>
                <span className="font-semibold text-foreground">30 Days</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/10">
                <span className="text-muted-foreground">TOTP Authentication:</span>
                <span className="font-semibold text-indigo-400">Enforced</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Passkey login fallback:</span>
                <span className="font-semibold text-indigo-400">Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
