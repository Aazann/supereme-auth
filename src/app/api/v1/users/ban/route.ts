import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { userId, reason } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: userId" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 444 }
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        banned: true,
        bannedReason: reason || "Banned via Admin API",
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "API_USER_BANNED",
        status: "success",
        metadata: JSON.stringify({ reason }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `User ${user.name} banned successfully`,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to perform administrative ban" },
      { status: 500 }
    );
  }
}
