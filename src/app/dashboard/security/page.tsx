import React from "react";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SecurityIcon, KeysIcon } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

export default async function SecurityPage() {
  const passkeys = await prisma.passkey.findMany({
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
  });

  const twoFactors = await prisma.twoFactor.findMany({
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
  });

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Security Auditing</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Monitor multi-factor auth adoption, WebAuthn passkey tokens, transport methods, and session policies.
        </p>
      </div>

      {/* Grid panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Passkeys */}
        <div className="bg-card/25 backdrop-blur-xl border border-border/40 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border/20 pb-3">
            <SecurityIcon size={16} className="text-indigo-400" />
            <h3 className="text-sm font-semibold text-foreground">WebAuthn Passkeys ({passkeys.length})</h3>
          </div>

          <div className="divide-y divide-border/20 max-h-[400px] overflow-y-auto pr-2">
            {passkeys.length > 0 ? (
              passkeys.map((pk) => (
                <div key={pk.id} className="py-3.5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-foreground">{pk.name || "Unnamed Passkey"}</span>
                    <span className="text-[10px] text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded border border-border/10">
                      {pk.deviceType === "single_device" ? "Platform Key" : "Cross-Platform Key"}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>User: {pk.user.name} ({pk.user.email})</span>
                    <span>Transports: {pk.transports || "internal"}</span>
                  </div>
                  <div className="flex gap-2 text-[9px] font-bold">
                    {pk.backedUp ? (
                      <span className="text-emerald-400 bg-emerald-500/10 px-1.5 rounded">Synced Backup</span>
                    ) : (
                      <span className="text-amber-400 bg-amber-500/10 px-1.5 rounded">Local Only</span>
                    )}
                    <span className="text-muted-foreground bg-muted/30 px-1.5 rounded">Counter: {pk.counter}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No passkey credentials registered.
              </div>
            )}
          </div>
        </div>

        {/* Two Factor Authentication */}
        <div className="bg-card/25 backdrop-blur-xl border border-border/40 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border/20 pb-3">
            <KeysIcon size={16} className="text-purple-400" />
            <h3 className="text-sm font-semibold text-foreground">Multi-Factor Auth (2FA) Adoption ({twoFactors.length})</h3>
          </div>

          <div className="divide-y divide-border/20 max-h-[400px] overflow-y-auto pr-2">
            {twoFactors.length > 0 ? (
              twoFactors.map((mfa) => (
                <div key={mfa.id} className="py-3.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-foreground">{mfa.user.name}</span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">{mfa.user.email}</span>
                  </div>
                  <div className="flex gap-2">
                    {mfa.enabled ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        TOTP Enabled
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-muted-foreground bg-muted/10 px-2 py-0.5 rounded border border-border/20">
                        Configuring
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No users have configured 2FA credentials.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
