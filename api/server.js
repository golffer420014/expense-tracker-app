const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL connection pool

// Middleware
app.use(express.json());
// const auth = require('./middleware/auth');
// app.use(auth);

// route
const user = require('./route/user');
const categories = require('./route/categories');
const transactions = require('./route/transactions');

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/user', user);
app.use('/categories', categories);
app.use('/transactions', transactions);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
