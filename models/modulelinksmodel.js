const { format } = require("date-fns");
const Model = require("./modal");
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
    this.render = null;
    this.released = null;
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

  get Released() {
    return this.released;
  }

  get Render() {
    return this.render;
  }
  //   setters
  set Id(id) {
    this.id = id;
  }
  set ModuleId(moduleId) {
    this.moduleId = moduleId;
  }
  set Released(released) {
    this.released = released;
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

  set Render(render) {
    this.render = render;
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
            moduleId: this.moduleId,
          }
        );
      } else {
        const query =
          "Select *from ?? where linkname = ? and isActive = 1 and id != ? and moduleId = ?";
        const [rows] = await this.db.executeQuery(query, [
          this.table,
          this.linkname,
          this.id,
          this.moduleId,
        ]);
        if (rows?.length > 0) {
          exists = rows[0];
        }
      }
      return exists;
    } catch (error) {
      throw error;
    }
  }

  async restoreDeletedModule() {
    try {
      const exists = await this.findLinkByName(0);
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
      throw error;
    }
  }

  async handlePosition(action = "add") {
    try {
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
        const findExists = await this.__viewOne();
        if (!findExists) {
          throw new Error("Module Link does not exist");
        }
        position = findExists.position;
        const sql =
          "SELECT *FROM modulelinks WHERE isActive = 1 AND moduleId = ? AND position = ?;";
        const response = await this.db.executeQuery(sql, [
          this.moduleId,
          this.position,
        ]);
        if (response.length <= 0) {
          throw new Error("The position you want to replace to does not exist");
        }
        if (this.position == position) {
          this.position = position;
          return;
        }
        const newId = response[0].id;
        const newposition = position;
        const update = await this.db.findOneAndUpdate(
          this.table,
          { id: newId, isActive: 1 },
          { position: newposition }
        );
        this.position = response[0].position;
        return update;
      }
    } catch (error) {
      throw error;
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
      throw error;
    }
  }

  async UpdateLink() {
    try {
      const exists = await this.findLinkByName(1, "update");
      if (exists) {
        throw new Error("Link with that name already exist");
      }
      await this.handlePosition("update");
      const results = await this.__update();
      if (results == true) {
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      throw error;
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
      throw error;
    }
  }

  async ViewModuleLinks() {
    try {
      const query = `SELECT *FROM vw_module_links WHERE moduleId = ?;`;
      const data = await this.__viewCustomQueryPaginate(query, [this.moduleId]);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async CalculateNextPosition(moduleId) {
    try {
      const data = await this.db.findByConditions(this.table, {
        moduleId: moduleId,
      });
      let lastposition = 1;
      if (data.length > 0) {
        const lastitem = data[data.length - 1];
        const lastpos = lastitem.position;
        lastposition = lastpos + 1;
      }
      return lastposition;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ModuleLinks;
