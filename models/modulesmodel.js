const Model = require("./modal");

class Modules extends Model {
  constructor(dbinstance = null) {
    super();
    this.table = "modules";
    this.id = null;
    this.name = null;
    this.position = null;
    this.deleted_at = null;
    this.creationDate = null;
    this.isActive = null;
    this.db = dbinstance;
  }

  //   getters
  get Name() {
    return this.name;
  }
  get Position() {
    return this.position;
  }
  get DeletedAt() {
    return this.deleted_at;
  }
  get CreationDate() {
    return this.creationDate;
  }
  get IsActive() {
    return this.isActive;
  }
  get Id() {
    return this.id;
  }

  //   setters
  set Name(name) {
    this.name = name;
  }
  set Position(position) {
    this.position = position;
  }
  set DeletedAt(deleted_at) {
    this.deleted_at = deleted_at;
  }
  set CreationDate(creationDate) {
    this.creationDate = creationDate;
  }
  set IsActive(isActive) {
    this.isActive = isActive;
  }
  set Id(id) {
    this.id = id;
  }
  async findModuleByName(active = 1) {
    try {
      const exists = await this.db.findOneWithValue(
        "modules",
        "name",
        this.name,
        { isActive: active }
      );
      return exists;
    } catch (error) {
      throw new Error(error);
    }
  }

  async restoreDeletedModule() {
    try {
      const exists = await this.findModuleByName(0);
      let position = 0;
      if (exists) {
        this.id = exists.id;
        position = exists.position;
        if (this.position) {
          const findposition = await this.db.findByConditions("modules", {
            position: this.position,
          });
          if (findposition.length > 0) {
            const id = findposition[0].id;
            await this.db.updateOne(
              "modules",
              { id: id },
              { position: position }
            );
            await this.db.updateOne(
              "modules",
              { id: this.id },
              { position: this.position }
            );
          }
        }
        const response = await this.db.restoreDelete(this.table, {
          id: this.id,
        });
        this.id = null;
        return response;
      }
      return false;
    } catch (error) {
      throw new Error(error);
    }
  }
  async AddModules() {
    try {
      const exists = await this.findModuleByName();
      if (exists) {
        throw new Error("Module already exists");
      }
      const response = await this.restoreDeletedModule();
      if (response == true) {
        return { success: true };
      }
      const lastposition = await this.db.countFieldCriteria(
        "modules",
        "position"
      );

      let position = 1;
      if (lastposition?.pos !== null) {
        position = lastposition.pos + 1;
      }
      if (this.position) {
        const findposition = await this.db.findByConditions("modules", {
          position: this.position,
        });
        if (findposition.length > 0) {
          const id = findposition[0].id;
          const pos = findposition[0].position;
          await this.db.updateOne(
            "modules",
            { id: id },
            { position: position }
          );
          position = pos;
        }
      }
      this.position = position;
      const result = await this.__add();
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async DeleteModules() {
    try {
      const result = await this.__delete();
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async UpdateModules() {
    try {
      let position = 0;
      const module = await this.__find();
      position = module[0].position;
      if (this.position) {
        const findposition = await this.db.findByConditions("modules", {
          position: this.position,
        });
        if (findposition.length <= 0) {
          throw new Error("The position you want to replace to does not exist");
        }
        // if (this.position == findposition[0].position) {
        //   throw new Error("The position you want to replace to is same");
        // }
        if (findposition.length > 0) {
          const id = findposition[0].id;
          await this.db.updateOne(
            "modules",
            { id: id },
            { position: position }
          );
        }
      }
      const result = await this.__update();
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async CalculateNextPosition() {
    try {
      const data = await this.db.findAll(this.table);
      let lastposition = 1;
      if (data.length > 0) {
        const lastitem = data[data.length - 1];
        const lastpos = lastitem.position;
        lastposition = lastpos + 1;
      }
      return lastposition;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = Modules;
