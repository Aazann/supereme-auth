import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        banned: true,
        suspendedUntil: true,
        createdAt: true,
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

    return NextResponse.json({
      success: true,
      users: users.map((user) => ({
        ...user,
        sessionsCount: user.sessions.length,
        sessions: undefined,
      })),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to query users database" },
      { status: 500 }
    );
  }
}
