const Schema = require("../lib/db");
const user_yearly_summary = new Schema("user_yearly_summary");

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

module.exports = {
  getYearlySummary,
};
