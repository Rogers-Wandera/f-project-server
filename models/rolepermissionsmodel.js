const Model = require("./modal");

const linkroles = require("./linkrolesmodel");
const linkpermissions = require("./linkpermissionsmodel");

const format = require("date-fns/format");
class Rolepermissions extends Model {
  constructor(dbinstance = null) {
    super();
    this.db = dbinstance;
    this.table = "rolepermissions";
    this.id = null;
    this.roleId = null;
    this.permissionId = null;
    this.userId = null;

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
  get RoleId() {
    return this.roleId;
  }
  get PermissionId() {
    return this.permissionId;
  }
  get UserId() {
    return this.userId;
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
  set RoleId(roleId) {
    this.roleId = roleId;
  }
  set PermissionId(permissionId) {
    this.permissionId = permissionId;
  }
  set UserId(userId) {
    this.userId = userId;
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
  async ViewRolepermissions() {
    try {
      const results = await this.__viewdata();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  // view one
  async ViewSingleRolepermissions() {
    try {
      const results = await this.__viewOne();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  //   add function
  async AddRolepermissions() {
    try {
      const Linkrole = new linkroles(this.db);
      const Linkpermission = new linkpermissions(this.db);
      const User = await this.db.findByConditions("users", {
        id: this.userId,
        isActive: 1,
      });
      Linkrole.Id = this.roleId;
      await Linkrole.__find();
      Linkpermission.Id = this.permissionId;
      await Linkpermission.__find();
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
  async UpdateRolepermissions() {
    try {
      const Linkrole = new linkroles(this.db);
      const Linkpermission = new linkpermissions(this.db);
      const User = await this.db.findByConditions("users", {
        id: this.userId,
        isActive: 1,
      });
      Linkrole.Id = this.roleId;
      await Linkrole.__find();
      Linkpermission.Id = this.permissionId;
      await Linkpermission.__find();
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
  async DeleteRolepermissions() {
    try {
      this.deleted_at = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      const results = await this.__delete();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
}
module.exports = Rolepermissions;
