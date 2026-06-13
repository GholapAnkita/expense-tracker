"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  TrendingUp,
  CreditCard,
  Target,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { Expense } from "@/types/expense";
import { formatCurrency, cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DashboardProps {
  expenses: Expense[];
  budget: number;
  onEditBudget: () => void;
}

const PIE_COLORS = [
  "#0ea5e9",
  "#38bdf8",
  "#7dd3fc",
  "#0284c7",
  "#0369a1",
  "#075985",
];

const BAR_COLORS = ["#0ea5e9", "#38bdf8", "#7dd3fc", "#bae6fd", "#e0f2fe"];

import { useState } from "react";

export const Dashboard = ({
  expenses,
  budget,
  onEditBudget,
}: DashboardProps) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(new Date());

  const monthlyTransactions = useMemo(
    () =>
      expenses.filter((exp) => {
        const d = new Date(exp.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }),
    [expenses, currentMonth, currentYear],
  );

  const monthlyExpenses = useMemo(
    () => monthlyTransactions.filter((t) => t.type !== "income"),
    [monthlyTransactions],
  );

  const monthlyIncome = useMemo(
    () => monthlyTransactions.filter((t) => t.type === "income"),
    [monthlyTransactions],
  );

  const totalMonthlyExpenses = useMemo(
    () => monthlyExpenses.reduce((acc, cur) => acc + cur.amount, 0),
    [monthlyExpenses],
  );

  const totalMonthlyIncome = useMemo(
    () => monthlyIncome.reduce((acc, cur) => acc + cur.amount, 0),
    [monthlyIncome],
  );

  const netSavings = totalMonthlyIncome - totalMonthlyExpenses;

  const [chartType, setChartType] = useState<"expense" | "income">("expense");

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    const list = chartType === "income" ? monthlyIncome : monthlyExpenses;
    list.forEach((exp) => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [monthlyIncome, monthlyExpenses, chartType]);

  const chartData = useMemo(
    () => [...categoryTotals].sort((a, b) => b.value - a.value),
    [categoryTotals],
  );

  const budgetProgress = budget > 0 ? (totalMonthlyExpenses / budget) * 100 : 0;
  const isOverBudget = totalMonthlyExpenses > budget;
  const isWarningBudget = totalMonthlyExpenses >= budget * 0.8 && totalMonthlyExpenses <= budget;

  const highestCategory = useMemo(() => {
    if (!categoryTotals.length) return null;
    return categoryTotals.reduce((prev, cur) =>
      prev.value > cur.value ? prev : cur,
    );
  }, [categoryTotals]);

  return (
    <div className="space-y-6">
      {/* ── Budget Alerts ── */}
      {isOverBudget && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 text-rose-850 rounded-2xl shadow-sm"
        >
          <AlertCircle className="text-rose-500 shrink-0" size={20} />
          <div className="text-sm text-rose-800">
            <span className="font-semibold">Budget Exceeded!</span> You have spent {formatCurrency(totalMonthlyExpenses)} which exceeds your monthly budget of {formatCurrency(budget)}.
          </div>
        </motion.div>
      )}
      {isWarningBudget && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 text-amber-850 rounded-2xl shadow-sm"
        >
          <AlertCircle className="text-amber-500 shrink-0" size={20} />
          <div className="text-sm text-amber-800">
            <span className="font-semibold">Warning:</span> You have used {Math.round(budgetProgress)}% of your monthly budget ({formatCurrency(totalMonthlyExpenses)} spent of {formatCurrency(budget)}).
          </div>
        </motion.div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Income */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-emerald-50 rounded-xl">
              <TrendingUp className="text-emerald-500" size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
              <Calendar size={12} />
              {currentMonthName}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Monthly Income</p>
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(totalMonthlyIncome)}
          </p>
        </motion.div>

        {/* Monthly Spending */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-sky-50 rounded-xl">
              <CreditCard className="text-sky-500" size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
              <Calendar size={12} />
              {currentMonthName}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Monthly Expenses</p>
          <p className="text-2xl font-semibold text-gray-900">
            {formatCurrency(totalMonthlyExpenses)}
          </p>
        </motion.div>

        {/* Net Savings */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={cn(
              "p-2.5 rounded-xl",
              netSavings >= 0 ? "bg-emerald-50" : "bg-rose-50"
            )}>
              <TrendingUp className={netSavings >= 0 ? "text-emerald-500" : "text-rose-500 -scale-y-100"} size={20} />
            </div>
            <span className="text-xs font-medium text-gray-400">Net Balance</span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Net Savings</p>
          <p className={cn(
            "text-2xl font-semibold",
            netSavings >= 0 ? "text-emerald-600" : "text-rose-600"
          )}>
            {formatCurrency(netSavings)}
          </p>
        </motion.div>

        {/* Budget Progress */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={cn(
                "p-2.5 rounded-xl",
                isOverBudget ? "bg-rose-50" : "bg-sky-50",
              )}
            >
              <Target
                className={cn(isOverBudget ? "text-rose-500" : "text-sky-500")}
                size={20}
              />
            </div>
            <button
              onClick={onEditBudget}
              className="text-xs font-medium text-sky-500 hover:text-sky-700 transition-colors"
            >
              Edit budget
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-1">
            Budget goal: {formatCurrency(budget)}
          </p>
          <div className="flex items-center justify-between mb-2">
            <p className="text-2xl font-semibold text-gray-900">
              {Math.min(100, Math.round(budgetProgress))}%
            </p>
            {isOverBudget && (
              <span className="flex items-center gap-1 text-xs font-medium text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                <AlertCircle size={10} />
                Exceeded
              </span>
            )}
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, budgetProgress)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                isOverBudget ? "bg-rose-500" : "bg-sky-500",
              )}
            />
          </div>
        </motion.div>
      </div>

      {/* ── Chart Header with toggle ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Visual Insights</h3>
          <p className="text-xs text-gray-400">Distribution of your {chartType === "income" ? "income" : "spending"}</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl gap-1 shrink-0 self-end sm:self-auto">
          {(["expense", "income"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setChartType(t)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all",
                chartType === t
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-400 hover:text-gray-600",
              )}
            >
              {t}s
            </button>
          ))}
        </div>
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.16 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm min-h-90 flex flex-col"
        >
          <h3 className="text-base font-semibold text-gray-900 mb-6 capitalize">
            {chartType} category mix
          </h3>
          <div className="flex-1 w-full">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">
                No data yet for this type
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minHeight={240}>
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ left: 8, right: 32, top: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="rgba(0,0,0,0.06)"
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={100}
                    tick={{
                      fontSize: 12,
                      fontWeight: 500,
                      fill: "var(--color-muted, #94a3b8)",
                    }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(14,165,233,0.05)" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid rgba(0,0,0,0.08)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      background: "#fff",
                      fontSize: 13,
                    }}
                    formatter={(value: unknown) =>
                      formatCurrency(Number(value))
                    }
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={chartType === "income" ? ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"][index % 5] : BAR_COLORS[index % BAR_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Donut Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.20 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm min-h-90 flex flex-col"
        >
          <h3 className="text-base font-semibold text-gray-900 mb-6 capitalize">
            {chartType} split
          </h3>
          <div className="flex-1 w-full flex items-center justify-center relative">
            {chartData.length === 0 ? (
              <span className="text-sm text-gray-400">No data yet</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minHeight={240}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={72}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={chartType === "income" ? ["#10b981", "#059669", "#34d399", "#6ee7b7", "#a7f3d0"][index % 5] : PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid rgba(0,0,0,0.08)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      background: "#fff",
                      fontSize: 13,
                    }}
                    formatter={(value: unknown) =>
                      formatCurrency(Number(value))
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            {/* Centre label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                {chartType === "income" ? "Earned" : "Spent"}
              </span>
              <span className="text-2xl font-semibold text-gray-900">
                {formatCurrency(chartType === "income" ? totalMonthlyIncome : totalMonthlyExpenses)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
