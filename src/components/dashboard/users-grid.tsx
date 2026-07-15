"use client";

import React, { useState, useTransition } from "react";
import {
  banUser,
  unbanUser,
  suspendUser,
  unsuspendUser,
  deleteUser,
  updateUserRole
} from "@/actions/studio";
import { BanIcon, SecurityIcon, UsersIcon, CloseIcon, SpinnerIcon } from "../ui/icons";

interface UserWithSessions {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean;
  bannedReason: string | null;
  suspendedUntil: Date | null;
  createdAt: Date;
  sessions: { id: string }[];
}

interface UsersGridProps {
  users: UserWithSpecs[];
}

// Convert Date types safely
type UserWithSpecs = Omit<UserWithSessions, "createdAt" | "suspendedUntil"> & {
  createdAt: string | Date;
  suspendedUntil: string | Date | null;
};

export function UsersGrid({ users }: UsersGridProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, banned, suspended
  const [isPending, startTransition] = useTransition();

  // Modal control states
  const [activeUser, setActiveUser] = useState<UserWithSpecs | null>(null);
  const [modalType, setModalType] = useState<"ban" | "suspend" | "role" | null>(null);
  
  // Form input states
  const [banReason, setBanReason] = useState("");
  const [suspendHours, setSuspendHours] = useState(24);
  const [selectedRole, setSelectedRole] = useState("user");

  const handleAction = (actionFn: () => Promise<void>) => {
    startTransition(async () => {
      try {
        await actionFn();
        closeModal();
      } catch {
        alert("Action failed. Please try again.");
      }
    });
  };

  const closeModal = () => {
    setActiveUser(null);
    setModalType(null);
    setBanReason("");
    setSuspendHours(24);
  };

  const getStatus = (user: UserWithSpecs) => {
    if (user.banned) return { text: "Banned", color: "text-rose-500 bg-rose-500/10 border-rose-500/20" };
    if (user.suspendedUntil && new Date(user.suspendedUntil) > new Date()) {
      return { text: "Suspended", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
    }
    return { text: "Active", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" };
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const status = getStatus(user).text.toLowerCase();
    const matchesFilter = filter === "all" || status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-md px-4 py-2.5 text-xs bg-card/20 backdrop-blur-md border border-border/40 outline-none rounded-xl focus:border-indigo-500/50"
        />
        <div className="flex gap-2">
          {["all", "active", "banned", "suspended"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl capitalize cursor-pointer transition-all ${
                filter === f
                  ? "bg-primary text-primary-foreground border border-primary/20"
                  : "bg-card/25 text-muted-foreground hover:text-foreground border border-border/40"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Users Data Grid */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-sm border border-border/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 text-[10px] uppercase tracking-wider text-muted-foreground bg-background/25">
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Role</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Sessions</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20 text-xs">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const status = getStatus(user);
                  return (
                    <tr key={user.id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">{user.name}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-muted-foreground capitalize">
                        {user.role}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md border ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground font-semibold">
                        {user.sessions.length} active
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setActiveUser(user);
                            setSelectedRole(user.role);
                            setModalType("role");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-background/40 hover:bg-background/80 border border-border/30 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                        >
                          Role
                        </button>

                        {user.banned ? (
                          <button
                            onClick={() => handleAction(() => unbanUser(user.id))}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 cursor-pointer transition-colors"
                          >
                            Unban
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveUser(user);
                              setModalType("ban");
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 cursor-pointer transition-colors"
                          >
                            Ban
                          </button>
                        )}

                        {user.suspendedUntil && new Date(user.suspendedUntil) > new Date() ? (
                          <button
                            onClick={() => handleAction(() => unsuspendUser(user.id))}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 cursor-pointer transition-colors"
                          >
                            Unsuspend
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveUser(user);
                              setModalType("suspend");
                            }}
                            className="px-2.5 py-1 rounded-lg bg-background/40 hover:bg-background/80 border border-border/30 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                          >
                            Suspend
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
                              handleAction(() => deleteUser(user.id));
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 cursor-pointer transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    No users matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog Sheets */}
      {activeUser && modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          
          <div className="w-full max-w-sm glass-panel rounded-2xl p-6 shadow-xl z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {modalType === "ban" && <BanIcon size={16} className="text-rose-400" />}
                {modalType === "suspend" && <SecurityIcon size={16} className="text-amber-400" />}
                {modalType === "role" && <UsersIcon size={16} className="text-indigo-400" />}
                <h3 className="text-sm font-semibold capitalize">{modalType} User</h3>
              </div>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <CloseIcon size={16} />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Perform action on <strong className="text-foreground">{activeUser.name}</strong> ({activeUser.email}).
            </p>

            {modalType === "ban" && (
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Reason for Ban</label>
                <input
                  type="text"
                  placeholder="e.g. Repeated spamming"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-background/50 border border-border/40 outline-none rounded-xl focus:border-indigo-500/50"
                />
                <button
                  onClick={() => handleAction(() => banUser(activeUser.id, banReason))}
                  disabled={isPending}
                  className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                >
                  {isPending ? <SpinnerIcon size={12} /> : "Apply Ban"}
                </button>
              </div>
            )}

            {modalType === "suspend" && (
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Suspension Duration</label>
                <select
                  value={suspendHours}
                  onChange={(e) => setSuspendHours(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-background/50 border border-border/40 outline-none rounded-xl focus:border-indigo-500/50"
                >
                  <option value={24}>24 Hours</option>
                  <option value={72}>3 Days (72 hrs)</option>
                  <option value={168}>7 Days (168 hrs)</option>
                  <option value={720}>30 Days (720 hrs)</option>
                </select>
                <button
                  onClick={() => handleAction(() => suspendUser(activeUser.id, suspendHours))}
                  disabled={isPending}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                >
                  {isPending ? <SpinnerIcon size={12} /> : "Apply Suspension"}
                </button>
              </div>
            )}

            {modalType === "role" && (
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Choose Access Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-background/50 border border-border/40 outline-none rounded-xl focus:border-indigo-500/50"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="member">Member</option>
                </select>
                <button
                  onClick={() => handleAction(() => updateUserRole(activeUser.id, selectedRole))}
                  disabled={isPending}
                  className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                >
                  {isPending ? <SpinnerIcon size={12} /> : "Save Role"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
