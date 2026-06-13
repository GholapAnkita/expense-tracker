"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const endpoint =
      authMode === "login"
        ? "/api/auth/login"
        : authMode === "register"
          ? "/api/auth/register"
          : "/api/auth/forgot-password";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        if (authMode === "login") {
          router.push("/");
          router.refresh();
        } else if (authMode === "register") {
          setAuthMode("login");
          setMessage("Account created successfully. Please login.");
        } else {
          setMessage(
            `Reset link: ${data.resetUrl}`
          );
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-sky-100 bg-white py-3.5 pl-11 pr-4 text-slate-800 placeholder-gray-400 outline-none transition-all focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 text-sm";

  return (
    <div className="relative min-h-screen overflow-hidden bg-sky-50 flex items-center justify-center px-4 py-10">
      {/* Soft background blobs */}
      <div className="absolute -top-25 -left-25 h-70 w-70 rounded-full bg-sky-200/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-25 -right-25 h-70 w-70 rounded-full bg-cyan-200/40 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-5 flex items-center justify-center"
        >
          <div className="flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-1.5 shadow-sm">
            <Sparkles className="text-sky-400" size={14} />
            <p className="text-xs font-medium tracking-wide text-sky-600">
              Smart Expense Tracker
            </p>
          </div>
        </motion.div>

        {/* Card */}
        <div className="rounded-2xl border border-sky-100 bg-white p-8 shadow-sm">
          {/* Logo */}
          <div className="text-center mb-7">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-md shadow-sky-500/20">
              <Wallet size={30} />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Expensy</h1>
            <p className="mt-1 text-xs font-medium tracking-widest text-sky-400 uppercase">
              Finance Made Beautiful
            </p>
          </div>

          {/* Toggle */}
          <AnimatePresence mode="wait">
            {authMode !== "forgot" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 grid grid-cols-2 rounded-xl bg-sky-50 p-1 gap-1"
              >
                <button
                  onClick={() => setAuthMode("login")}
                  className={`rounded-lg py-2.5 text-sm font-medium transition-all ${
                    authMode === "login"
                      ? "bg-white text-sky-600 shadow-sm"
                      : "text-sky-400 hover:text-sky-600"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setAuthMode("register")}
                  className={`rounded-lg py-2.5 text-sm font-medium transition-all ${
                    authMode === "register"
                      ? "bg-white text-sky-600 shadow-sm"
                      : "text-sky-400 hover:text-sky-600"
                  }`}
                >
                  Register
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <AnimatePresence mode="popLayout">
              {authMode === "register" && (
                <motion.div
                  key="name-input"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="relative overflow-hidden"
                >
                  <User
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Full name"
                    required={authMode === "register"}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={inputClass}
                  />
                </motion.div>
              )}

              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400"
                  size={16}
                />
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              {authMode !== "forgot" && (
                <motion.div
                  key="password-input"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative"
                >
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400"
                    size={16}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className={inputClass}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forgot password link */}
            {authMode === "login" && (
              <div className="flex justify-end px-1">
                <button
                  type="button"
                  onClick={() => setAuthMode("forgot")}
                  className="text-xs font-medium text-sky-500 hover:text-sky-600 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Error/Message */}
            {(error || message) && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-xl border px-4 py-2.5 text-center text-xs font-medium break-all",
                  error
                    ? "border-red-100 bg-red-50 text-red-500"
                    : "border-emerald-100 bg-emerald-50 text-emerald-600",
                )}
              >
                {message.startsWith("Reset link:") ? (
                  <>
                    Password reset link generated: <br />
                    <a 
                      href={message.replace("Reset link: ", "")} 
                      className="text-sky-500 hover:underline font-bold"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Click here to reset
                    </a>
                  </>
                ) : (
                  error || message
                )}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-sky-500/20 transition-all disabled:opacity-60 mt-1"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {authMode === "login"
                    ? "Sign in"
                    : authMode === "register"
                      ? "Create account"
                      : "Send reset link"}
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>

            {authMode === "forgot" && (
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className="w-full text-center text-xs font-medium text-gray-400 hover:text-sky-500 transition-colors pt-2"
              >
                Back to login
              </button>
            )}
          </form>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-sky-400">
            <ShieldCheck size={14} />
            <span>End-to-end encrypted & secure</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
