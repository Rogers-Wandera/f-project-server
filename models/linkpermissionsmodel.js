const Model = require("./modal");

const modulelinks = require("./modulelinksmodel");

const format = require("date-fns/format");
class Linkpermissions extends Model {
  constructor(dbinstance = null) {
    super();
    this.db = dbinstance;
    this.table = "linkpermissions";
    this.id = null;
    this.linkId = null;
    this.accessName = null;
    this.acessRoute = null;
    this.method = null;
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
  get LinkId() {
    return this.linkId;
  }
  get AccessName() {
    return this.accessName;
  }
  get AcessRoute() {
    return this.acessRoute;
  }
  get Method() {
    return this.method;
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
  set LinkId(linkId) {
    this.linkId = linkId;
  }
  set AccessName(accessName) {
    this.accessName = accessName;
  }
  set AcessRoute(acessRoute) {
    this.acessRoute = acessRoute;
  }
  set Method(method) {
    this.method = method;
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
  async ViewLinkpermissions() {
    try {
      const results = await this.__viewCustomQueryPaginate(
        "SELECT *FROM vw_linkpermissions WHERE linkId = ?",
        [this.linkId]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  // view one
  async ViewSingleLinkpermissions() {
    try {
      const results = await this.__viewOne();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  //   add function
  async AddLinkpermissions() {
    try {
      const Modulelink = new modulelinks(this.db);
      Modulelink.Id = this.linkId;
      await Modulelink.__find();
      this.creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.isActive = 1;
      const results = await this.__add();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  //   update function
  async UpdateLinkpermissions() {
    try {
      this.updatedDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      const results = await this.__update();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  //   delete function
  async DeleteLinkpermissions() {
    try {
      this.deleted_at = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      const results = await this.__delete();

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async ViewSelectPermissions() {
    try {
      const results = await this.db.findByConditions("vw_linkpermissions", {
        linkId: this.linkId,
      });
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
}
module.exports = Linkpermissions;
