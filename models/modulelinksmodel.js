const { format } = require("date-fns");
const Model = require("./modal");
const Modules = require("./modulesmodel");
class ModuleLinks extends Model {
  constructor(dbinstance = null) {
    super();
    this.table = "modulelinks";
    this.id = null;
    this.moduleId = null;
    this.linkname = null;
    this.route = null;
    this.position = null;
    this.deleted_at = null;
    this.creationDate = null;
    this.isActive = null;
    this.db = dbinstance;
  }

  //   getters
  get Id() {
    return this.id;
  }
  get ModuleId() {
    return this.moduleId;
  }
  get LinkName() {
    return this.linkName;
  }
  get Route() {
    return this.route;
  }
  get Position() {
    return this.position;
  }
  //   setters
  set Id(id) {
    this.id = id;
  }
  set ModuleId(moduleId) {
    this.moduleId = moduleId;
  }
  set LinkName(linkName) {
    this.linkname = linkName;
  }
  set Route(route) {
    this.route = route;
  }
  set Position(position) {
    this.position = position;
  }

  async findLinkByName(active = 1, action = "add") {
    try {
      let exists = null;
      if (action == "add") {
        exists = await this.db.findOneWithValue(
          this.table,
          "linkname",
          this.linkname,
          {
            isActive: active,
          }
        );
      } else {
        const query =
          "Select *from ?? where ?? = ? and isActive = 1 and ?? != ?";
        const [rows] = await this.db.executeQuery(query, [
          this.table,
          "linkname",
          this.linkname,
          "id",
          this.id,
        ]);
        if (rows.length > 0) {
          exists = rows[0];
        }
      }
      return exists;
    } catch (error) {
      throw new Error(error);
    }
  }

  async restoreDeletedModule() {
    try {
      const exists = await this.findModuleByName(0);
      if (exists) {
        this.id = exists.id;
        this.isActive = 1;
        this.linkname = null;
        const response = await this.db.restoreDelete(this.table, this.id);
        this.id = null;
        this.isActive = null;
        this.linkname = null;
        return response;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async handlePosition(action = "add") {
    if (action == "add") {
      let position = 1;
      const lastposition = await this.db.countFieldCriteria(
        this.table,
        "position"
      );
      if (lastposition?.pos !== null) {
        position = lastposition.pos + 1;
      }
      if (this.position) {
        const findposition = await this.db.findByConditions(this.table, {
          position: this.position,
        });
        if (findposition.length > 0) {
          const id = findposition[0].id;
          const pos = findposition[0].position;
          await this.db.updateOne(
            this.table,
            { id: id },
            { position: position }
          );
          position = pos;
        }
      }
      this.position = position;
    } else {
      let position = 0;
      const module = await this.__find();
      position = module[0].position;
      if (this.position) {
        const findposition = await this.db.findByConditions(this.table, {
          position: this.position,
        });
        if (findposition.length <= 0) {
          throw new Error("The position you want to replace to does not exist");
        }
        if (this.position == findposition[0].position) {
          throw new Error("The position you want to replace to is same");
        }
        if (findposition.length > 0) {
          const id = findposition[0].id;
          await this.db.updateOne(
            this.table,
            { id: id },
            { position: position }
          );
        }
      }
      this.position = position;
    }
  }

  async AddLink() {
    try {
      const exists = await this.findLinkByName();
      if (exists) {
        throw new Error("Link with that name already exist");
      }
      const response = await this.restoreDeletedModule();
      if (response == true) {
        return { success: true };
      }
      await this.handlePosition();
      this.creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.isActive = 1;
      const results = await this.__add();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async UpdateLink() {
    try {
      const exists = await this.findLinkByName(1, "update");
      if (exists) {
        throw new Error("Link with that name already exist");
      }
      await this.handlePosition();
      const results = await this.__update();
      if (results == true) {
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      throw new Error(error);
    }
  }

  async DeleteLink() {
    try {
      const results = await this.__delete();
      if (results == true) {
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = ModuleLinks;
