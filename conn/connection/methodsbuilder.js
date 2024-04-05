const { logEvent } = require("../../middlewares/logs");
const Connection = require("./conn");

class DBMethodsBuilder extends Connection {
  constructor() {
    super();
  }

  async countRecords(table) {
    try {
      const query = `SELECT COUNT(*) AS count FROM ?? WHERE isActive = 1;`;
      const [rows] = await this.executeQuery(query, [table]);
      return rows;
    } catch (error) {
      throw new Error("method-> countRecords: " + error.message);
    }
  }

  async countFieldCriteria(table, field) {
    try {
      const query = `select max(??) as pos from ??;`;
      const [rows] = await this.executeQuery(query, [field, table]);
      return rows || null;
    } catch (error) {
      throw new Error("method-> countFieldCriteria: " + error.message);
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
      const sql = `CREATE TABLE ?? (${columnDefinitions}, creationDate datetime not null,
        createdBy varchar(200) not null,updatedBy varchar(200) null, updatedDate datetime null,
        deleted_at datetime null, deletedBy varchar(200) null, isActive int default 1)`;
      const [results] = await this.connection.query(sql, [table]);
      logEvent(sql, "sql_query.md");
      if (
        results.warningStatus === 0 ||
        (results.warningStatus > 0 && results.affectedRows === 0)
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      logEvent(error.sql, "sql_error.md");
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
  async deleteOne(table, id) {
    try {
      const exists = await this.findOne(table, id);
      if (!exists) {
        throw new Error("No record found");
      }
      const query = `DELETE FROM ?? WHERE id = ?`;
      const results = await this.executeQuery(query, [table, exists.id]);
      await this.deleteRecycleData(table, exists.id);
      if (results.affectedRows === 1) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error("method-> deleteOne: " + error.message);
    }
  }
  async findOneWithValue(table, field, value, additional_args = {}) {
    try {
      let query = `SELECT * FROM ?? WHERE LOWER(??) = LOWER(?)`;
      const params = [table, field, value];

      // Loop through additional_args object and add conditions to the query
      let conditionCount = 0;
      for (const key in additional_args) {
        if (additional_args.hasOwnProperty(key)) {
          query += conditionCount === 0 ? " AND" : " AND";
          query += ` ?? = ?`;
          params.push(key, additional_args[key]);
          conditionCount++;
        }
      }

      const rows = await this.executeQuery(query, params);
      return rows[0] || null;
    } catch (error) {
      throw new Error("method-> findOneWithValue: " + error.message);
    }
  }
}

module.exports = DBMethodsBuilder;
