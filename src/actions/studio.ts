"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function banUser(userId: string, reason?: string) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      banned: true,
      bannedReason: reason || "Banned by Administrator",
    },
  });
  
  // Create audit log
  await prisma.auditLog.create({
    data: {
      userId,
      action: "USER_BANNED",
      status: "success",
      metadata: JSON.stringify({ reason }),
    },
  });

  revalidatePath("/dashboard/users");
}

export async function unbanUser(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      banned: false,
      bannedReason: null,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "USER_UNBANNED",
      status: "success",
    },
  });

  revalidatePath("/dashboard/users");
}

export async function suspendUser(userId: string, hours: number) {
  const suspendedUntil = new Date(Date.now() + hours * 60 * 60 * 1000);
  await prisma.user.update({
    where: { id: userId },
    data: { suspendedUntil },
  });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "USER_SUSPENDED",
      status: "success",
      metadata: JSON.stringify({ durationHours: hours }),
    },
  });

  revalidatePath("/dashboard/users");
}

export async function unsuspendUser(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { suspendedUntil: null },
  });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "USER_UNSUSPENDED",
      status: "success",
    },
  });

  revalidatePath("/dashboard/users");
}

export async function deleteUser(userId: string) {
  await prisma.user.delete({
    where: { id: userId },
  });
  revalidatePath("/dashboard/users");
}

export async function updateUserRole(userId: string, role: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "USER_ROLE_UPDATED",
      status: "success",
      metadata: JSON.stringify({ newRole: role }),
    },
  });

  revalidatePath("/dashboard/users");
}

export async function terminateSession(sessionId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  await prisma.session.delete({
    where: { id: sessionId },
  });

  if (session) {
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "SESSION_REVOKED",
        status: "success",
        metadata: JSON.stringify({ sessionId }),
      },
    });
  }

  revalidatePath("/dashboard/sessions");
}

export async function revokeAllSessions(userId: string) {
  await prisma.session.deleteMany({
    where: { userId },
  });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "ALL_SESSIONS_REVOKED",
      status: "success",
    },
  });

  revalidatePath("/dashboard/sessions");
}

export async function createApiKey(name: string, userId: string, scopes: string) {
  // Generate random API key token
  const token = `pk_live_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
  
  await prisma.apiKey.create({
    data: {
      name,
      key: token,
      userId,
      scopes,
    },
  });

  revalidatePath("/dashboard/api-keys");
  return token;
}

export async function revokeApiKey(keyId: string) {
  await prisma.apiKey.delete({
    where: { id: keyId },
  });
  revalidatePath("/dashboard/api-keys");
}

export async function blockIpAddress(ip: string, durationMin: number) {
  const blockedUntil = new Date(Date.now() + durationMin * 60 * 1000);
  
  await prisma.rateLimit.upsert({
    where: { key: ip },
    update: {
      limit: 0,
      points: 1,
      duration: durationMin * 60,
      blockedUntil,
    },
    create: {
      key: ip,
      limit: 0,
      points: 1,
      duration: durationMin * 60,
      blockedUntil,
    },
  });

  revalidatePath("/dashboard/api-keys");
  revalidatePath("/dashboard/security");
}

export async function unblockIpAddress(ip: string) {
  await prisma.rateLimit.delete({
    where: { key: ip },
  });
  revalidatePath("/dashboard/api-keys");
  revalidatePath("/dashboard/security");
}
