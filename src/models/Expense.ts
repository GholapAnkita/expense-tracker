import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  date: string;
  category: string;
  amount: number;
  notes?: string;
  userId: string;
}

const ExpenseSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Room Rent",
        "Travel to Home",
        "Daily Travelling",
        "Extra Travelling",
        "Vegetables",
        "Outside Food",
<<<<<<< HEAD
        "Other",
=======
        "Salary",
        "Freelance",
        "Investment",
        "Gifts",
        "Other Income",
>>>>>>> 5b8490d781f9b633e07f7d27a2a635b7934ca933
      ],
    },
    amount: { type: Number, required: true },
    notes: { type: String },
    type: {
      type: String,
      enum: ["expense", "income"],
      default: "expense",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export default mongoose.models.Expense ||
  mongoose.model<IExpense>("Expense", ExpenseSchema);
