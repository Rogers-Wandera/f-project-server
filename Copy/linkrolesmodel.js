const Model = require("./modal");

const modulelinks = require("./modulelinksmodel");
const format = require("date-fns/format");
class Linkroles extends Model {
  constructor(dbinstance = null) {
    super();
    this.db = dbinstance;
    this.table = "linkroles";
    this.id = null;
    this.linkId = null;
    this.userId = null;
    this.expireDate = null;

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
  get LinkId() {
    return this.linkId;
  }
  get UserId() {
    return this.userId;
  }
  get ExpireDate() {
    return this.expireDate;
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
  set LinkId(linkId) {
    this.linkId = linkId;
  }
  set UserId(userId) {
    this.userId = userId;
  }
  set ExpireDate(expireDate) {
    this.expireDate = expireDate;
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
  async ViewLinkroles() {
    try {
      const results = await this.__viewdata();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  // view one
  async ViewSingleLinkroles() {
    try {
      const results = await this.__viewOne();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  //   add function
  async AddLinkroles() {
    try {
      const Modulelink = new modulelinks();
      const User = await this.db.findByConditions("user", {
        id: this.userId,
        isActive: 1,
      });
      Modulelink.Id = this.linkId;
      await Modulelink.__find();
      if (User.length <= 0) {
        throw new Error("No User found");
      }
      this.creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.isActive = 1;
      const results = await this.__add();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  //   update function
  async UpdateLinkroles() {
    try {
      const Modulelink = new modulelinks();
      const User = await this.db.findByConditions("user", {
        id: this.userId,
        isActive: 1,
      });
      Modulelink.Id = this.linkId;
      await Modulelink.__find();
      if (User.length <= 0) {
        throw new Error("No User found");
      }
      this.updatedDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      const results = await this.__update();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  //   delete function
  async DeleteLinkroles() {
    try {
      this.deleted_at = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      const results = await this.__delete();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
}
module.exports = Linkroles;
