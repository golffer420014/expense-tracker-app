import pool from './pool';

class Schema {
  constructor(tableName) {
    this.tableName = tableName;
  }

  // Insert (Create) - คล้าย MongoDB insert
  async insert(data) {
    try {
      const columns = Object.keys(data).join(", ");
      const values = Object.values(data);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");
      const query = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders}) RETURNING *;`;
      const result = await pool.query(query, values);
      console.log(result);
      return result.rows[0];
    } catch (error) {
      console.error(`Error inserting into ${this.tableName}:`, error.message);
      throw new Error('Insert operation failed');
    }
  }

  // Get All (Read) - คล้าย MongoDB find
  async find(query = '') {
    try {
      const result = await pool.query(`SELECT * FROM ${this.tableName} ${query}`);
      return result.rows;
    } catch (error) {
      console.error(`Error finding records in ${this.tableName}:`, error.message);
      throw new Error('Find operation failed');
    }
  }

  async findOne(query = '') {
    try {
      const result = await pool.query(`SELECT * FROM ${this.tableName} ${query} LIMIT 1`);
      return result.rows[0];
    } catch (error) {
      console.error(`Error finding one record in ${this.tableName}:`, error.message);
      throw new Error('FindOne operation failed');
    }
  }

  // Update (Update) - คล้าย MongoDB update
  async update(updateData, condition) {
    try {
      const columns = Object.keys(updateData);
      const values = Object.values(updateData);
      const updateSet = columns.map((col, i) => `${col} = $${i + 1}`).join(", ");
      const query = `UPDATE ${this.tableName} SET ${updateSet} WHERE ${condition} RETURNING *;`;
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error(`Error updating record in ${this.tableName}:`, error.message);
      throw new Error('Update operation failed');
    }
  }

  // Delete (Delete) - คล้าย MongoDB delete
  async delete(condition) {
    try {
      const query = `DELETE FROM ${this.tableName} ${condition} RETURNING *;`;
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error(`Error deleting record from ${this.tableName}:`, error.message);
      throw new Error('Delete operation failed');
    }
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


export default Schema;
