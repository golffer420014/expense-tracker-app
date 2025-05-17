const Schema = require("../lib/db");
const user_yearly_summary = new Schema("user_yearly_summary");
const user_expense_budget_summary = new Schema("user_expense_budget_summary");

const getYearlySummary = async (req, res) => {
  const user_id = req.user?.id;
  const year = req.query.year;
  let query = `WHERE user_id = '${user_id}'`;
  if (year) {
    query += ` AND year = '${year}'`;
  }
  const yearlySummary = await user_yearly_summary.find(query);
  res.status(200).json(yearlySummary);
};

const getExpenseBudgetSummary = async (req, res) => {
  const user_id = req.user?.id;
  const year = req.query.year;
  const month = req.query.month;

  let query = `WHERE user_id = '${user_id}'`;

  if (year) {
    query += ` AND LEFT(month, 4) = '${year}'`;
  }
  if (month) {
    query += ` AND RIGHT(month, 2) = LPAD('${month}', 2, '0')`;
  }

  const expenseBudgetSummary = await user_expense_budget_summary.find(query);
  res.status(200).json(expenseBudgetSummary);
};

module.exports = {
  getYearlySummary,
  getExpenseBudgetSummary,
};
