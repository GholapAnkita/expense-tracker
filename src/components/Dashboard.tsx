"use client";

import { useMemo, useState } from "react";
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
  // Setup selected month/year state
  const [selectedMonthYear, setSelectedMonthYear] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

<<<<<<< HEAD
  // Parse the selected month and year
  const { selectedMonth, selectedYear, selectedMonthName } = useMemo(() => {
    const [year, month] = selectedMonthYear.split("-").map(Number);
    const date = new Date(year, month - 1, 1);
    return {
      selectedMonth: month - 1,
      selectedYear: year,
      selectedMonthName: new Intl.DateTimeFormat("en-US", { month: "long" }).format(date),
    };
  }, [selectedMonthYear]);

  // Compute available months dynamically
  const availableMonths = useMemo(() => {
    const monthsMap = new Map<string, { month: number; year: number; label: string }>();

    // Always include current month
    const now = new Date();
    const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    monthsMap.set(currentKey, {
      month: now.getMonth(),
      year: now.getFullYear(),
      label: `${now.toLocaleDateString("en-US", { month: "long", year: "numeric" })} (Current)`,
    });

    // Always include previous month
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevKey = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`;
    monthsMap.set(prevKey, {
      month: prev.getMonth(),
      year: prev.getFullYear(),
      label: prev.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    });

    // Include other months that have expenses
    expenses.forEach((exp) => {
      const d = new Date(exp.date);
      if (!isNaN(d.getTime())) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (!monthsMap.has(key)) {
          monthsMap.set(key, {
            month: d.getMonth(),
            year: d.getFullYear(),
            label: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          });
        }
      }
    });

    // Sort months descending
    return Array.from(monthsMap.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, val]) => ({ key, ...val }));
  }, [expenses]);

  // Expenses for the selected month
  const monthlyExpenses = useMemo(
=======
  const monthlyTransactions = useMemo(
>>>>>>> 5b8490d781f9b633e07f7d27a2a635b7934ca933
    () =>
      expenses.filter((exp) => {
        const d = new Date(exp.date);
        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
      }),
    [expenses, selectedMonth, selectedYear],
  );

<<<<<<< HEAD
  // Stats for the selected month
  const totalMonthly = useMemo(
=======
  const monthlyExpenses = useMemo(
    () => monthlyTransactions.filter((t) => t.type !== "income"),
    [monthlyTransactions],
  );

  const monthlyIncome = useMemo(
    () => monthlyTransactions.filter((t) => t.type === "income"),
    [monthlyTransactions],
  );

  const totalMonthlyExpenses = useMemo(
>>>>>>> 5b8490d781f9b633e07f7d27a2a635b7934ca933
    () => monthlyExpenses.reduce((acc, cur) => acc + cur.amount, 0),
    [monthlyExpenses],
  );

<<<<<<< HEAD
  // Compute previous month relative to selected month
  const prevMonthInfo = useMemo(() => {
    const d = new Date(selectedYear, selectedMonth - 1, 1);
    return {
      month: d.getMonth(),
      year: d.getFullYear(),
      label: new Intl.DateTimeFormat("en-US", { month: "long" }).format(d),
    };
  }, [selectedMonth, selectedYear]);

  // Expenses for the previous month
  const prevMonthlyExpenses = useMemo(
    () =>
      expenses.filter((exp) => {
        const d = new Date(exp.date);
        return d.getMonth() === prevMonthInfo.month && d.getFullYear() === prevMonthInfo.year;
      }),
    [expenses, prevMonthInfo],
  );

  // Stats for the previous month
  const totalPrevMonth = useMemo(
    () => prevMonthlyExpenses.reduce((acc, cur) => acc + cur.amount, 0),
    [prevMonthlyExpenses],
  );

  const percentChange = useMemo(() => {
    if (totalPrevMonth === 0) return totalMonthly > 0 ? 100 : 0;
    return ((totalMonthly - totalPrevMonth) / totalPrevMonth) * 100;
  }, [totalMonthly, totalPrevMonth]);
=======
  const totalMonthlyIncome = useMemo(
    () => monthlyIncome.reduce((acc, cur) => acc + cur.amount, 0),
    [monthlyIncome],
  );

  const netSavings = totalMonthlyIncome - totalMonthlyExpenses;

  const [chartType, setChartType] = useState<"expense" | "income">("expense");
>>>>>>> 5b8490d781f9b633e07f7d27a2a635b7934ca933

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
<<<<<<< HEAD
      {/* Month Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Select Month
          </h2>
          <p className="text-xs text-gray-400">
            Compare target and expenses for different periods
          </p>
        </div>
        <div className="relative inline-block">
          <select
            value={selectedMonthYear}
            onChange={(e) => setSelectedMonthYear(e.target.value)}
            className="w-full sm:w-52 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-900 px-4 py-2.5 text-sm font-semibold appearance-none cursor-pointer pr-10"
          >
            {availableMonths.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
=======
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
>>>>>>> 5b8490d781f9b633e07f7d27a2a635b7934ca933

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
<<<<<<< HEAD
          whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(0, 0, 0, 0.08)" }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between transition-shadow"
=======
          transition={{ delay: 0.04 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
>>>>>>> 5b8490d781f9b633e07f7d27a2a635b7934ca933
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-sky-50 rounded-xl">
                <CreditCard className="text-sky-500" size={20} />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
                <Calendar size={12} />
                {selectedMonthName}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Monthly spending</p>
            <p className="text-3xl font-semibold text-gray-900">
              {formatCurrency(totalMonthly)}
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-1.5 text-xs text-gray-500">
            <span>vs. {prevMonthInfo.label} ({formatCurrency(totalPrevMonth)})</span>
            {totalPrevMonth > 0 ? (
              <span
                className={cn(
                  "font-semibold px-2 py-0.5 rounded-full ml-auto",
                  percentChange > 0
                    ? "text-rose-600 bg-rose-50"
                    : "text-emerald-600 bg-emerald-50",
                )}
              >
                {percentChange > 0 ? "+" : ""}
                {Math.round(percentChange)}%
              </span>
            ) : (
              <span className="font-semibold text-gray-400 ml-auto">-</span>
            )}
          </div>
<<<<<<< HEAD
=======
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
>>>>>>> 5b8490d781f9b633e07f7d27a2a635b7934ca933
        </motion.div>

        {/* Budget Progress */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
<<<<<<< HEAD
          whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(0, 0, 0, 0.08)" }}
          transition={{ delay: 0.08, duration: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between transition-shadow"
=======
          transition={{ delay: 0.12 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
>>>>>>> 5b8490d781f9b633e07f7d27a2a635b7934ca933
        >
          <div>
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
            <div className="flex items-center justify-between mb-3">
              <p className="text-3xl font-semibold text-gray-900">
                {Math.min(100, Math.round(budgetProgress))}%
              </p>
              {isOverBudget && (
                <span className="flex items-center gap-1 text-xs font-medium text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                  <AlertCircle size={12} />
                  Exceeded
                </span>
              )}
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
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
<<<<<<< HEAD
=======
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
>>>>>>> 5b8490d781f9b633e07f7d27a2a635b7934ca933
          </div>
        </motion.div>
      </div>

<<<<<<< HEAD
        {/* Top Category */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(0, 0, 0, 0.08)" }}
          transition={{ delay: 0.16, duration: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between transition-shadow"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-amber-50 rounded-xl">
                <TrendingUp className="text-amber-500" size={20} />
              </div>
              <span className="text-xs font-medium text-gray-400">Insights</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Top category</p>
            <p className="text-3xl font-semibold text-gray-900 truncate">
              {highestCategory ? highestCategory.name : "No data"}
            </p>
          </div>
          <p className="text-sm text-gray-400 mt-3 pt-3 border-t border-gray-50">
            {highestCategory
              ? `${formatCurrency(highestCategory.value)} in ${selectedMonthName}`
              : "Start tracking expenses"}
          </p>
        </motion.div>
=======
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
>>>>>>> 5b8490d781f9b633e07f7d27a2a635b7934ca933
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
<<<<<<< HEAD
          whileHover={{ scale: 1.01, boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.1)" }}
          transition={{ delay: 0.24, duration: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm min-h-[400px] flex flex-col transition-shadow"
=======
          transition={{ delay: 0.16 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm min-h-90 flex flex-col"
>>>>>>> 5b8490d781f9b633e07f7d27a2a635b7934ca933
        >
          <h3 className="text-base font-semibold text-gray-900 mb-6 capitalize">
            {chartType} category mix
          </h3>
<<<<<<< HEAD
            <div className="flex-1 w-full" style={{ minHeight: '300px' }}>
              {chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-gray-400">
                  No data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
=======
          <div className="flex-1 w-full">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">
                No data yet for this type
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minHeight={240}>
>>>>>>> 5b8490d781f9b633e07f7d27a2a635b7934ca933
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
<<<<<<< HEAD
          whileHover={{ scale: 1.01, boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.1)" }}
          transition={{ delay: 0.32, duration: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm min-h-90 flex flex-col transition-shadow"
=======
          transition={{ delay: 0.20 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm min-h-90 flex flex-col"
>>>>>>> 5b8490d781f9b633e07f7d27a2a635b7934ca933
        >
          <h3 className="text-base font-semibold text-gray-900 mb-6 capitalize">
            {chartType} split
          </h3>
            <div className="flex-1 w-full flex items-center justify-center relative" style={{ minHeight: '300px' }}>
              {chartData.length === 0 ? (
                <span className="text-sm text-gray-400">No data yet</span>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
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
