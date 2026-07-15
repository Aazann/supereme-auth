"use client";

import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { SearchIcon, CloseIcon, DashboardIcon, UsersIcon, SessionsIcon, SettingsIcon, MoonIcon, SunIcon } from "./ui/icons";
import { useTheme } from "./theme-provider";

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const commands: CommandItem[] = [
    {
      id: "nav-dash",
      title: "Go to Dashboard",
      category: "Navigation",
      icon: <DashboardIcon size={16} />,
      action: () => {
        router.push("/dashboard");
        setIsOpen(false);
      },
    },
    {
      id: "nav-users",
      title: "Manage Users",
      category: "Navigation",
      icon: <UsersIcon size={16} />,
      action: () => {
        router.push("/dashboard/users");
        setIsOpen(false);
      },
    },
    {
      id: "nav-sessions",
      title: "View Active Sessions",
      category: "Navigation",
      icon: <SessionsIcon size={16} />,
      action: () => {
        router.push("/dashboard/sessions");
        setIsOpen(false);
      },
    },
    {
      id: "action-theme",
      title: `Toggle Theme (Currently ${theme === "dark" ? "Dark" : "Light"})`,
      category: "Preferences",
      icon: theme === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />,
      action: () => {
        toggleTheme();
        setIsOpen(false);
      },
    },
    {
      id: "action-settings",
      title: "Open Settings",
      category: "Preferences",
      icon: <SettingsIcon size={16} />,
      action: () => {
        router.push("/dashboard/settings");
        setIsOpen(false);
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Search trigger button in Navbar */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground bg-muted/40 hover:bg-muted/60 border border-border/40 rounded-lg cursor-pointer transition-colors"
      >
        <SearchIcon size={14} />
        <span>Search...</span>
        <kbd className="hidden sm:inline-flex h-4 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg glass-panel rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              {/* Input container */}
              <div className="flex items-center gap-3 px-4 border-b border-border/30">
                <SearchIcon size={18} className="text-muted-foreground/60" />
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 py-4 bg-transparent border-0 outline-none text-sm text-foreground placeholder-muted-foreground/50 focus:ring-0 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md hover:bg-muted/40 text-muted-foreground/60 hover:text-foreground cursor-pointer transition-colors"
                >
                  <CloseIcon size={16} />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm rounded-lg hover:bg-primary/5 hover:text-foreground transition-colors cursor-pointer text-muted-foreground"
                    >
                      <span className="text-muted-foreground/70">{cmd.icon}</span>
                      <span className="flex-1 font-medium">{cmd.title}</span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50 bg-muted/30 px-1.5 py-0.5 rounded border border-border/20">
                        {cmd.category}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-muted-foreground">
                    No results found for &ldquo;{search}&rdquo;.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
