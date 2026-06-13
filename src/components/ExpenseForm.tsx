"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, IndianRupee, Tag, FileText } from "lucide-react";
import { Expense, Category } from "@/types/expense";
import { cn } from "@/lib/utils";

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expense: Omit<Expense, "id">) => void;
  onUpdate: (id: string, expense: Omit<Expense, "id">) => void;
  editingExpense?: Expense | null;
}

const EXPENSE_CATEGORIES: Category[] = [
  "Room Rent",
  "Travel to Home",
  "Daily Travelling",
  "Extra Travelling",
  "Vegetables",
  "Outside Food",
];

const INCOME_CATEGORIES: Category[] = [
  "Salary",
  "Freelance",
  "Investment",
  "Gifts",
  "Other Income",
];

const inputClass =
  "w-full bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-900 placeholder-gray-400 transition-all";

export const ExpenseForm = ({
  isOpen,
  onClose,
  onSubmit,
  onUpdate,
  editingExpense,
}: ExpenseFormProps) => {
  const [formData, setFormData] = useState<Omit<Expense, "id">>({
    date: new Date().toISOString().split("T")[0],
    category: "Daily Travelling",
    amount: 0,
    notes: "",
    type: "expense",
  });

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        date: editingExpense.date,
        category: editingExpense.category,
        amount: editingExpense.amount,
        notes: editingExpense.notes || "",
        type: editingExpense.type || "expense",
      });
    } else {
      setFormData({
        date: new Date().toISOString().split("T")[0],
        category: "Daily Travelling",
        amount: 0,
        notes: "",
        type: "expense",
      });
    }
  }, [editingExpense, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExpense) {
      onUpdate(editingExpense.id, formData);
    } else {
      onSubmit(formData);
    }
    onClose();
  };

  const categoriesToRender =
    formData.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                {editingExpense 
                  ? (formData.type === "income" ? "Edit income" : "Edit expense")
                  : (formData.type === "income" ? "Add income" : "Add expense")}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Type Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Transaction Type
                </label>
                <div className="flex bg-gray-100 p-1 rounded-xl w-full gap-1">
                  {(["expense", "income"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          type: t,
                          category: t === "expense" ? "Daily Travelling" : "Salary",
                        });
                      }}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all",
                        formData.type === t
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-400 hover:text-gray-600",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400">
                    <IndianRupee size={17} />
                  </span>
                  <input
                    type="number"
                    value={formData.amount || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className={cn(
                      inputClass,
                      "pl-10 pr-4 py-3 text-xl font-semibold",
                    )}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Date & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Date
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400 pointer-events-none">
                      <Calendar size={16} />
                    </span>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className={cn(inputClass, "pl-10 pr-3 py-2.5 text-sm")}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Category
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400 pointer-events-none">
                      <Tag size={16} />
                    </span>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as Category,
                        })
                      }
                      className={cn(
                        inputClass,
                        "pl-10 pr-3 py-2.5 text-sm appearance-none cursor-pointer",
                      )}
                      required
                    >
                      {categoriesToRender.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Notes{" "}
                  <span className="normal-case text-gray-400">(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-sky-400">
                    <FileText size={16} />
                  </span>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className={cn(
                      inputClass,
                      "pl-10 pr-4 py-2.5 text-sm min-h-22 resize-none",
                    )}
                    placeholder="Add a note..."
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-sky-500 hover:bg-sky-600 active:scale-[0.98] text-white rounded-xl font-semibold text-sm transition-all shadow-sm shadow-sky-500/20 mt-2"
              >
                {editingExpense 
                  ? (formData.type === "income" ? "Update income" : "Update expense")
                  : (formData.type === "income" ? "Add income" : "Add expense")}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
