"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Wallet, Lock, ArrowRight, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-sky-100 bg-white py-3.5 pl-11 pr-4 text-slate-800 placeholder-gray-400 outline-none transition-all focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 text-sm";

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">Password reset!</h2>
        <p className="text-sm text-slate-500">Redirecting you to login...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400" size={16} />
        <input
          type="password"
          placeholder="New password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="relative">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400" size={16} />
        <input
          type="password"
          placeholder="Confirm new password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={inputClass}
        />
      </div>

      {error && (
        <p className="text-xs font-medium text-red-500 bg-red-50 p-2.5 rounded-lg text-center border border-red-100">
          {error}
        </p>
      )}

      <motion.button
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading || !token}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-sky-500/20 transition-all disabled:opacity-60"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <>Reset password <ArrowRight size={16} /></>}
      </motion.button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-sky-50 flex items-center justify-center px-4 py-10">
      <div className="absolute -top-25 -left-25 h-70 w-70 rounded-full bg-sky-200/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-25 -right-25 h-70 w-70 rounded-full bg-cyan-200/40 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="rounded-2xl border border-sky-100 bg-white p-8 shadow-sm">
          <div className="text-center mb-7">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500 text-white">
              <Wallet size={30} />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Reset Password</h1>
            <p className="mt-1 text-xs font-medium tracking-widest text-sky-400 uppercase">Secure your account</p>
          </div>

          <Suspense fallback={<div className="flex justify-center"><Loader2 className="animate-spin text-sky-500" /></div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </motion.div>
    </div>
  );
}
