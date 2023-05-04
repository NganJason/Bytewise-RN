export const monthlyBudgetInfo = {
  budget_id: 1,
  cat_id: 1,
  cat_name: 'Personal',
  budget_type: 1,
  budget_year: 2023,
  currency: 'SGD',
  default_budget: 1000,
  budget_breakdown: [
    {
      month: 0,
      budget: 500,
    },
    {
      month: 1,
      budget: 500,
    },
    {
      month: 2,
      budget: 500,
    },
    {
      month: 3,
      budget: 500,
    },
    {
      month: 4,
      budget: 500,
    },
    {
      month: 5,
      budget: 500,
    },
    {
      month: 6,
      budget: 500,
    },
    {
      month: 7,
      budget: 500,
    },
    {
      month: 8,
      budget: 500,
    },
    {
      month: 9,
      budget: 500,
    },
    {
      month: 10,
      budget: 500,
    },
    {
      month: 11,
      budget: 500,
    },
  ],
};

export const annualBudgetInfo = {
  budget_id: 1,
  cat_id: 1,
  cat_name: 'Personal',
  budget_type: 2,
  budget_year: 2023,
  currency: 'SGD',
  default_budget: 1000,
  budget_breakdown: [],
};

export const monthlyBudgetV2 = {
  category_id: 1,
  budget_id: 2,
  budget_type: 1,
  default_budgets: [
    { year: 2023, month: 5, budget: 1000 },
    { year: 2023, month: 9, budget: 2000 },
  ],
  non_default_budgets: [{ year: 2023, month: 8, budget: 1500 }],
};

export const annualBudgetV2 = {
  category_id: 2,
  budget_id: 3,
  budget_type: 2,
  default_budgets: [
    { year: 2023, month: 0, budget: 10000 },
    { year: 2024, month: 0, budget: 20000 },
  ],
  non_default_budgets: [],
};
