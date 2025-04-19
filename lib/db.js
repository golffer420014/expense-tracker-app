const pool = require('./pool');

class Schema {
  constructor(tableName) {
    this.tableName = tableName;
  }

  // Insert (Create) - คล้าย MongoDB insert
  async insert(data) {
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders}) RETURNING *;`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Get All (Read) - คล้าย MongoDB find
  async find(query = '') {
    const result = await pool.query(`SELECT * FROM ${this.tableName} ${query}`);
    return result.rows;
  }

  async findOne(query = '') {
    const result = await pool.query(`SELECT * FROM ${this.tableName} ${query} LIMIT 1`);
    return result.rows[0];
  }

  // Update (Update) - คล้าย MongoDB update
  async update(updateData, condition) {
    const columns = Object.keys(updateData);
    const values = Object.values(updateData);
    const updateSet = columns.map((col, i) => `${col} = $${i + 1}`).join(", ");
    const query = `UPDATE ${this.tableName} SET ${updateSet} WHERE ${condition} RETURNING *;`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete (Delete) - คล้าย MongoDB delete
  async delete(condition) {
    const query = `DELETE FROM ${this.tableName} WHERE ${condition} RETURNING *;`;
    const result = await pool.query(query);
    return result.rows[0];
  }

  async query(query) {
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error(`Error executing query:`, error.message);
      throw new Error('Custom query failed');
    }
  }
}

module.exports = Schema;

