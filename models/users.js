const Model = require("./modal");
const format = require("date-fns/format");

class UserModel extends Model {
  constructor(dbinstance) {
    super();
    this.db = dbinstance;
    this.table = "positions";
    this.id = null;
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
}

module.exports = UserModel;
