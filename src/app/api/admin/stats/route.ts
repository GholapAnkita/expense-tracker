import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Expense from "@/models/Expense";
import { getUserFromToken } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getUserFromToken();
    
    // Check if user is logged in and is an admin
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const [totalUsers, totalExpenses, totalAmount] = await Promise.all([
      User.countDocuments(),
      Expense.countDocuments(),
      Expense.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    const recentUsers = await User.find({}, "name email createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json({
      totalUsers,
      totalExpenses,
      totalAmount: totalAmount[0]?.total || 0,
      recentUsers
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 },
    );
  }
}
