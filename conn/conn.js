const mysql = require("mysql2/promise");

class Connection {
  constructor(config) {
    this.pool = mysql.createPool(config);
    this.connection = null;
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
        throw new Error("Connection not established");
      }
      const [rows, fileds] = await this.connection.query(query, params);
      return rows;
    } catch (error) {
      throw new Error("method-> executeQuery: " + error.message);
    }
  }

  async createTable(table, columns) {
    try {
      if (!this.connection) {
        throw new Error("Connection not established");
      }
      if (!table && !columns && !columns.length === 0) {
        throw new Error("Table and columns are required or invalid");
      }
      const columnDefinitions = columns
        .map((column) => {
          return `${column.name} ${column.type}`;
        })
        .join(", ");
      const sql = `CREATE TABLE ?? (${columnDefinitions})`;
      const [results] = await this.connection.query(sql, [table]);
      if (
        results.warningStatus === 0 ||
        (results.warningStatus > 0 && results.affectedRows === 0)
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error("method-> createTable: " + error.message);
    }
  }

  async findOne(table, id) {
    try {
      const query = `SELECT * FROM ?? WHERE ?`;
      const rows = await this.executeQuery(query, [table, id]);
      return rows[0] || null;
    } catch (error) {
      throw new Error("method-> findOne: " + error.message);
    }
  }

  async findAll(table) {
    try {
      const query = `SELECT * FROM ??`;
      const rows = await this.executeQuery(query, [table]);
      return rows;
    } catch (error) {
      throw new Error("method-> findAll: " + error.message);
    }
  }

  async findAllById(table, id) {
    try {
      const query = `SELECT * FROM ?? WHERE id = ?`;
      const rows = await this.executeQuery(query, [table, id]);
      return rows;
    } catch (error) {
      throw new Error("method-> findAllById: " + error.message);
    }
  }

  async updateOne(table, id, data) {
    try {
      if (!this.connection) {
        throw new Error("Connection not established");
      }
      const exists = await this.findOne(table, id);
      if (!exists) {
        throw new Error("No record found");
      }
      const query = `UPDATE ?? SET ? WHERE ?`;
      const [results] = await this.connection.query(query, [table, data, id]);
      if (results.affectedRows === 1) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error("method-> updateone: " + error.message);
    }
  }

  async findOneAndUpdate(table, conditions, updateData) {
    try {
      if (!this.connection) {
        throw new Error("Connection not established");
      }
      if (
        !table ||
        !conditions ||
        Object.keys(conditions).length === 0 ||
        !updateData
      ) {
        throw new Error("Table, conditions, and updateData are required");
      }

      const whereClause = Object.keys(conditions)
        .map((column) => `${column} = ?`)
        .join(" AND ");

      const values = Object.values(conditions);

      const setClause = Object.keys(updateData)
        .map((column) => `${column} = ?`)
        .join(", ");

      const updateValues = Object.values(updateData);

      const sql = `UPDATE ?? SET ${setClause} WHERE ${whereClause}`;
      const [results] = await this.connection.query(sql, [
        table,
        ...updateValues,
        ...values,
      ]);
      if (results.affectedRows === 1) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteOne(table, id) {
    try {
      const exists = this.findOne(table, id);
      if (!exists) {
        throw new Error("No record found");
      }
      const query = `DELETE FROM ?? WHERE id = ?`;
      const results = await this.executeQuery(query, [table, id]);
      if (results.affectedRows === 1) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error("method-> deleteOne: " + error.message);
    }
  }

  async deleteMany(table, ids) {
    try {
      const query = `DELETE FROM ?? WHERE id IN (?)`;
      const results = await this.executeQuery(query, [table, ids]);
      if (results.affectedRows === ids.length) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error("method-> deleteMany: " + error.message);
    }
  }

  async insertOne(table, data) {
    try {
      if (!this.connection) {
        throw new Error("Connection not established");
      }
      const query = `INSERT INTO ?? SET ?`;
      const [results] = await this.connection.query(query, [table, data]);
      if (results.affectedRows === 1) {
        return { insertId: results.insertId, success: true };
      } else {
        return { insertId: 0, success: false };
      }
    } catch (error) {
      throw new Error("method-> insertOne: " + error.message);
    }
  }

  async insertMany(table, data) {
    try {
      if (!this.connection) {
        throw new Error("Connection not established");
      }
      if (!Array.isArray(data) || !data.length) {
        throw new Error("Invalid data provided!! Array expected");
      }
      const query = `INSERT INTO ?? SET ?`;
      for (const record of data) {
        const [results] = await this.connection.query(query, [table, record]);
        if (results.affectedRows === 1) {
          return { insertId: results.insertId, success: true };
        } else {
          throw new Error("Error inserting data");
        }
      }
    } catch (error) {
      throw new Error("method-> insertMany: " + error.message);
    }
  }

  async findByConditions(table, conditions) {
    try {
      if (!this.connection) {
        throw new Error("Connection not established");
      }
      if (!table || !conditions || Object.keys(conditions).length === 0) {
        throw new Error("Table and conditions are required or invalid");
      }
      const whereclause = Object.keys(conditions)
        .map((column) => `${column} = ?`)
        .join(" AND ");
      const values = Object.values(conditions);
      const sql = `SELECT *FROM ?? WHERE ${whereclause}`;
      const [results] = await this.connection.query(sql, [table, ...values]);
      return results;
    } catch (error) {
      throw new Error("method-> findByConditions: " + error.message);
    }
  }
}

module.exports = Connection;
