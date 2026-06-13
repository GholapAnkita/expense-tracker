"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2, Search, ArrowUpDown, FileSpreadsheet } from "lucide-react";
import { Expense, Category } from "@/types/expense";
import { CategoryIcon, CATEGORY_COLORS } from "./CategoryIcon";
import { formatCurrency, cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const EXPENSE_CATEGORIES = [
  "All",
  "Room Rent",
  "Travel to Home",
  "Daily Travelling",
  "Extra Travelling",
  "Vegetables",
  "Outside Food",
];

const INCOME_CATEGORIES = [
  "All",
  "Salary",
  "Freelance",
  "Investment",
  "Gifts",
  "Other Income",
];

export const ExpenseList = ({
  expenses,
  onEdit,
  onDelete,
}: ExpenseListProps) => {
  const [filterType, setFilterType] = useState<"all" | "expense" | "income">("all");
  const [filterCategory, setFilterCategory] = useState<Category | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredExpenses = expenses
    .filter((exp) => {
      if (filterType === "expense" && exp.type === "income") return false;
      if (filterType === "income" && exp.type !== "income") return false;
      return true;
    })
    .filter(
      (exp) => filterCategory === "All" || exp.category === filterCategory,
    )
    .filter((exp) => {
      if (startDate && exp.date < startDate) return false;
      if (endDate && exp.date > endDate) return false;
      return true;
    })
    .filter(
      (exp) =>
        exp.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortOrder === "desc" ? -diff : diff;
    });

  const categoriesToRender = filterType === "income"
    ? INCOME_CATEGORIES
    : (filterType === "expense" ? EXPENSE_CATEGORIES : ["All", ...EXPENSE_CATEGORIES.slice(1), ...INCOME_CATEGORIES.slice(1)]);

  const exportToCSV = () => {
    const headers = ["Date", "Type", "Category", "Amount", "Notes"];
    const rows = filteredExpenses.map((exp) => [
      exp.date,
      exp.type || "expense",
      exp.category,
      exp.amount,
      `"${(exp.notes || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ledger_export_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Search, Sort, Date range & Export controls */}
      <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search notes or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-900 placeholder-gray-400 transition-all"
            />
          </div>
          
          {/* Actions: Sort & Export */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setSortOrder((s) => (s === "desc" ? "asc" : "desc"))}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-gray-50 border border-gray-100 rounded-xl text-gray-500 hover:text-sky-500 hover:border-sky-200 transition-all active:scale-95"
            >
              <ArrowUpDown size={15} />
              {sortOrder === "desc" ? "Newest" : "Oldest"}
            </button>
            <button
              onClick={exportToCSV}
              disabled={filteredExpenses.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <FileSpreadsheet size={15} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters: Type Toggle & Custom Date Ranges */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-gray-50">
          {/* Type Selector Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-xl gap-1 w-full md:w-auto">
            {(["all", "expense", "income"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setFilterType(t);
                  setFilterCategory("All");
                }}
                className={cn(
                  "flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all",
                  filterType === t
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                {t === "all" ? "All Types" : t + "s"}
              </button>
            ))}
          </div>

          {/* Date range picker */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-1 md:w-36 px-3 py-1.5 text-xs bg-gray-50 border border-gray-105 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-400 text-gray-900"
              placeholder="Start Date"
            />
            <span className="text-xs text-gray-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex-1 md:w-36 px-3 py-1.5 text-xs bg-gray-50 border border-gray-105 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-400 text-gray-900"
              placeholder="End Date"
            />
            {(startDate || endDate) && (
              <button
                onClick={() => { setStartDate(""); setEndDate(""); }}
                className="text-xs text-rose-500 hover:underline shrink-0"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categoriesToRender.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat as Category | "All")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filterCategory === cat
                ? "bg-sky-500 text-white shadow-sm"
                : "bg-white text-gray-500 border border-gray-100 hover:border-sky-200 hover:text-sky-500"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {filteredExpenses.map((expense) => (
                  <motion.tr
                    key={expense.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    className="hover:bg-gray-50/60 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-700">
                        {format(parseISO(expense.date), "MMM dd")}
                        <span className="text-xs text-gray-400 ml-1">
                          {format(parseISO(expense.date), "yyyy")}
                        </span>
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`p-2 rounded-lg ${CATEGORY_COLORS[expense.category] || "bg-gray-100 text-gray-600"}`}
                        >
                          <CategoryIcon category={expense.category} size={15} />
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                          {expense.category}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "text-sm font-semibold px-2.5 py-1 rounded-lg",
                        expense.type === "income" ? "text-emerald-600 bg-emerald-50" : "text-sky-600 bg-sky-50"
                      )}>
                        {expense.type === "income" ? "+" : "-"}{formatCurrency(expense.amount)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400 line-clamp-1 max-w-50">
                        {expense.notes || "—"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => onEdit(expense)}
                          className="p-2 text-gray-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-all active:scale-90"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => onDelete(expense.id)}
                          className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all active:scale-90"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {filteredExpenses.length === 0 && (
            <div className="py-16 text-center">
              <div className="inline-flex p-5 bg-gray-50 rounded-2xl mb-4">
                <Search className="text-gray-300" size={28} />
              </div>
              <p className="text-sm font-medium text-gray-500">
                No entries found
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try adjusting your filters or search
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
