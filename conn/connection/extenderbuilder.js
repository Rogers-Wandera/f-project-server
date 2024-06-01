const { logEvent } = require("../../middlewares/logs");
const DBMethodsBuilder = require("./methodsbuilder");
const { format, differenceInDays } = require("date-fns");

class ConnectionBuilder extends DBMethodsBuilder {
  constructor() {
    super();
  }
  async FindSelectiveOne(table, id, fields = "*") {
    try {
      let query;
      let params;

      if (Array.isArray(fields)) {
        // If fields is an array, join the fields with commas
        query = `SELECT ?? FROM ?? WHERE ?`;
        params = [fields, table, id];
      } else {
        // If fields is a string or not provided, use it directly
        query = `SELECT ${fields} FROM ?? WHERE ?`;
        params = [table, id];
      }
      // const query = `SELECT * FROM ?? WHERE ?`;
      const rows = await this.executeQuery(query, params);
      return rows[0] || null;
    } catch (error) {
      throw new Error("method-> FindSelectiveOne: " + error.message);
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

  async saveRecycleBin(original_table, original_record_id) {
    try {
      if (!this.connection) {
        throw new Error("Connection not established");
      }
      const data = {
        original_table_name: original_table,
        original_record_id: original_record_id,
        deleted_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        isActive: 1,
      };
      const results = await this.insertOne("recyclebin", data);
      return results;
    } catch (error) {
      throw new Error("method-> saveRecycleBin: " + error.message);
    }
  }

  async softDelete(table, id) {
    try {
      const exists = await this.findOne(table, id);
      if (!exists) {
        throw new Error("No record found");
      }
      // const query = `DELETE FROM ?? WHERE id = ?`;
      const query = `UPDATE ?? SET deleted_at = ?, isActive = 0 WHERE id = ?`;
      const results = await this.executeQuery(query, [
        table,
        format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        exists.id,
      ]);
      await this.saveRecycleBin(table, exists.id);
      if (results.affectedRows === 1) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error("method-> softDelete: " + error.message);
    }
  }

  async restoreDelete(table, id) {
    try {
      if (!this.connection) {
        throw new Error("Connection not established");
      }
      const response = await this.updateOne(table, id, {
        deleted_at: null,
        isActive: 1,
      });
      const findData = await this.findByConditions("recyclebin", {
        original_table_name: table,
        original_record_id: id,
      });
      if (findData.length > 0) {
        const sql = "DELETE FROM recyclebin WHERE id = ?";
        await this.connection.query(sql, [findData[0].id]);
        return true;
      }
      return response;
    } catch (error) {
      throw new Error("method-> restoreDelete: " + error.message);
    }
  }

  async deleteRecycleData(table, id) {
    try {
      if (!this.connection) {
        throw new Error("Connection not established");
      }
      const findData = await this.findByConditions("recyclebin", {
        original_table_name: table,
        original_record_id: id,
      });
      if (findData.length > 0) {
        const sql = "DELETE FROM recyclebin WHERE id = ?";
        await this.connection.query(sql, [findData[0].id]);
      }
    } catch (error) {
      throw new Error("method-> deleteRecycleData: " + error.message);
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
      let count = 0;
      for (const record of data) {
        const [results] = await this.connection.query(query, [table, record]);
        if (results.affectedRows === 1) {
          count++;
        }
      }
      if (count === data.length) {
        return { success: true };
      } else {
        return { success: false };
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
        .map((column) => {
          let clause = `${column} = ?`;
          // check the condition if &ne
          const clausecondition = conditions[column];
          if (typeof clausecondition === "object") {
            // check the condition if $ne
            if (clausecondition?.$ne) {
              clause = `${column} != ?`;
            }
          }
          return clause;
        })
        .join(" AND ");
      const values = Object.values(conditions).map((val) => {
        let formattedval = val;
        if (typeof val === "object") {
          // check the condition if $ne
          if (val?.$ne) {
            formattedval = val.$ne;
          }
        }
        return formattedval;
      });
      const sql = `SELECT *FROM ?? WHERE ${whereclause}`;
      const [results] = await this.connection.query(sql, [table, ...values]);
      return results;
    } catch (error) {
      throw new Error("method-> findByConditions: " + error.message);
    }
  }

  async getTableColumns(table) {
    try {
      if (!this.connection) {
        throw new Error("Connection not established");
      }
      const [columns] = await this.connection.query(`SHOW COLUMNS FROM ??`, [
        table,
      ]);
      return columns.map((column) => column.Field);
    } catch (error) {
      throw new Error("method-> getTableColumns: " + error.message);
    }
  }

  async getColumnsQuery(query, params = []) {
    try {
      if (!this.connection) {
        throw new Error("Connection not established");
      }
      const [columns] = await this.connection.query(query, params);
      if (columns.length === 0) return [];
      const data = columns[0];
      const keys = Object.keys(data);
      return keys;
    } catch (error) {
      throw new Error("method-> getTableColumns: " + error.message);
    }
  }

  async findPaginate(
    table,
    limit = 10,
    page = 1,
    sortBy = [],
    conditions = null,
    filters = [],
    globalFilter = null
  ) {
    try {
      if (!this.connection) {
        throw new Error("Connection not established");
      }
      if (!table) {
        throw new Error("Table is required");
      }

      let sql = `SELECT *FROM ?? `;
      const queryvalues = [table];

      if (conditions && Object.keys(conditions).length > 0) {
        // constructing a where clause
        const whereClause = Object.keys(conditions)
          .map((column) => `${column} = ?`)
          .join(" AND ");
        sql += `WHERE ${whereClause}`;
        // constructing the values
        const values = Object.values(conditions);
        queryvalues.push(...values);
      }

      if (globalFilter) {
        const columns = await this.getTableColumns(table);
        const queryValues = Array(columns.length).fill(`%${globalFilter}%`);
        if (conditions && Object.keys(conditions).length > 0) {
          const globalSearchCluases = columns
            .map((columns) => `${columns} LIKE ?`)
            .join(" OR ");
          sql += ` AND (${globalSearchCluases})`;
          queryvalues.push(...queryValues);
        } else {
          const globalSearchCluases = columns
            .map((columns) => `${columns} LIKE ?`)
            .join(" OR ");
          sql += `WHERE (${globalSearchCluases})`;
          queryvalues.push(...queryValues);
        }
      }
      if (filters.length > 0) {
        const filterClauses = filters.map((filter) => `${filter.id} LIKE ?`);
        const filterValues = filters.map((filter) => {
          const namefiled = filter.id.toLowerCase();
          let value = "";
          if (namefiled.includes("date")) {
            const dateformat = format(new Date(filter.value), "yyyy-MM-dd");
            value = `%${dateformat}%`;
          } else {
            value = `%${filter.value}%`;
          }
          return value;
        });
        const filterCluase = filterClauses.join(" AND ");
        if (conditions && Object.keys(conditions).length > 0) {
          sql += ` AND ${filterCluase}`;
        } else if (globalFilter) {
          sql += ` AND ${filterCluase}`;
        } else {
          sql += `WHERE ${filterCluase}`;
        }
        queryvalues.push(...filterValues);
      }

      if (sortBy.length > 0) {
        const sort = sortBy[0].id;
        let sortorder = "ASC";
        if (sortBy[0].desc == true) {
          sortorder = "DESC";
        }
        sql += ` ORDER BY ?? ${sortorder}`;
        queryvalues.push(sort);
      }

      if (limit) {
        sql += " LIMIT ?";
        queryvalues.push(limit);
      }
      const offsetval = (page - 1) * limit;
      sql += " OFFSET ?";
      queryvalues.push(offsetval);
      const count = await this.countRecords(table);
      const totalPages = Math.ceil(count.count / limit);
      const [results] = await this.connection.query(sql, queryvalues);

      const resultSet = {
        docs: [],
        totalDocs: 0,
        totalPages: 0,
        page: 0,
      };
      if (results.length > 0) {
        resultSet.docs = results;
        resultSet.totalDocs = count.count;
        resultSet.totalPages = totalPages;
        resultSet.page = page;
      }
      return resultSet;
    } catch (error) {
      logEvent(error.sql, "sql_error.md");
      throw new Error("method-> findPaginate: " + error.message);
    }
  }

  async performJoin(
    mainTable,
    jointable,
    conditions = null,
    sortBy = null,
    sortOrder = null,
    limit = 10,
    page = 1
  ) {
    try {
      // expected format
      // "tokens",
      //   [
      //     {
      //       table: "roles",
      //       alias: "rs",
      //       condition: "rs.userId = us.id",
      //       join: "LEFT",
      //       columns: ["rs.role"],
      //     },
      //   ];
      if (!this.connection) {
        throw new Error("Connection not established");
      }
      if (!mainTable || !jointable) {
        throw new Error("Main join Table, jointables are required");
      }
      if (!Array.isArray(jointable)) {
        throw new Error("jointable must be an array");
      }

      let sql = "SELECT mt.*";
      const queryvalues = [mainTable];
      for (let i = 0; i < jointable.length; i++) {
        if (jointable[i].columns) {
          for (let x = 0; x < jointable[i].columns.length; x++) {
            sql += `, ${jointable[i].columns[x]}`;
          }
        }
      }
      sql += " FROM ?? as mt";
      for (let i = 0; i < jointable.length; i++) {
        sql += ` ${jointable[i].join} JOIN ?? AS ${jointable[i].alias} ON ${jointable[i].condition}`;
        queryvalues.push(jointable[i].table);
      }

      if (conditions && Object.keys(conditions).length > 0) {
        // constructing a where clause
        const whereClause = Object.keys(conditions)
          .map((column) => `${column} = ?`)
          .join(" AND ");
        sql += ` WHERE ${whereClause}`;
        // constructing the values
        const values = Object.values(conditions);
        queryvalues.push(...values);
      }

      if (sortBy && sortOrder) {
        const order = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";
        sql += ` ORDER BY ?? ${order}`;
        queryvalues.push(sortBy);
      }

      if (limit) {
        sql += " LIMIT ?";
        queryvalues.push(limit);
      }
      const offsetval = (page - 1) * limit;
      sql += " OFFSET ?";
      queryvalues.push(offsetval);

      const count = await this.countRecords(mainTable);
      const totalPages = Math.ceil(count.count / limit);
      const [results] = await this.connection.query(sql, queryvalues);

      const resultSet = {
        docs: [],
        totalDocs: 0,
        totalPages: 0,
        page: 0,
      };
      if (results.length > 0) {
        resultSet.docs = results;
        resultSet.totalDocs = count.count;
        resultSet.totalPages = totalPages;
        resultSet.page = page;
      }
      return resultSet;
    } catch (error) {
      throw new Error("method-> performJoin: " + error.message);
    }
  }

  async getAllTables() {
    try {
      if (!this.connection) {
        throw new Error("Connection not established");
      }
      const [results] = await this.connection.query("SHOW TABLES");
      const tables = results.map(
        (table) => table[`Tables_in_${process.env.DB_NAME}`]
      );
      return tables;
    } catch (error) {
      throw new Error("method-> getAllTables: " + error.message);
    }
  }

  async DeleteRecycleBinData() {
    try {
      if (!this.connection) {
        throw new Error("Connection not established");
      }
      const date = new Date();
      const data = await this.findAll("recyclebin");
      const outdated = data.filter((item) => {
        const deletedAt = new Date(item.deleted_at);
        const daysSinceDeletion = differenceInDays(date, deletedAt);
        const outdatedThreshhold = 30;
        item.daysSinceDeletion = daysSinceDeletion;
        return daysSinceDeletion > outdatedThreshhold;
      });
      let tables = [];
      let records = 0;
      if (outdated.length > 0) {
        await this.deleteMany(
          "recyclebin",
          outdated.map((item) => item.id)
        );

        for (let i = 0; i < outdated.length; i++) {
          await this.deleteOne(outdated[i].original_table_name, {
            id: outdated[i].original_record_id,
          });
        }

        tables = outdated.map((item) => item.original_table_name);
        records = outdated.length;
      }
      console.log(records);
      if (records > 0) {
        await this.insertOne("schedulerrun", {
          original_table_name: "recyclebin",
          records_affected: records,
          action: "deletion",
          isActive: 1,
          daterun: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        });
      }
      return { tables, records, action: "deletion" };
    } catch (error) {
      throw new Error("method->RecycleBinData: " + error.message);
    }
  }

  async customQueryPaginate(
    query,
    queryParams = [],
    limit = 10,
    page = 1,
    sortBy = [],
    filters = [],
    globalFilter = null
  ) {
    try {
      if (!this.connection) {
        throw new Error("Connection not established");
      }
      if (!query) {
        throw new Error("Query is required");
      }

      let sql = query.trim();
      const queryValues = [...queryParams];

      if (sql.trim().endsWith(";")) {
        sql = sql.trim().slice(0, -1);
      }

      // Extracting existing WHERE clause, if any
      let existingWhereClause = false;
      const whereIndex = sql.toUpperCase().indexOf("WHERE");
      if (whereIndex !== -1) {
        existingWhereClause = sql.substring(whereIndex);
        sql = sql.substring(0, whereIndex);
        sql += existingWhereClause;
        existingWhereClause = true;
      }

      if (globalFilter) {
        const columns = await this.getColumnsQuery(query, queryParams);
        const queryvalues = Array(columns.length).fill(`%${globalFilter}%`);
        if (existingWhereClause) {
          const globalSearchCluases = columns
            .map((columns) => `${columns} LIKE ?`)
            .join(" OR ");
          sql += ` AND (${globalSearchCluases})`;
          queryValues.push(...queryvalues);
        } else {
          const globalSearchCluases = columns
            .map((columns) => `${columns} LIKE ?`)
            .join(" OR ");
          sql += `WHERE (${globalSearchCluases})`;
          queryValues.push(...queryvalues);
        }
      }

      const another = sql.toUpperCase().indexOf("WHERE");
      if (another !== -1) {
        existingWhereClause = sql.substring(whereIndex);
        sql = sql.substring(0, whereIndex);
        sql += existingWhereClause;
        existingWhereClause = true;
      }

      // Applying additional filters
      if (filters.length > 0) {
        const filterClauses = filters.map((filter) => `${filter.id} LIKE ?`);
        const filterValues = filters.map((filter) => {
          let value = "";
          value = `%${filter.value}%`;
          return value;
        });
        const filterClause = filterClauses.join(" AND ");
        if (existingWhereClause) {
          sql += ` AND (${filterClause})`;
        } else {
          sql += ` WHERE ${filterClause}`;
        }
        queryValues.push(...filterValues);
      }

      const alldata = await this.executeQuery(sql, queryValues);
      const count = alldata.length;

      // Applying sorting
      if (sortBy.length > 0) {
        const sort = sortBy[0].id;
        let sortOrder = "ASC";
        if (sortBy[0].desc) {
          sortOrder = "DESC";
        }
        sql += ` ORDER BY ${sort} ${sortOrder}`;
      }

      // Applying pagination
      if (limit) {
        sql += " LIMIT ?";
        queryValues.push(limit);
      }
      const offsetVal = (page - 1) * limit;
      sql += " OFFSET ?";
      sql += ";";
      queryValues.push(offsetVal);

      // Execute query
      const [results] = await this.connection.query(sql, queryValues);
      const totalPages = Math.ceil(count / limit);

      // Return paginated results
      const resultSet = {
        docs: results || [],
        totalDocs: count,
        totalPages: totalPages,
        page: page,
      };

      return resultSet;
    } catch (error) {
      logEvent(error.sql, "sql_error.md");
      throw new Error("method-> customQueryPaginate: " + error.message);
    }
  }
}

module.exports = ConnectionBuilder;
