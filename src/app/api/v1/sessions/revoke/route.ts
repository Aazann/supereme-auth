import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: sessionId" },
        { status: 400 }
      );
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Active session not found" },
        { status: 444 }
      );
    }

    await prisma.session.delete({
      where: { id: sessionId },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "API_SESSION_REVOKED",
        status: "success",
        metadata: JSON.stringify({ sessionId }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Session invalidated successfully",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to revoke active token" },
      { status: 500 }
    );
  }
}
