"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "Jul 09", signups: 12, sessions: 45 },
  { date: "Jul 10", signups: 19, sessions: 64 },
  { date: "Jul 11", signups: 15, sessions: 52 },
  { date: "Jul 12", signups: 24, sessions: 78 },
  { date: "Jul 13", signups: 32, sessions: 91 },
  { date: "Jul 14", signups: 28, sessions: 85 },
  { date: "Jul 15", signups: 42, sessions: 112 },
];

export function OverviewCharts() {
  return (
    <div className="w-full h-80 bg-card/25 backdrop-blur-xl border border-border/40 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Signups & Activity</h3>
          <p className="text-[11px] text-muted-foreground">Daily registrations and session peaks.</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-indigo-400">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            <span>Signups</span>
          </div>
          <div className="flex items-center gap-1.5 text-purple-400">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span>Sessions</span>
          </div>
        </div>
      </div>

      <div className="w-full h-[calc(100%-40px)]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <defs>
              <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c084fc" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              stroke="currentColor"
              className="text-[10px] text-muted-foreground/60"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="currentColor"
              className="text-[10px] text-muted-foreground/60"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(10, 10, 12, 0.8)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                fontSize: "12px",
                color: "#f8fafc",
              }}
            />
            <Area
              type="monotone"
              dataKey="signups"
              stroke="#818cf8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSignups)"
            />
            <Area
              type="monotone"
              dataKey="sessions"
              stroke="#c084fc"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSessions)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
