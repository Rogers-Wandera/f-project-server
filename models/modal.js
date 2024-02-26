class Model {
  constructor(dbinstance = null) {
    this.table = null;
    this.id = null;
    this.db = dbinstance;
  }

  attributes() {
    const attributes = {};
    const instancekeys = Object.keys(this);
    instancekeys.forEach((key) => {
      if (
        typeof this[key] !== "function" &&
        key !== "table" &&
        key !== "id" &&
        key !== "db"
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

  async __delete() {
    try {
      if (!this.table) {
        throw new Error("Table name is required");
      }
      if (!this.id) {
        throw new Error("Id is required");
      }
      await this.__find();
      const result = await this.db.softDelete(this.table, this.id);
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
      const data = await this.db.findPaginate(this.table, 10, 1, "id", "desc", {
        isActive: 1,
      });
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
}

module.exports = Model;
