export type Category = 
  | 'Room Rent' 
  | 'Travel to Home' 
  | 'Daily Travelling' 
  | 'Extra Travelling' 
  | 'Vegetables' 
  | 'Outside Food'
<<<<<<< HEAD
  | 'Other';
=======
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Gifts'
  | 'Other Income';
>>>>>>> 5b8490d781f9b633e07f7d27a2a635b7934ca933

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

