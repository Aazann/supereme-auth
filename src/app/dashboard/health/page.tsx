import React from "react";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export const dynamic = "force-dynamic";

async function getDbLatency() {
  const startTime = Date.now();
  await prisma.$queryRawUnsafe("SELECT 1;");
  return Date.now() - startTime;
}

export default async function HealthPage() {
  // Test DB latency using our external helper function
  const latency = await getDbLatency();

  // Retrieve process info
  const memoryUsage = process.memoryUsage();
  const nodeVersion = process.version;
  const platform = process.platform;

  const services = [
    { name: "Prisma Schema Engine", status: "Healthy", ping: `${latency}ms`, details: "Connected to SQLite database file" },
    { name: "Node.js Core Server", status: "Healthy", ping: nodeVersion, details: `Running on platform: ${platform}` },
    { name: "Memory Allocator (RSS)", status: "Active", ping: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`, details: "Resident set size in memory" },
    { name: "Heaped Allocated Memory", status: "Active", ping: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`, details: `Max Limit: ${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB` },
  ];

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">System Health</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Perform checkups on engine memory, connection pings, and backend platform processes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((srv) => (
          <div
            key={srv.name}
            className="bg-card/25 backdrop-blur-xl border border-border/40 rounded-2xl p-5 shadow-sm space-y-4 hover-float"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{srv.name}</span>
              <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                {srv.status}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-foreground">{srv.ping}</span>
            </div>
            <p className="text-[10px] text-muted-foreground/80 font-medium">
              {srv.details}
            </p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
