const { Pool } = require("pg");
require("dotenv").config();

// ตั้งค่าการเชื่อมต่อกับ Neon PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // http
  // ssl: process.env.NODE_ENV === 'production'
  //   ? { rejectUnauthorized: false, sslmode: 'require' }
  //   : false
  // https
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
