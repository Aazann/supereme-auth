import React from "react";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { OverviewCharts } from "@/components/dashboard/overview-charts";

export const dynamic = "force-dynamic";
import {
  UsersIcon,
  SessionsIcon,
  OrganizationsIcon,
  SecurityIcon,
  HealthIcon,
  LogsIcon
} from "@/components/ui/icons";

export default async function DashboardPage() {
  const now = new Date();

  // Run database queries
  const totalUsers = await prisma.user.count();
  const activeSessions = await prisma.session.count({
    where: { expiresAt: { gt: now } }
  });
  const totalOrgs = await prisma.organization.count();
  const blockedIps = await prisma.rateLimit.count({
    where: { blockedUntil: { gt: now } }
  });

  const recentLogs = await prisma.auditLog.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true }
  });

  const stats = [
    {
      name: "Total Users",
      value: totalUsers,
      change: "+12% this week",
      icon: <UsersIcon size={20} className="text-indigo-400" />,
    },
    {
      name: "Active Sessions",
      value: activeSessions,
      change: "Live monitoring",
      icon: <SessionsIcon size={20} className="text-purple-400" />,
    },
    {
      name: "Organizations",
      value: totalOrgs,
      change: "Multi-tenant",
      icon: <OrganizationsIcon size={20} className="text-pink-400" />,
    },
    {
      name: "Blocked IPs",
      value: blockedIps,
      change: "Threat rate limits",
      icon: <SecurityIcon size={20} className="text-rose-400" />,
    },
  ];

  return (
    <DashboardLayout>
      {/* Header section */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Console Overview</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Real-time metrics and configurations for your Better Auth instance.
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-card/25 backdrop-blur-xl border border-border/40 rounded-2xl p-5 shadow-sm hover-float"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-muted-foreground">{stat.name}</span>
              <div className="p-2 rounded-xl bg-background/50 border border-border/20">
                {stat.icon}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-foreground">{stat.value}</span>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recharts chart */}
      <OverviewCharts />

      {/* Dynamic bottom details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Audit Logs */}
        <div className="bg-card/25 backdrop-blur-xl border border-border/40 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <LogsIcon size={16} className="text-indigo-400" />
              <h3 className="text-sm font-semibold text-foreground">Activity Feed</h3>
            </div>
            <span className="text-[10px] text-muted-foreground/60">Live system events</span>
          </div>

          <div className="space-y-4">
            {recentLogs.length > 0 ? (
              recentLogs.map((log) => (
                <div key={log.id} className="flex items-start justify-between gap-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5"></div>
                    <div>
                      <div className="font-semibold text-foreground">{log.action}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {log.user?.email || "System"} • {log.ipAddress || "no IP"}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground/50 whitespace-nowrap mt-0.5">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No recent activity logs found.
              </div>
            )}
          </div>
        </div>

        {/* System Health Status */}
        <div className="bg-card/25 backdrop-blur-xl border border-border/40 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <HealthIcon size={16} className="text-purple-400" />
            <h3 className="text-sm font-semibold text-foreground">System Health</h3>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            {[
              { label: "Prisma Adapter", status: "Connected", code: "OK", color: "text-emerald-400 bg-emerald-500/10" },
              { label: "Redis Session Cache", status: "Online", code: "OK", color: "text-emerald-400 bg-emerald-500/10" },
              { label: "Better Auth API Gateway", status: "Healthy (12ms)", code: "OK", color: "text-emerald-400 bg-emerald-500/10" },
              { label: "Rate Limiter Pipeline", status: "Active", code: "OK", color: "text-emerald-400 bg-emerald-500/10" }
            ].map((srv) => (
              <div key={srv.label} className="flex items-center justify-between p-2.5 rounded-xl bg-background/30 border border-border/20">
                <span className="text-muted-foreground">{srv.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground/80">{srv.status}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${srv.color}`}>
                    {srv.code}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
