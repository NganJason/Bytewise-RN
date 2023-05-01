export const newBudget = (
  budget_id,
  cat_id,
  budget_type,
  budget_year,
  currency,
  default_budget,
  monthly_breakdown,
) => {
  return new Budget(
    budget_id,
    cat_id,
    budget_type,
    budget_year,
    currency,
    default_budget,
    monthly_breakdown,
  );
};

class Budget {
  constructor(
    budget_id,
    cat_id,
    budget_type,
    budget_year,
    currency,
    default_budget,
    monthly_breakdown,
  ) {
    this.budget_id = budget_id;
    this.cat_id = cat_id;
    this.budget_type = budget_type;
    this.budget_year = budget_year;
    this.currency = currency;
    this.default_budget = default_budget;
    this.monthly_breakdown = monthly_breakdown;
  }
}
