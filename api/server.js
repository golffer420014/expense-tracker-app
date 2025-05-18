const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3009;
const authMiddleware = require("./middleware/auth");

const path_name = process.env.PATH_NAME;
// PostgreSQL connection pool

// Middleware
app.use(cors());
app.use(express.json());
app.use(authMiddleware);

// route
const user = require("./route/user");
const categories = require("./route/categories");
const transactions = require("./route/transactions");
const auth = require("./route/auth");
const budgets = require("./route/budgets");
const reports = require("./route/reports");

app.get(`${path_name}`, (req, res) => {
  res.send("Hello World X");
});

app.use(`${path_name}/auth`, auth);
app.use(`${path_name}/user`, user);
app.use(`${path_name}/categories`, categories);
app.use(`${path_name}/transactions`, transactions);
app.use(`${path_name}/budgets`, budgets);
app.use(`${path_name}/reports`, reports);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running at ${path_name}:${port}`);
});
