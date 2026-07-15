"use client";

import React, { useState } from "react";
import { SpinnerIcon } from "../ui/icons";

interface ApiEndpoint {
  method: "GET" | "POST";
  path: string;
  summary: string;
  description: string;
  params?: { name: string; type: string; required: boolean; placeholder: string }[];
  requestBody?: Record<string, string>;
}

export function ApiDocsPanel() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  
  // Inputs for Try it out
  const [userId, setUserId] = useState("john-doe-uuid");
  const [banReason, setBanReason] = useState("Violation of usage terms");
  const [sessionId, setSessionId] = useState("active-session-token");

  const endpoints: ApiEndpoint[] = [
    {
      method: "GET",
      path: "/api/v1/health",
      summary: "System Health Diagnostics",
      description: "Pings database connection engines and gathers runtime process statistics.",
    },
    {
      method: "POST",
      path: "/api/v1/users/ban",
      summary: "Ban User Account",
      description: "Applies a persistent administrative ban and records auditing logs.",
      params: [
        { name: "userId", type: "string", required: true, placeholder: "e.g. user-uuid-123" },
        { name: "reason", type: "string", required: false, placeholder: "e.g. Terms violation" }
      ],
      requestBody: {
        userId: "john-doe-uuid",
        reason: "Violation of usage terms",
      }
    },
    {
      method: "POST",
      path: "/api/v1/sessions/revoke",
      summary: "Revoke Device Session",
      description: "Invalidates active login sessions, logging out user browser credentials.",
      params: [
        { name: "sessionId", type: "string", required: true, placeholder: "e.g. session-uuid-456" }
      ],
      requestBody: {
        sessionId: "active-session-token",
      }
    }
  ];

  const handleTestApi = async (endpoint: ApiEndpoint) => {
    setLoading(true);
    setResponse(null);

    try {
      let res;
      if (endpoint.method === "GET") {
        res = await fetch(endpoint.path);
      } else {
        const body: Record<string, string> = {};
        if (endpoint.path.includes("ban")) {
          body.userId = userId;
          body.reason = banReason;
        } else if (endpoint.path.includes("revoke")) {
          body.sessionId = sessionId;
        }
        
        res = await fetch(endpoint.path, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
      }

      const json = await res.json();
      setResponse(JSON.stringify(json, null, 2));
    } catch {
      setResponse(JSON.stringify({ error: "Failed to connect to API endpoint." }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const active = endpoints[selectedEndpoint];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Endpoints navigation */}
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-xs uppercase tracking-wider font-bold text-muted-foreground pl-1">Rest endpoints</h3>
        <div className="space-y-2">
          {endpoints.map((ep, idx) => (
            <button
              key={ep.path}
              onClick={() => {
                setSelectedEndpoint(idx);
                setResponse(null);
              }}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                selectedEndpoint === idx
                  ? "bg-primary/10 border-indigo-500/30 text-foreground"
                  : "bg-card/25 border-border/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    ep.method === "GET"
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                      : "text-indigo-400 bg-indigo-500/10 border border-indigo-500/20"
                  }`}
                >
                  {ep.method}
                </span>
                <span className="font-mono text-xs font-semibold text-foreground">{ep.path}</span>
              </div>
              <p className="text-[10px] text-muted-foreground/80 mt-2 font-medium">{ep.summary}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Endpoint Playground console */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-card/25 backdrop-blur-xl border border-border/40 rounded-2xl p-6 shadow-sm space-y-5">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  active.method === "GET"
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                    : "text-indigo-400 bg-indigo-500/10 border border-indigo-500/20"
                }`}
              >
                {active.method}
              </span>
              <span className="font-mono text-sm font-semibold text-foreground">{active.path}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{active.description}</p>
          </div>

          {/* Parameters & Input settings */}
          {active.params && (
            <div className="space-y-4 border-t border-border/20 pt-4">
              <h4 className="text-[10px] uppercase font-bold text-muted-foreground">Request Parameters</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {active.path.includes("ban") && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted-foreground/80 font-semibold pl-1">userId (required)</label>
                      <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-background/50 border border-border/40 outline-none rounded-xl focus:border-indigo-500/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted-foreground/80 font-semibold pl-1">reason (optional)</label>
                      <input
                        type="text"
                        value={banReason}
                        onChange={(e) => setBanReason(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-background/50 border border-border/40 outline-none rounded-xl focus:border-indigo-500/50"
                      />
                    </div>
                  </>
                )}

                {active.path.includes("revoke") && (
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] text-muted-foreground/80 font-semibold pl-1">sessionId (required)</label>
                    <input
                      type="text"
                      value={sessionId}
                      onChange={(e) => setSessionId(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-background/50 border border-border/40 outline-none rounded-xl focus:border-indigo-500/50"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3 border-t border-border/20 pt-4">
            <button
              onClick={() => handleTestApi(active)}
              disabled={loading}
              className="px-4 py-2.5 bg-foreground text-background font-semibold rounded-xl text-xs hover:bg-foreground/90 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {loading ? <SpinnerIcon size={12} /> : "Send Request"}
            </button>
            <a
              href="/api/v1/openapi.json"
              target="_blank"
              className="px-4 py-2.5 bg-background/50 border border-border/40 hover:bg-background/80 text-foreground font-semibold rounded-xl text-xs transition-colors flex items-center justify-center cursor-pointer"
            >
              OpenAPI JSON
            </a>
          </div>

          {/* Response Console output */}
          {response && (
            <div className="space-y-2 border-t border-border/20 pt-4 animate-fade-in">
              <h4 className="text-[10px] uppercase font-bold text-muted-foreground">Response Body</h4>
              <pre className="p-4 bg-background/60 border border-border/30 rounded-xl overflow-x-auto font-mono text-[11px] text-indigo-300 leading-relaxed shadow-inner max-h-72">
                {response}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
