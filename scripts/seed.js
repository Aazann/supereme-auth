/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("../src/generated/prisma");

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || "file:./dev.db"
});

async function main() {
  console.log("Seeding BetterAuth Studio database...");

  // 1. Clear existing data
  await prisma.$executeRawUnsafe("DELETE FROM RateLimit;");
  await prisma.$executeRawUnsafe("DELETE FROM AuditLog;");
  await prisma.$executeRawUnsafe("DELETE FROM ApiKey;");
  await prisma.$executeRawUnsafe("DELETE FROM TwoFactor;");
  await prisma.$executeRawUnsafe("DELETE FROM Passkey;");
  await prisma.$executeRawUnsafe("DELETE FROM Invitation;");
  await prisma.$executeRawUnsafe("DELETE FROM Member;");
  await prisma.$executeRawUnsafe("DELETE FROM Organization;");
  await prisma.$executeRawUnsafe("DELETE FROM Account;");
  await prisma.$executeRawUnsafe("DELETE FROM Session;");
  await prisma.$executeRawUnsafe("DELETE FROM User;");
  await prisma.$executeRawUnsafe("DELETE FROM StudioUser;");
  await prisma.$executeRawUnsafe("DELETE FROM Workspace;");

  // 2. Create Workspace
  await prisma.workspace.create({
    data: {
      name: "Default Local Workspace",
      dbUrl: "file:./dev.db",
      isActive: true,
    }
  });

  // 3. Create Studio User
  await prisma.studioUser.create({
    data: {
      email: "admin@better-auth.com",
      passwordHash: "$2a$10$T89xW7D6r6.4Xv8gKz2nSuH4g5P4EaM9H.bE/qgB6mR/7D2K6G22u", // pbkdf2 or bcrypt mock
      name: "Admin Dev",
      role: "admin",
    }
  });

  // 4. Create target Users
  const userSpecs = [
    { name: "John Doe", email: "john@example.com", role: "admin", banned: false },
    { name: "Jane Smith", email: "jane@example.com", role: "user", banned: false },
    { name: "Alice Johnson", email: "alice@example.com", role: "user", banned: true, bannedReason: "Violated terms of service (Spamming API)" },
    { name: "Bob Miller", email: "bob@example.com", role: "user", banned: false, suspendedUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) }, // Suspended for 3 days
    { name: "Charlie Brown", email: "charlie@example.com", role: "member", banned: false },
    { name: "David Wilson", email: "david@example.com", role: "user", banned: false },
    { name: "Eva Carter", email: "eva@example.com", role: "user", banned: false },
    { name: "Frank Sinatra", email: "frank@example.com", role: "admin", banned: false },
    { name: "Grace Hopper", email: "grace@example.com", role: "user", banned: false },
    { name: "Henry Cavill", email: "henry@example.com", role: "user", banned: false },
  ];

  const createdUsers = [];
  for (const spec of userSpecs) {
    const user = await prisma.user.create({
      data: {
        name: spec.name,
        email: spec.email,
        role: spec.role,
        banned: spec.banned,
        bannedReason: spec.bannedReason,
        suspendedUntil: spec.suspendedUntil,
        emailVerified: true,
      }
    });
    createdUsers.push(user);
  }

  // 5. Create Sessions
  const sessionsData = [
    {
      userId: createdUsers[0].id,
      token: "session-token-john-1",
      ipAddress: "8.8.8.8",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      riskScore: 0.1,
      country: "United States",
      browser: "Chrome",
      os: "macOS",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      userId: createdUsers[1].id,
      token: "session-token-jane-1",
      ipAddress: "82.165.10.15",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
      riskScore: 0.25,
      country: "Germany",
      browser: "Safari (Mobile)",
      os: "iOS",
      expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    },
    {
      userId: createdUsers[1].id,
      token: "session-token-jane-2",
      ipAddress: "198.51.100.42",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
      riskScore: 0.65, // High risk due to separate location
      country: "Japan",
      browser: "Edge",
      os: "Windows",
      expiresAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Expired 2 hours ago
    },
    {
      userId: createdUsers[4].id,
      token: "session-token-charlie-1",
      ipAddress: "109.244.12.8",
      userAgent: "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
      riskScore: 0.05,
      country: "United Kingdom",
      browser: "Chrome (Mobile)",
      os: "Android",
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const sData of sessionsData) {
    await prisma.session.create({ data: sData });
  }

  // 6. Create Organizations
  const org1 = await prisma.organization.create({
    data: {
      name: "Stripe Team",
      slug: "stripe",
    }
  });

  const org2 = await prisma.organization.create({
    data: {
      name: "Linear Corp",
      slug: "linear",
    }
  });

  // Connect members
  await prisma.member.create({
    data: {
      organizationId: org1.id,
      userId: createdUsers[0].id,
      role: "owner",
    }
  });

  await prisma.member.create({
    data: {
      organizationId: org1.id,
      userId: createdUsers[1].id,
      role: "member",
    }
  });

  await prisma.member.create({
    data: {
      organizationId: org2.id,
      userId: createdUsers[0].id,
      role: "owner",
    }
  });

  // Invitations
  await prisma.invitation.create({
    data: {
      organizationId: org1.id,
      email: "invitee@example.com",
      role: "member",
      status: "pending",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      inviterId: createdUsers[0].id,
    }
  });

  // 7. Passkeys
  await prisma.passkey.create({
    data: {
      name: "MacBook TouchID",
      userId: createdUsers[0].id,
      credentialID: "cred-macbook-john",
      publicKey: "mock-public-key-john",
      deviceType: "single_device",
      backedUp: true,
      transports: "internal",
    }
  });

  await prisma.passkey.create({
    data: {
      name: "YubiKey 5C",
      userId: createdUsers[0].id,
      credentialID: "cred-yubikey-john",
      publicKey: "mock-public-key-yubikey-john",
      deviceType: "single_device",
      backedUp: false,
      transports: "usb,nfc",
    }
  });

  // 8. TwoFactor
  await prisma.twoFactor.create({
    data: {
      userId: createdUsers[0].id,
      secret: "JBSWY3DPEHPK3PXP",
      backupCodes: JSON.stringify(["CODE1", "CODE2", "CODE3"]),
      enabled: true,
    }
  });

  // 9. API Keys
  await prisma.apiKey.create({
    data: {
      name: "Production Client SDK",
      key: "pk_live_51NvC8A8b21...x92K",
      userId: createdUsers[0].id,
      scopes: "read,write",
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      lastUsedAt: new Date(),
    }
  });

  await prisma.apiKey.create({
    data: {
      name: "CI/CD Test Key",
      key: "pk_test_51NvC8A8b21...t72A",
      userId: createdUsers[0].id,
      scopes: "read",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }
  });

  // 10. Audit Logs
  const logs = [
    { userId: createdUsers[0].id, action: "USER_SIGN_IN", status: "success", ipAddress: "8.8.8.8", userAgent: "Chrome/macOS" },
    { userId: createdUsers[1].id, action: "USER_PASSWORD_RESET", status: "success", ipAddress: "82.165.10.15", userAgent: "Safari/iOS" },
    { userId: createdUsers[2].id, action: "USER_SIGN_IN_FAILED", status: "failure", ipAddress: "198.51.100.99", userAgent: "Firefox/Linux", metadata: JSON.stringify({ reason: "Incorrect password attempt limit reached" }) },
    { userId: createdUsers[0].id, action: "API_KEY_CREATED", status: "success", ipAddress: "8.8.8.8", userAgent: "Chrome/macOS" },
  ];

  for (const log of logs) {
    await prisma.auditLog.create({ data: log });
  }

  // 11. Rate Limits
  await prisma.rateLimit.create({
    data: {
      key: "198.51.100.99",
      limit: 10,
      points: 12,
      duration: 60,
      blockedUntil: new Date(Date.now() + 15 * 60 * 1000), // Blocked for 15 mins
    }
  });

  console.log("Database seeded successfully!");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Error seeding database:", e);
  process.exit(1);
});
