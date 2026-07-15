"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { EmailIcon, KeysIcon, SpinnerIcon, SecurityIcon } from "@/components/ui/icons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: signInError } = await signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      });

      if (signInError) {
        setError(signInError.message || "Failed to log in. Please check credentials.");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    setLoading(true);
    setError("");
    try {
      // In a real environment, this triggers WebAuthn authentication via Better Auth passkey plugin
      const { error: passkeyError } = await signIn.passkey();
      if (passkeyError) {
        setError(passkeyError.message || "Passkey login failed.");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Passkey system not supported or credential request was cancelled.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center p-6 bg-background">
      {/* Ambient backgrounds */}
      <div className="ambient-glow" />

      {/* Floating Liquid Glass Login Card */}
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 shadow-2xl relative z-10 hover-float">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/25">
            <SecurityIcon size={24} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground to-indigo-400 bg-clip-text text-transparent">
            Welcome to BetterAuth Studio
          </h1>
          <p className="text-xs text-muted-foreground/80 mt-2">
            The modern visual dashboard for Better Auth.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground/80 pl-1">Email address</label>
            <div className="relative flex items-center">
              <EmailIcon size={16} className="absolute left-4.5 text-muted-foreground/60" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@better-auth.com"
                className="w-full pl-11 pr-4 py-3 text-sm bg-background/50 border border-border/40 focus:border-indigo-500/80 outline-none rounded-xl transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground/80 pl-1">Password</label>
            <div className="relative flex items-center">
              <KeysIcon size={16} className="absolute left-4.5 text-muted-foreground/60" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 text-sm bg-background/50 border border-border/40 focus:border-indigo-500/80 outline-none rounded-xl transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-foreground text-background font-semibold text-sm rounded-xl hover:bg-foreground/90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 mt-6"
          >
            {loading ? <SpinnerIcon size={16} /> : "Sign In to Studio"}
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/40"></div>
          </div>
          <span className="relative px-3 text-[10px] uppercase font-bold text-muted-foreground/50 bg-background/0 backdrop-blur-md">
            Or secure sign in
          </span>
        </div>

        <button
          onClick={handlePasskeyLogin}
          disabled={loading}
          className="w-full py-3 bg-background/60 hover:bg-background/80 text-foreground font-semibold text-sm rounded-xl border border-border/40 hover:border-indigo-500/40 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <SecurityIcon size={16} className="text-indigo-400" />
          <span>Login with Passkey</span>
        </button>
      </div>
    </div>
  );
}
