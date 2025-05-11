const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3009;
const authMiddleware = require('./middleware/auth');


// PostgreSQL connection pool

// Middleware
app.use(cors());
app.use(express.json());
app.use(authMiddleware);

// route
const user = require('./route/user');
const categories = require('./route/categories');
const transactions = require('./route/transactions');
const auth = require('./route/auth');
const budgets = require('./route/budgets');
const reports = require('./route/reports');

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/auth', auth);
app.use('/user', user);
app.use('/categories', categories);
app.use('/transactions', transactions);
app.use('/budgets', budgets);
app.use('/reports', reports);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
