const Model = require("./modal");

const format = require("date-fns/format");
class Systemroles extends Model {
  constructor(dbinstance = null) {
    super();
    this.db = dbinstance;
    this.table = "systemroles";
    this.id = null;
    this.rolename = null;
    this.value = null;
    this.released = null;
    this.description = null;

    this.creationDate = null;
    this.createdBy = null;
    this.updatedBy = null;
    this.updatedDate = null;
    this.deleted_at = null;
    this.deletedBy = null;
    this.isActive = null;
  }

  //   getters
  get Id() {
    return this.id;
  }
  get Rolename() {
    return this.rolename;
  }
  get Value() {
    return this.value;
  }
  get Released() {
    return this.released;
  }
  get Description() {
    return this.description;
  }
  get CreationDate() {
    return this.creationDate;
  }
  get CreatedBy() {
    return this.createdBy;
  }
  get UpdatedBy() {
    return this.updatedBy;
  }
  get UpdatedDate() {
    return this.updatedDate;
  }
  get Deleted_at() {
    return this.deleted_at;
  }
  get DeletedBy() {
    return this.deletedBy;
  }
  get IsActive() {
    return this.isActive;
  }
  //   setters
  set Id(id) {
    this.id = id;
  }
  set Rolename(rolename) {
    this.rolename = rolename;
  }
  set Value(value) {
    this.value = value;
  }
  set Released(released) {
    this.released = released;
  }
  set Description(description) {
    this.description = description;
  }
  set CreationDate(creationDate) {
    this.creationDate = creationDate;
  }
  set CreatedBy(createdBy) {
    this.createdBy = createdBy;
  }
  set UpdatedBy(updatedBy) {
    this.updatedBy = updatedBy;
  }
  set UpdatedDate(updatedDate) {
    this.updatedDate = updatedDate;
  }
  set Deleted_at(deleted_at) {
    this.deleted_at = deleted_at;
  }
  set DeletedBy(deletedBy) {
    this.deletedBy = deletedBy;
  }
  set IsActive(isActive) {
    this.isActive = isActive;
  }
  //   view data
  async ViewSystemroles() {
    try {
      const results = await this.__viewdata();
      return results;
    } catch (error) {
      throw error;
    }
  }
  // view one
  async ViewSingleSystemroles() {
    try {
      const results = await this.__viewOne();
      return results;
    } catch (error) {
      throw error;
    }
  }
  //   add function
  async AddSystemroles() {
    try {
      const exists = await this.__findcriteria({
        rolename: this.rolename,
        isActive: 1,
      });
      if (exists.length > 0) {
        throw new Error("System role already exists");
      }
      this.creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.isActive = 1;
      const results = await this.__add();
      return results;
    } catch (error) {
      throw error;
    }
  }
  //   update function
  async UpdateSystemroles() {
    try {
      const exists = await this.__findcriteria({
        rolename: this.rolename,
        isActive: 1,
        id: { $ne: this.id },
      });
      if (exists.length > 0) {
        throw new Error("System role already exists");
      }
      this.updatedDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      const results = await this.__update();
      return results;
    } catch (error) {
      throw error;
    }
  }
  //   delete function
  async DeleteSystemroles() {
    try {
      this.deleted_at = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      const results = await this.__delete();

      return results;
    } catch (error) {
      throw error;
    }
  }

  async ViewNotAssigned(userId) {
    try {
      if (userId == null || userId == undefined || userId == "") {
        throw new Error("User Id is required");
      }
      const sql = `SELECT *FROM systemroles sr WHERE sr.isActive = 1 AND sr.id NOT IN (
      SELECT ur.roleId FROM user_roles ur WHERE ur.userId = ?);`;
      const results = await this.db.executeQuery(sql, [userId]);
      return results;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = Systemroles;
