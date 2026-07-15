"use client";

import React from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background font-sans">
      {/* Ambient background blur glows */}
      <div className="ambient-glow" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Scrollable Content Pane */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
