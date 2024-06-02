const { format } = require("date-fns");
const Model = require("./modal");

class Tempmethods extends Model {
  constructor(dbinstance = null) {
    super();
    this.db = dbinstance;
    this.table = "tempmethods";
    this.id = null;
    this.tempRouteId = null;
    this.method = null;
    this.deleted_at = null;
    this.creationDate = null;
    this.isActive = null;
  }

  // getters
  get Id() {
    return this.id;
  }
  get TempRouteId() {
    return this.tempRouteId;
  }
  get Method() {
    return this.method;
  }
  get Deleted_at() {
    return this.deleted_at;
  }
  get CreationDate() {
    return this.creationDate;
  }
  get IsActive() {
    return this.isActive;
  }

  // setters
  set Id(id) {
    this.id = id;
  }
  set TempRouteId(tempRouteId) {
    this.tempRouteId = tempRouteId;
  }
  set Method(method) {
    this.method = method;
  }
  set Deleted_at(deleted_at) {
    this.deleted_at = deleted_at;
  }
  set CreationDate(creationDate) {
    this.creationDate = creationDate;
  }
  set IsActive(isActive) {
    this.isActive = isActive;
  }

  async addTempMethod() {
    try {
      this.creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.isActive = 1;
      const results = await this.__add();
      return results;
    } catch (error) {
      throw error;
    }
  }

  async removeTempMethods() {
    try {
      const findTempMethods = await this.db.findByConditions("tempmethods", {
        tempRouteId: this.tempRouteId,
      });
      if (findTempMethods.length > 0) {
        const ids = findTempMethods.map((method) => method.id);
        const result = await this.db.deleteMany("tempmethods", ids);
        if (result) {
          return true;
        }
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Tempmethods;
