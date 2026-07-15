import React from "react";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export const dynamic = "force-dynamic";

export default async function LogsPage() {
  const logs = await prisma.auditLog.findMany({
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
    take: 30,
  });

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Audit Log Ledger</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Inspect security events, configuration updates, sign-in details, and raw action payloads.
        </p>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden shadow-sm border border-border/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/40 text-[10px] uppercase tracking-wider text-muted-foreground bg-background/25">
                <th className="px-6 py-4 font-bold">Timestamp</th>
                <th className="px-6 py-4 font-bold">Action</th>
                <th className="px-6 py-4 font-bold">Actor</th>
                <th className="px-6 py-4 font-bold">Device & IP</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4 font-semibold text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{log.action}</div>
                      {log.metadata && (
                        <div className="font-mono text-[9px] text-muted-foreground/80 mt-1 max-w-xs truncate" title={log.metadata}>
                          {log.metadata}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {log.user ? (
                        <div>
                          <div className="font-semibold text-foreground">{log.user.name}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{log.user.email}</div>
                        </div>
                      ) : (
                        "System Node"
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground/85">
                      <div>IP: {log.ipAddress || "::1"}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-xs">{log.userAgent || "Internal execution"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 text-[9px] font-bold rounded-md border ${
                          log.status === "success"
                            ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                            : "text-rose-500 bg-rose-500/10 border-rose-500/20"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    No audit logs available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
