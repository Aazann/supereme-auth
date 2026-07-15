"use client";

import React, { useState, useTransition } from "react";
import { createApiKey, revokeApiKey, blockIpAddress, unblockIpAddress } from "@/actions/studio";
import { KeysIcon, SecurityIcon, SpinnerIcon, CheckIcon, CopyIcon } from "../ui/icons";

interface ApiKeyWithUser {
  id: string;
  name: string;
  key: string;
  userId: string;
  scopes: string;
  expiresAt: Date | null;
  lastUsedAt: Date | null;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
}

interface RateLimitSpec {
  id: string;
  key: string;
  limit: number;
  points: number;
  duration: number;
  blockedUntil: Date | null;
}

interface ApiKeysGridProps {
  apiKeys: ApiKeyWithSpecs[];
  rateLimits: RateLimitWithSpecs[];
  users: { id: string; name: string; email: string }[];
}

type ApiKeyWithSpecs = Omit<ApiKeyWithUser, "createdAt" | "expiresAt" | "lastUsedAt"> & {
  createdAt: string | Date;
  expiresAt: string | Date | null;
  lastUsedAt: string | Date | null;
};

type RateLimitWithSpecs = Omit<RateLimitSpec, "blockedUntil"> & {
  blockedUntil: string | Date | null;
};

export function ApiKeysGrid({ apiKeys, rateLimits, users }: ApiKeysGridProps) {
  const [isPending, startTransition] = useTransition();

  // API Key Form States
  const [keyName, setKeyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id || "");
  const [scopes, setScopes] = useState("read");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // IP Block Form States
  const [ipAddress, setIpAddress] = useState("");
  const [blockDuration, setBlockDuration] = useState(15); // minutes

  const handleCreateKey = () => {
    if (!keyName) return alert("Please enter key name.");
    startTransition(async () => {
      const token = await createApiKey(keyName, selectedUserId, scopes);
      setGeneratedKey(token);
      setKeyName("");
    });
  };

  const handleRevokeKey = (keyId: string) => {
    if (confirm("Are you sure you want to revoke this API key? External clients using it will be blocked.")) {
      startTransition(async () => {
        await revokeApiKey(keyId);
      });
    }
  };

  const handleBlockIp = () => {
    if (!ipAddress) return alert("Please enter IP address.");
    startTransition(async () => {
      await blockIpAddress(ipAddress, blockDuration);
      setIpAddress("");
    });
  };

  const handleUnblockIp = (ip: string) => {
    startTransition(async () => {
      await unblockIpAddress(ip);
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left panel: Keys List & Key Generator */}
      <div className="lg:col-span-2 space-y-6">
        {/* Key Generator */}
        <div className="bg-card/25 backdrop-blur-xl border border-border/40 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border/20 pb-3">
            <KeysIcon size={16} className="text-indigo-400" />
            <h3 className="text-sm font-semibold text-foreground">Generate Developer API Key</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground pl-1">Key Name</label>
              <input
                type="text"
                placeholder="e.g. Production Key"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-background/50 border border-border/40 outline-none rounded-xl focus:border-indigo-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground pl-1">Assign User</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-background/50 border border-border/40 outline-none rounded-xl focus:border-indigo-500/50"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email.substring(0, 8)}...)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground pl-1">Scopes</label>
              <select
                value={scopes}
                onChange={(e) => setScopes(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-background/50 border border-border/40 outline-none rounded-xl focus:border-indigo-500/50"
              >
                <option value="read">Read Only</option>
                <option value="read,write">Read & Write</option>
                <option value="read,write,delete">Full Control</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleCreateKey}
            disabled={isPending}
            className="px-4 py-2 bg-foreground text-background font-semibold rounded-xl text-xs hover:bg-foreground/90 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isPending ? <SpinnerIcon size={12} /> : "Generate Secret Token"}
          </button>

          {/* Generated key alert */}
          {generatedKey && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2 relative animate-fade-in text-xs">
              <div className="font-semibold text-emerald-400">API Key Created Successfully</div>
              <p className="text-[11px] text-muted-foreground">
                Copy this key now. You will not be able to see it again.
              </p>
              <div className="flex items-center justify-between gap-3 bg-background/50 border border-border/20 p-2.5 rounded-lg font-mono">
                <span className="truncate text-foreground select-all">{generatedKey}</span>
                <button
                  onClick={() => copyToClipboard(generatedKey)}
                  className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {copied ? <CheckIcon size={14} className="text-emerald-400" /> : <CopyIcon size={14} />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Keys List */}
        <div className="bg-card/25 backdrop-blur-xl border border-border/40 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Active API Keys</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/20 text-[10px] uppercase font-bold text-muted-foreground bg-background/10">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Key Suffix</th>
                  <th className="px-4 py-3">Scopes</th>
                  <th className="px-4 py-3">Last Used</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {apiKeys.length > 0 ? (
                  apiKeys.map((key) => (
                    <tr key={key.id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-4 py-3 font-semibold text-foreground">{key.name}</td>
                      <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">
                        {key.key.substring(0, 12)}...
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-1.5 py-0.5 rounded bg-muted/40 text-[9px] uppercase font-semibold border border-border/10 text-muted-foreground">
                          {key.scopes}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground/80">
                        {key.lastUsedAt
                          ? new Date(key.lastUsedAt).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleRevokeKey(key.id)}
                          className="hover:text-rose-500 font-semibold cursor-pointer transition-colors"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No active API keys found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right panel: IP Rate Limits & Blocks */}
      <div className="lg:col-span-1 space-y-6">
        {/* Block IP Form */}
        <div className="bg-card/25 backdrop-blur-xl border border-border/40 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border/20 pb-3">
            <SecurityIcon size={16} className="text-rose-400" />
            <h3 className="text-sm font-semibold text-foreground">Block IP Address</h3>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground">IP Address</label>
              <input
                type="text"
                placeholder="e.g. 198.51.100.99"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-background/50 border border-border/40 outline-none rounded-xl focus:border-indigo-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground">Duration</label>
              <select
                value={blockDuration}
                onChange={(e) => setBlockDuration(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-background/50 border border-border/40 outline-none rounded-xl focus:border-indigo-500/50"
              >
                <option value={15}>15 Minutes</option>
                <option value={60}>1 Hour</option>
                <option value={1440}>24 Hours</option>
              </select>
            </div>

            <button
              onClick={handleBlockIp}
              disabled={isPending}
              className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isPending ? <SpinnerIcon size={12} /> : "Block Traffic"}
            </button>
          </div>
        </div>

        {/* Blocklist display */}
        <div className="bg-card/25 backdrop-blur-xl border border-border/40 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Active IP Blocks</h3>
          <div className="space-y-3">
            {rateLimits.length > 0 ? (
              rateLimits.map((block) => (
                <div
                  key={block.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-background/40 border border-border/20 text-xs"
                >
                  <div>
                    <div className="font-semibold text-foreground">{block.key}</div>
                    <div className="text-[9px] text-muted-foreground mt-0.5">
                      Until:{" "}
                      {block.blockedUntil
                        ? new Date(block.blockedUntil).toLocaleTimeString()
                        : "Forever"}
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnblockIp(block.key)}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                  >
                    Unblock
                  </button>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No active IP blocks.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
