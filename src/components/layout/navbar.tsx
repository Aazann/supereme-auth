"use client";

import React from "react";
import { CommandPalette } from "../command-palette";
import { SunIcon, MoonIcon } from "../ui/icons";
import { useTheme } from "../theme-provider";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-card/5 backdrop-blur-xl border-b border-border/40 z-20">
      {/* Breadcrumb or title */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground/60">BetterAuth Studio</span>
        <span className="text-muted-foreground/30">/</span>
        <span className="text-xs font-semibold text-foreground">Console</span>
      </div>

      {/* Right-side quick tools */}
      <div className="flex items-center gap-3">
        {/* Command Palette search trigger */}
        <CommandPalette />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-background/50 border border-border/40 hover:bg-background/80 text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-300"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <SunIcon size={16} className="rotate-0 scale-100 transition-all duration-300" />
          ) : (
            <MoonIcon size={16} className="rotate-0 scale-100 transition-all duration-300" />
          )}
        </button>

        {/* User avatar / Status placeholder */}
        <div className="flex items-center gap-2 pl-2 border-l border-border/30">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1.5px] shadow-sm">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-[10px] font-bold text-foreground">
              AD
            </div>
          </div>
          <div className="hidden md:block text-left">
            <div className="text-[11px] font-semibold text-foreground leading-none">Admin Dev</div>
            <div className="text-[9px] text-muted-foreground leading-none mt-0.5">Maintainer</div>
          </div>
        </div>
      </div>
    </header>
  );
}
