const Model = require("./modal");
const format = require("date-fns/format");

class UserModel extends Model {
  constructor(dbinstance) {
    super();
    this.db = dbinstance;
    this.table = "users";
    this.id = null;
    this.email = null;
  }

  get Id() {
    return this.id;
  }

  set Id(id) {
    this.id = id;
  }

  get Email() {
    return this.email;
  }

  set Email(email) {
    this.email = email;
  }

  async ViewUsers() {
    try {
      const query = "SELECT *FROM usersdata";
      const results = await this.__viewCustomQueryPaginate(query);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async FindUser() {
    try {
      if (!this.id) {
        throw new Error("Id is required");
      }
      const query = `SELECT *FROM usersdata WHERE id = ?`;
      const results = await this.db.executeQuery(query, [this.id]);
      if (results.length <= 0) {
        throw new Error(`No ${this.table} found`);
      }
      return results[0];
    } catch (error) {
      throw new Error("method-> FindUser: " + error.message);
    }
  }
}

module.exports = UserModel;