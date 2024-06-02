const Model = require("./modal");

const linkroles = require("./linkrolesmodel");
const linkpermissions = require("./linkpermissionsmodel");

const format = require("date-fns/format");
const Temrouteroles = require("./temrouteroles");
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
  async ViewRolepermissions(linkId = 0) {
    try {
      const query = `SELECT lp.*,rp.roleId,rp.id as rpId,mr.userId,
      CASE WHEN mr.id IS NULL THEN 0 ELSE 1 END AS checked FROM vw_linkpermissions lp 
      LEFT JOIN rolepermissions rp ON rp.permissionId = lp.id AND rp.isActive = 1
      AND rp.userId = ?
      LEFT JOIN vw_module_roles mr on mr.id = rp.roleId AND mr.userId = ?
      WHERE lp.linkId = ?;`;
      const data = await this.db.executeQuery(query, [
        this.userId,
        this.userId,
        linkId,
      ]);
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  // view one
  async ViewSingleRolepermissions() {
    try {
      const results = await this.__viewOne();
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  //   add function
  async AddRolepermissions() {
    try {
      const Linkrole = new linkroles(this.db);
      const Linkpermission = new linkpermissions(this.db);
      const temprouteroles = new Temrouteroles(this.db);
      const User = await this.db.findByConditions("users", {
        id: this.userId,
        isActive: 1,
      });
      Linkrole.Id = this.roleId;
      const actualrole = await Linkrole.__find();
      Linkpermission.Id = this.permissionId;
      const linkpermission = await Linkpermission.__find();
      if (User.length <= 0) {
        throw new Error("No User found");
      }
      temprouteroles.CreatedBy = this.createdBy;
      temprouteroles.RoleName = linkpermission[0].accessName;
      temprouteroles.RoleValue = linkpermission[0].acessRoute;
      temprouteroles.UserId = this.userId;
      temprouteroles.Description = linkpermission[0].description;
      temprouteroles.expireTime = actualrole[0].expireDate;
      this.creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.isActive = 1;
      const findTempRoles = await this.db.findByConditions("vw_usertemproles", {
        userId: this.userId,
        roleValue: temprouteroles.roleValue,
        method: linkpermission[0].method,
        isActive: 1,
      });
      if (findTempRoles.length > 0) {
        throw new Error("Permission already exists");
      }
      const results = await this.__add();
      if (results?.success) {
        await temprouteroles.addTemRouteRole({
          method: linkpermission[0].method,
        });
      }
      return results;
    } catch (error) {
      throw new Error(error.message);
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
      // const results = await this.__update();
      // return results;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  //   delete function
  async DeleteRolepermissions() {
    try {
      const query = `SELECT lp.*,rp.roleId,rp.id as rpId,mr.userId,
      CASE WHEN mr.id IS NULL THEN 0 ELSE 1 END AS checked FROM vw_linkpermissions lp 
      LEFT JOIN rolepermissions rp ON rp.permissionId = lp.id AND rp.isActive = 1
      LEFT JOIN vw_module_roles mr on mr.id = rp.roleId WHERE rp.id = ?`;
      const findPermission = await this.db.executeQuery(query, [this.id]);
      if (findPermission.length <= 0) {
        throw new Error("Permission not found");
      }
      this.deleted_at = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      const results = await this.__delete();
      await this.deleteCallback(findPermission[0]);
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteCallback(data) {
    try {
      const temrouteobj = new Temrouteroles(this.db);
      const findTempRoles = await this.db.findByConditions("vw_usertemproles", {
        userId: data.userId,
        roleValue: data.acessRoute,
        method: data.method,
        isActive: 1,
      });
      if (findTempRoles.length > 0) {
        const id = findTempRoles[0].tempRouteId;
        temrouteobj.Id = id;
        const response = await temrouteobj.removeTempRole();
        return response;
      }
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteRolePermission(roleId) {
    try {
      const query = `SELECT *FROM ?? WHERE roleId = ? AND isActive = 1`;
      const data = await this.db.executeQuery(query, [this.table, roleId]);
      if (data.length > 0) {
        const ids = data.map((item) => item.id);
        const remove = await this.db.deleteMany(this.table, ids);
        return remove;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
module.exports = Rolepermissions;
