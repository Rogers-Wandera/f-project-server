const mysql = require("mysql2/promise");
const { logEvent } = require("../../middlewares/logs");
const { dbConfig } = require("../configs");

class Connection {
  constructor() {
    this.pool = mysql.createPool(dbConfig);
    this.connection = null;
  }

  async startTransaction() {
    try {
      if (this.connection) {
        await this.connection.beginTransaction();
      }
    } catch (error) {
      throw new Error("Error starting transaction: " + error.message);
    }
  }
  async connectDB() {
    try {
      this.connection = await this.pool.getConnection();
    } catch (error) {
      throw new Error("Error connecting to db: " + error.message);
    }
  }
  async disconnectDb() {
    try {
      if (this.connection) {
        this.connection.release();
      }
    } catch (error) {
      throw new Error("Error disconnecting db: " + error.message);
    }
  }

  async executeQuery(query, params = []) {
    try {
      if (!this.connection) {
        await this.connectDB();
      }
      const [rows, fileds] = await this.connection.query(query, params);
      return rows;
    } catch (error) {
      logEvent(error.message, "sql_error.md");
      throw new Error("method-> executeQuery: " + error.message);
    }
  }
}

module.exports = Connection;
