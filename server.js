const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL connection pool

// Middleware
app.use(express.json());

// route
const user = require('./route/user');
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.use('/user', user);



// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
