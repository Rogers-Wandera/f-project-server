const { format } = require("date-fns");
const Model = require("./modal");
const Tempmethods = require("./tempmethods");

class Temrouteroles extends Model {
  constructor(dbinstance = null) {
    super();
    this.db = dbinstance;
    this.table = "temrouteroles";
    this.id = null;
    this.userId = null;
    this.roleName = null;
    this.roleValue = null;
    this.description = null;
    this.expireTime = null;
    this.creationDate = null;
    this.createdBy = null;
    this.modifiedOn = null;
    this.modifiedBy = null;
    this.deleted_at = null;
    this.isActive = null;
  }

  // getters
  get Id() {
    return this.id;
  }
  get UserId() {
    return this.userId;
  }
  get RoleName() {
    return this.roleName;
  }
  get RoleValue() {
    return this.roleValue;
  }
  get Description() {
    return this.description;
  }
  get ExpireTime() {
    return this.expireTime;
  }
  get CreationDate() {
    return this.creationDate;
  }
  get CreatedBy() {
    return this.createdBy;
  }
  get ModifiedOn() {
    return this.modifiedOn;
  }
  get ModifiedBy() {
    return this.modifiedBy;
  }
  get Deleted_at() {
    return this.deleted_at;
  }
  get IsActive() {
    return this.isActive;
  }

  // setters
  set Id(id) {
    this.id = id;
  }
  set UserId(userId) {
    this.userId = userId;
  }
  set RoleName(roleName) {
    this.roleName = roleName;
  }
  set RoleValue(roleValue) {
    this.roleValue = roleValue;
  }
  set Description(description) {
    this.description = description;
  }
  set ExpireTime(expireTime) {
    this.expireTime = expireTime;
  }
  set CreationDate(creationDate) {
    this.creationDate = creationDate;
  }
  set CreatedBy(createdBy) {
    this.createdBy = createdBy;
  }
  set ModifiedOn(modifiedOn) {
    this.modifiedOn = modifiedOn;
  }
  set ModifiedBy(modifiedBy) {
    this.modifiedBy = modifiedBy;
  }
  set Deleted_at(deleted_at) {
    this.deleted_at = deleted_at;
  }
  set IsActive(isActive) {
    this.isActive = isActive;
  }

  async addTemRouteRole(data = {}) {
    try {
      const tempmethodsobj = new Tempmethods(this.db);
      const findUserExists = await this.db.findOne("users", {
        id: this.userId,
      });
      if (!findUserExists) {
        throw new Error("User not found");
      }
      const actualExpireTime = format(
        new Date(this.expireTime),
        "yyyy-MM-dd HH:mm:ss"
      );
      this.expireTime = actualExpireTime;
      this.creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.isActive = 1;
      const results = await this.__add();
      if (!results?.success) {
        throw new Error("Something went wrong");
      }
      const insertId = results.insertId;
      tempmethodsobj.TempRouteId = insertId;
      tempmethodsobj.method = data.method;
      const response = await tempmethodsobj.addTempMethod();
      if (!response?.success) {
        throw new Error("Something went wrong");
      }
      return response;
    } catch (error) {
      throw new Error("method-> addTemRouteRole: " + error.message);
    }
  }

  async removeTempRole() {
    try {
      const tempmethodsobj = new Tempmethods(this.db);
      const result = await this.db.deleteOne("temrouteroles", {
        id: this.id,
      });
      if (result) {
        tempmethodsobj.TempRouteId = this.id;
        await tempmethodsobj.removeTempMethods();
      }
      return true;
    } catch (error) {
      throw new Error("method-> removeTempRole: " + error.message);
    }
  }
}

module.exports = Temrouteroles;
