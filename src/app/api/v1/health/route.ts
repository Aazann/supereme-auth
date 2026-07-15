import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const startTime = Date.now();
    await prisma.$queryRawUnsafe("SELECT 1;");
    const dbLatency = Date.now() - startTime;

    const memoryUsage = process.memoryUsage();

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: "connected",
          latency: `${dbLatency}ms`,
        },
        process: {
          uptime: `${Math.round(process.uptime())}s`,
          memoryRSS: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        },
      },
    });
  } catch {
    return NextResponse.json(
      { status: "unhealthy", error: "Database query failed" },
      { status: 500 }
    );
  }
}
