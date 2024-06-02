const Model = require("./modal");

const format = require("date-fns/format");
class Refreshtokens extends Model {
  constructor(dbinstance = null) {
    super();
    this.db = dbinstance;
    this.table = "refreshtokens";
    this.id = null;
    this.userId = null;
    this.token = null;
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
  get UserId() {
    return this.userId;
  }
  get Token() {
    return this.token;
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
  set UserId(userId) {
    this.userId = userId;
  }
  set Token(token) {
    this.token = token;
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
  async ViewRefreshtokens() {
    try {
      const results = await this.__viewdata();
      return results;
    } catch (error) {
      throw error;
    }
  }
  // view one
  async ViewSingleRefreshtokens() {
    try {
      const token = await this.db.findByConditions(this.table, {
        userId: this.userId,
      });
      if (token.length <= 0) {
        throw new Error("No token found for this account");
      }
      const results = token[0];
      return results;
    } catch (error) {
      throw error;
    }
  }
  //   add function
  async AddRefreshtokens() {
    try {
      const User = await this.db.findByConditions("users", {
        id: this.userId,
        isActive: 1,
      });
      if (User.length <= 0) {
        throw new Error("No User found");
      }
      const findtokenexists = await this.db.findByConditions(this.table, {
        userId: this.userId,
      });
      if (findtokenexists.length > 0) {
        this.updatedBy = this.userId;
        this.updatedDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
        this.id = findtokenexists[0].id;
        this.creationDate = findtokenexists[0].creationDate;
        return this.__update();
      }
      this.creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.isActive = 1;
      const results = await this.__add();
      return results;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = Refreshtokens;
