import React from "react";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { UsersIcon, EmailIcon } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

export default async function OrganizationsPage() {
  const orgs = await prisma.organization.findMany({
    include: {
      members: {
        include: {
          user: true,
        },
      },
      invitations: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Organizations & Teams</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Monitor workspaces, organization slugs, tenant member connections, and pending email invitations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Org List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs uppercase tracking-wider font-bold text-muted-foreground pl-1">All Tenants ({orgs.length})</h3>
          <div className="space-y-3">
            {orgs.length > 0 ? (
              orgs.map((org) => (
                <div
                  key={org.id}
                  className="bg-card/25 backdrop-blur-xl border border-border/40 hover:border-indigo-500/30 rounded-2xl p-4 shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold">
                      {org.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{org.name}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">slug: {org.slug}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4 text-[10px] font-semibold text-muted-foreground/80 pl-1 border-t border-border/20 pt-3">
                    <span>{org.members.length} Members</span>
                    <span>{org.invitations.length} Invites</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-card/10 border border-border/30 rounded-2xl p-8 text-center text-xs text-muted-foreground">
                No organizations found.
              </div>
            )}
          </div>
        </div>

        {/* Selected Org Members & Invites Detail */}
        <div className="lg:col-span-2 space-y-6">
          {orgs.length > 0 ? (
            <>
              {/* Member Roster */}
              <div className="bg-card/25 backdrop-blur-xl border border-border/40 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-border/20 pb-3">
                  <UsersIcon size={16} className="text-indigo-400" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Member Roster ({orgs[0].name})
                  </h3>
                </div>

                <div className="divide-y divide-border/20">
                  {orgs[0].members.map((member) => (
                    <div key={member.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-foreground">{member.user.name}</span>
                        <span className="text-[10px] text-muted-foreground ml-2">({member.user.email})</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Invitations */}
              <div className="bg-card/25 backdrop-blur-xl border border-border/40 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-border/20 pb-3">
                  <EmailIcon size={16} className="text-purple-400" />
                  <h3 className="text-sm font-semibold text-foreground">Pending Invitations</h3>
                </div>

                <div className="divide-y divide-border/20">
                  {orgs[0].invitations.length > 0 ? (
                    orgs[0].invitations.map((invite) => (
                      <div key={invite.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-foreground">{invite.email}</span>
                          <span className="text-[10px] text-muted-foreground block mt-0.5">
                            Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {invite.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-muted-foreground">
                      No pending invitations.
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-card/10 border border-border/30 rounded-2xl p-12 text-center text-xs text-muted-foreground">
              Select or create an organization to view rosters.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
