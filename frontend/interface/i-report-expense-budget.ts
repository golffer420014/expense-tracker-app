export interface iReportExpenseBudget {
    user_id: string;            // UUID
    category_id: number;
    category_name: string;
    total_expense: number;
    budget_amount: number;
    month: string;              // Format: YYYY-MM
    over_budget: number;        // ค่าเป็นลบ = ยังไม่เกิน, ค่าบวก = เกินงบ
    is_over_budget: boolean;
  }
  