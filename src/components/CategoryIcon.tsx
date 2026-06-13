import {
  Home,
  MapPin,
  Car,
  Plane,
  Leaf,
  Utensils,
  HelpCircle,
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  Coins,
} from "lucide-react";
import { Category } from "@/types/expense";

interface CategoryIconProps {
  category: Category;
  className?: string;
  size?: number;
}

export const CategoryIcon = ({
  category,
  className,
  size = 20,
}: CategoryIconProps) => {
  switch (category) {
    case "Room Rent":
      return <Home className={className} size={size} />;
    case "Travel to Home":
      return <Plane className={className} size={size} />;
    case "Daily Travelling":
      return <Car className={className} size={size} />;
    case "Extra Travelling":
      return <MapPin className={className} size={size} />;
    case "Vegetables":
      return <Leaf className={className} size={size} />;
    case "Outside Food":
      return <Utensils className={className} size={size} />;
    case "Salary":
      return <Briefcase className={className} size={size} />;
    case "Freelance":
      return <Laptop className={className} size={size} />;
    case "Investment":
      return <TrendingUp className={className} size={size} />;
    case "Gifts":
      return <Gift className={className} size={size} />;
    case "Other Income":
      return <Coins className={className} size={size} />;
    default:
      return <HelpCircle className={className} size={size} />;
  }
};

export const CATEGORY_COLORS: Record<Category, string> = {
  "Room Rent": "bg-sky-100 text-sky-600",
  "Travel to Home": "bg-blue-100 text-blue-600",
  "Daily Travelling": "bg-cyan-100 text-cyan-600",
  "Extra Travelling": "bg-indigo-100 text-indigo-600",
  Vegetables: "bg-emerald-100 text-emerald-600",
  "Outside Food": "bg-amber-100 text-amber-600",
  Salary: "bg-emerald-100 text-emerald-600",
  Freelance: "bg-teal-100 text-teal-600",
  Investment: "bg-purple-100 text-purple-600",
  Gifts: "bg-rose-100 text-rose-600",
  "Other Income": "bg-emerald-100 text-emerald-600",
};

