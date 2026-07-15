"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardIcon,
  UsersIcon,
  SessionsIcon,
  SecurityIcon,
  OrganizationsIcon,
  KeysIcon,
  HealthIcon,
  LogsIcon,
  SettingsIcon,
  ChevronDownIcon,
  OrganizationsIcon as WorkspaceIcon
} from "../ui/icons";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export function Sidebar() {
  const pathname = usePathname();
  const [workspace, setWorkspace] = useState("Development");
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);

  const navigation: SidebarItem[] = [
    { name: "Overview", href: "/dashboard", icon: <DashboardIcon size={18} /> },
    { name: "Users", href: "/dashboard/users", icon: <UsersIcon size={18} /> },
    { name: "Sessions", href: "/dashboard/sessions", icon: <SessionsIcon size={18} /> },
    { name: "Organizations", href: "/dashboard/organizations", icon: <OrganizationsIcon size={18} /> },
    { name: "API Keys", href: "/dashboard/api-keys", icon: <KeysIcon size={18} /> },
    { name: "Security", href: "/dashboard/security", icon: <SecurityIcon size={18} /> },
    { name: "System Health", href: "/dashboard/health", icon: <HealthIcon size={18} /> },
    { name: "Audit Logs", href: "/dashboard/logs", icon: <LogsIcon size={18} /> },
    { name: "Settings", href: "/dashboard/settings", icon: <SettingsIcon size={18} /> },
  ];

  return (
    <div className="w-64 flex flex-col h-full bg-card/10 backdrop-blur-xl border-r border-border/40 p-4">
      {/* Workspace Switcher */}
      <div className="relative mb-6">
        <button
          onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
          className="w-full flex items-center justify-between gap-3 px-3 py-2 text-sm font-semibold rounded-xl bg-background/50 border border-border/40 hover:bg-background/80 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <WorkspaceIcon size={12} />
            </div>
            <span className="truncate">{workspace}</span>
          </div>
          <ChevronDownIcon size={14} className="text-muted-foreground" />
        </button>

        {isWorkspaceDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 z-30 glass-panel rounded-xl py-1.5 shadow-xl border border-border/30 overflow-hidden">
            {["Development", "Staging", "Production"].map((name) => (
              <button
                key={name}
                onClick={() => {
                  setWorkspace(name);
                  setIsWorkspaceDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs hover:bg-primary/5 transition-colors cursor-pointer text-muted-foreground hover:text-foreground font-medium"
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* App Branding */}
      <div className="px-3 mb-6">
        <div className="text-xs uppercase tracking-widest text-muted-foreground/50 font-bold">
          BetterAuth
        </div>
        <div className="text-lg font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Studio
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                isActive
                  ? "bg-primary/10 text-primary-foreground border-l-2 border-indigo-500 shadow-[inset_1px_0_0_rgba(255,255,255,0.05)]"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
              }`}
            >
              <span className={isActive ? "text-indigo-400" : "text-muted-foreground/70"}>
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="mt-auto px-3 py-2 rounded-xl bg-background/30 border border-border/20 text-[10px] text-muted-foreground/75 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Database Linked</span>
        </div>
        <span className="font-mono text-muted-foreground/40">v0.1.0</span>
      </div>
    </div>
  );
}
