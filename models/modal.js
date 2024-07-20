class Model {
  constructor(dbinstance = null) {
    this.table = null;
    this.id = null;
    this.db = dbinstance;
    this.limit = 10;
    this.page = 1;
    this.sortBy = [{ id: "id", desc: true }];
    this.conditions = {
      isActive: 1,
    };
    this.filters = [];
    this.globalFilter = null;
  }

  attributes() {
    const attributes = {};
    const instancekeys = Object.keys(this);
    instancekeys.forEach((key) => {
      if (
        typeof this[key] !== "function" &&
        key !== "table" &&
        key !== "db" &&
        key !== "limit" &&
        key !== "page" &&
        key !== "sortBy" &&
        key !== "sortOrder" &&
        key !== "conditions" &&
        key !== "filters" &&
        key !== "globalFilter"
      ) {
        if (this[key] !== null && this[key] !== undefined) {
          attributes[key] = this[key];
        }
      }
    });
    return attributes;
  }

  async __find() {
    try {
      const exists = await this.db.findByConditions(this.table, {
        id: this.id,
        isActive: 1,
      });
      if (exists.length <= 0) {
        // remove away the s in table if any
        const table = this.table.replace(/s$/, "");
        throw new Error(`No ${table} found`);
      }
      return exists;
    } catch (error) {
      throw new Error("method-> __find: " + error.message);
    }
  }

  async __add() {
    try {
      if (!this.table) {
        throw new Error("Table name is required");
      }
      const attributes = this.attributes();
      const result = await this.db.insertOne(this.table, attributes);
      return result;
    } catch (error) {
      throw new Error("method-> __add: " + error.message);
    }
  }

  async __update() {
    try {
      if (!this.table) {
        throw new Error("Table name is required");
      }
      const attributes = this.attributes();
      if (!this.id) {
        throw new Error("Id is required");
      }
      await this.__find();
      const result = await this.db.updateOne(
        this.table,
        { id: this.id },
        attributes
      );
      return result;
    } catch (error) {
      throw new Error("method-> __update: " + error.message);
    }
  }

  async __delete(idfield = "id") {
    try {
      if (!this.table) {
        throw new Error("Table name is required");
      }
      if (!this.id) {
        throw new Error("Id is required");
      }
      await this.__find();
      const result = await this.db.softDelete(this.table, {
        [idfield]: this.id,
      });
      return result;
    } catch (error) {
      throw new Error("method-> __delete: " + error.message);
    }
  }
  async __viewdata() {
    try {
      if (!this.table) {
        throw new Error("Table name is required");
      }
      const data = await this.db.findPaginate(
        this.table,
        this.limit,
        this.page,
        this.sortBy.length > 0 ? this.sortBy : [{ id: "id", desc: true }],
        this.conditions,
        this.filters,
        this.globalFilter
      );
      return data;
    } catch (error) {
      throw new Error("method-> __viewdata: " + error.message);
    }
  }

  async __viewOne() {
    try {
      if (!this.table) {
        throw new Error("Table name is required");
      }
      if (!this.id) {
        throw new Error("Id is required");
      }
      const data = await this.db.findByConditions(this.table, {
        id: this.id,
        isActive: 1,
      });
      if (data.length <= 0) {
        throw new Error(`No ${this.table} found`);
      }
      return data[0];
    } catch (error) {
      throw new Error("method-> __viewOne: " + error.message);
    }
  }

  async __harddelete() {
    try {
      if (!this.table) {
        throw new Error("Table name is required");
      }
      if (!this.id) {
        throw new Error("Id is required");
      }
      await this.__find();
      const result = await this.db.deleteOne(this.table, { id: this.id });
      return result;
    } catch (error) {
      throw new Error("method-> __harddelete: " + error.message);
    }
  }

  async __findcriteria(criteria = {}) {
    try {
      if (!this.table) {
        throw new Error("Table name is required");
      }
      if (Object.keys(criteria).length <= 0) {
        throw new Error("Criteria is required and should be an object");
      }
      const data = await this.db.findByConditions(this.table, {
        isActive: 1,
        ...criteria,
      });
      return data;
    } catch (error) {
      throw new Error("method-> __findcriteria: " + error.message);
    }
  }

  async __viewCustomQueryPaginate(query = null, params = []) {
    try {
      if (!query) {
        throw new Error("Query is required");
      }
      const data = await this.db.customQueryPaginate(
        query,
        params,
        this.limit,
        this.page,
        this.sortBy.length > 0 ? this.sortBy : [{ id: "id", desc: true }],
        this.filters,
        this.globalFilter
      );
      return data;
    } catch (error) {
      throw new Error("method-> __viewCustomQueryPaginate: " + error.message);
    }
  }

  async Find(conditions = {}) {
    try {
      if (!this.table) {
        throw new Error("Table name is required");
      }
      const data = await this.db.findByConditions(this.table, conditions);
      return data;
    } catch (error) {
      throw new Error("method-> Find: " + error.message);
    }
  }
}

module.exports = Model;
