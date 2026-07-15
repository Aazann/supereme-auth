"use client";

import React, { useState, useTransition } from "react";
import { terminateSession, revokeAllSessions } from "@/actions/studio";

interface SessionWithUser {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  riskScore: number;
  country: string | null;
  browser: string | null;
  os: string | null;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
}

interface SessionsGridProps {
  sessions: SessionWithSpecs[];
}

type SessionWithSpecs = Omit<SessionWithUser, "expiresAt" | "createdAt"> & {
  expiresAt: string | Date;
  createdAt: string | Date;
};

export function SessionsGrid({ sessions }: SessionsGridProps) {
  const [filter, setFilter] = useState<"all" | "active" | "expired">("active");
  const [, startTransition] = useTransition();

  const handleRevoke = (sessionId: string) => {
    if (confirm("Are you sure you want to terminate this session? The user will be logged out of this device.")) {
      startTransition(async () => {
        await terminateSession(sessionId);
      });
    }
  };

  const handleRevokeAll = (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to revoke all active sessions for ${userName}?`)) {
      startTransition(async () => {
        await revokeAllSessions(userId);
      });
    }
  };

  const isExpired = (session: SessionWithSpecs) => {
    return new Date(session.expiresAt) < new Date();
  };

  const filteredSessions = sessions.filter((s) => {
    const expired = isExpired(s);
    if (filter === "active") return !expired;
    if (filter === "expired") return expired;
    return true;
  });

  const getRiskLabel = (score: number) => {
    if (score < 0.2) return { text: "Low Risk", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" };
    if (score < 0.6) return { text: "Medium Risk", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
    return { text: "High Risk", color: "text-rose-500 bg-rose-500/10 border-rose-500/20" };
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {["active", "expired", "all"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl capitalize cursor-pointer transition-all ${
                filter === f
                  ? "bg-primary text-primary-foreground border border-primary/20"
                  : "bg-card/25 text-muted-foreground hover:text-foreground border border-border/40"
              }`}
            >
              {f} Sessions
            </button>
          ))}
        </div>
      </div>

      {/* Grid Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-sm border border-border/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 text-[10px] uppercase tracking-wider text-muted-foreground bg-background/25">
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Device / User Agent</th>
                <th className="px-6 py-4 font-bold">Location & IP</th>
                <th className="px-6 py-4 font-bold">Security Score</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20 text-xs">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session) => {
                  const risk = getRiskLabel(session.riskScore);
                  const expired = isExpired(session);
                  return (
                    <tr key={session.id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">{session.user.name}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{session.user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">
                          {session.browser || "Unknown Browser"} ({session.os || "Unknown OS"})
                        </div>
                        <div className="text-[10px] text-muted-foreground/80 mt-0.5 truncate max-w-xs" title={session.userAgent || ""}>
                          {session.userAgent || "No Agent Header"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">{session.country || "Localhost"}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">IP: {session.ipAddress || "::1"}</div>
                      </td>
                      <td className="px-6 py-4">
                        {expired ? (
                          <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-muted/20 text-muted-foreground border border-border/30">
                            Expired
                          </span>
                        ) : (
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md border ${risk.color}`}>
                            {risk.text}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {!expired && (
                          <button
                            onClick={() => handleRevokeAll(session.userId, session.user.name)}
                            className="px-2.5 py-1 rounded-lg bg-background/40 hover:bg-background/80 border border-border/30 text-muted-foreground hover:text-foreground cursor-pointer transition-colors text-[10px]"
                          >
                            Revoke All
                          </button>
                        )}
                        <button
                          onClick={() => handleRevoke(session.id)}
                          className="px-2.5 py-1 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 cursor-pointer transition-colors text-[10px]"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    No sessions matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
