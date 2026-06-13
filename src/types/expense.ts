export type Category = 
  | 'Room Rent' 
  | 'Travel to Home' 
  | 'Daily Travelling' 
  | 'Extra Travelling' 
  | 'Vegetables' 
  | 'Outside Food'
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Gifts'
  | 'Other Income';

export interface Expense {
  id: string;
  date: string;
  category: Category;
  amount: number;
  notes?: string;
  type: 'expense' | 'income';
}

export interface Budget {
  amount: number;
  month: string; // YYYY-MM format
}

