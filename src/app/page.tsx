"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Wallet,
  LayoutDashboard,
  History,
  Settings,
  Loader2,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Expense } from "@/types/expense";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { Dashboard } from "@/components/Dashboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BudgetModal } from "@/components/BudgetModal";
import { cn } from "@/lib/utils";

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<number>(5000);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "list">("dashboard");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesRes, budgetRes, userRes] = await Promise.all([
          fetch("/api/expenses"),
          fetch("/api/budget"),
          fetch("/api/auth/me"),
        ]);

        if (expensesRes.status === 401 || budgetRes.status === 401) {
          router.push("/login");
          return;
        }

        if (expensesRes.ok && budgetRes.ok) {
          const expensesData = await expensesRes.json();
          const budgetData = await budgetRes.json();
          setExpenses(expensesData);
          setBudget(budgetData.amount);
        }

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleAddExpense = async (expenseData: Omit<Expense, "id">) => {
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });
      if (res.ok) {
        const newExpense = await res.json();
        setExpenses([newExpense, ...expenses]);
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error("Failed to add expense:", error);
    }
  };

  const handleUpdateExpense = async (
    id: string,
    expenseData: Omit<Expense, "id">,
  ) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });
      if (res.ok) {
        const updatedExpense = await res.json();
        setExpenses(
          expenses.map((exp) => (exp.id === id ? updatedExpense : exp)),
        );
        setEditingExpense(null);
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error("Failed to update expense:", error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      try {
        const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
        if (res.ok) {
          setExpenses(expenses.filter((exp) => exp.id !== id));
        }
      } catch (error) {
        console.error("Failed to delete expense:", error);
      }
    }
  };

  const handleUpdateBudget = async (amount: number) => {
    try {
      const res = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (res.ok) {
        const updatedBudget = await res.json();
        setBudget(updatedBudget.amount);
        setIsBudgetOpen(false);
      }
    } catch (error) {
      console.error("Failed to update budget:", error);
    }
  };

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
          <p className="text-sm font-medium text-gray-400">Loading ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 md:py-10 mb-24 md:mb-12">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500 text-white rounded-xl">
            <Wallet size={22} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 leading-tight">
              Expensy
            </h1>
            <p className="text-xs text-gray-400"></p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user?.role === "admin" && (
            <button
              onClick={() => router.push("/admin")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-all active:scale-95 text-xs font-semibold"
              title="Admin Panel"
            >
              <ShieldCheck size={16} />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}
          <ThemeToggle />
          <button
            onClick={() => setIsBudgetOpen(true)}
            className="p-2 rounded-lg bg-white border border-gray-100 text-gray-400 hover:text-sky-500 hover:border-sky-200 transition-all active:scale-95"
            title="Budget settings"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-white border border-gray-100 text-gray-400 hover:text-rose-500 hover:border-rose-200 transition-all active:scale-95"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl w-fit mx-auto mb-8 gap-1">
        {(["dashboard", "list"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === tab
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400 hover:text-gray-600",
            )}
          >
            {tab === "dashboard" ? (
              <LayoutDashboard size={15} />
            ) : (
              <History size={15} />
            )}
            {tab === "dashboard" ? "Stats" : "History"}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {activeTab === "dashboard" ? (
            <Dashboard
              expenses={expenses}
              budget={budget}
              onEditBudget={() => setIsBudgetOpen(true)}
            />
          ) : (
            <ExpenseList
              expenses={expenses}
              onEdit={handleEditClick}
              onDelete={handleDeleteExpense}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          setEditingExpense(null);
          setIsFormOpen(true);
        }}
        className="fixed bottom-8 right-8 md:bottom-10 md:right-10 flex items-center gap-2.5 px-5 py-3.5 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl shadow-lg shadow-sky-500/30 z-40 transition-colors"
      >
        <Plus size={20} />
        <span className="font-semibold text-sm hidden md:inline">
          Log expense
        </span>
      </motion.button>

      {/* Modals */}
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleAddExpense}
        onUpdate={handleUpdateExpense}
        editingExpense={editingExpense}
      />

      <BudgetModal
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
        currentBudget={budget}
        onSave={handleUpdateBudget}
      />

      {/* Footer */}
      <footer className="mt-16 text-center pb-4">
        <p className="text-xs text-gray-400"></p>
      </footer>
    </main>
  );
}
