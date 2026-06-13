"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  TrendingUp, 
  CreditCard, 
  ShieldCheck, 
  ArrowLeft,
  Loader2,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

interface AdminStats {
  totalUsers: number;
  totalExpenses: number;
  totalAmount: number;
  recentUsers: {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.status === 401) {
          router.push("/");
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50/30">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/")}
            className="p-2.5 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-sky-500 transition-all active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="text-sky-500" />
              Admin Control
            </h1>
            <p className="text-sm text-gray-400">Application usage and user overview</p>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
        >
          <div className="p-3 bg-sky-50 text-sky-500 rounded-2xl w-fit mb-4">
            <Users size={24} />
          </div>
          <p className="text-sm font-medium text-gray-400 mb-1">Total Users</p>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
        >
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl w-fit mb-4">
            <TrendingUp size={24} />
          </div>
          <p className="text-sm font-medium text-gray-400 mb-1">Total Expenses</p>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalExpenses || 0}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
        >
          <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl w-fit mb-4">
            <CreditCard size={24} />
          </div>
          <p className="text-sm font-medium text-gray-400 mb-1">Overall Volume</p>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.totalAmount || 0)}</p>
        </motion.div>
      </div>

      {/* Recent Users List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock size={18} className="text-gray-400" />
            Recent Registrations
          </h3>
          <span className="text-xs font-medium text-sky-500 bg-sky-50 px-3 py-1 rounded-full">
            Last 5 users
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-8 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats?.recentUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <p className="text-sm text-gray-400">
                      {format(new Date(user.createdAt), "MMM dd, yyyy")}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
