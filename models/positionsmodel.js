const Model = require("./modal");

const format = require("date-fns/format");
class Positions extends Model {
  constructor(dbinstance = null) {
    super();
    this.db = dbinstance;
    this.table = "positions";
    this.id = null;
    this.position = null;
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
  get Position() {
    return this.position;
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
  set Position(position) {
    this.position = position;
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
  async ViewPositions() {
    try {
      const results = await this.__viewdata();
      return results;
    } catch (error) {
      throw error;
    }
  }
  // view one
  async ViewSinglePositions() {
    try {
      const results = await this.__viewOne();
      return results;
    } catch (error) {
      throw error;
    }
  }
  async findPositionByName(active = 1) {
    try {
      const exists = await this.db.findOneWithValue(
        "positions",
        "position",
        this.position,
        { isActive: active }
      );
      return exists;
    } catch (error) {
      throw error;
    }
  }

  async restoreDeletedPosition() {
    try {
      const exists = await this.findPositionByName(0);
      if (exists) {
        this.id = exists.id;
        const response = await this.db.restoreDelete(this.table, {
          id: this.id,
        });
        this.id = null;
        return response;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
  //   add function
  async AddPositions() {
    try {
      const exists = await this.findPositionByName();
      if (exists) {
        throw new Error("Position already exists");
      }
      const response = await this.restoreDeletedPosition();
      if (response == true) {
        return { success: true };
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
  async UpdatePositions() {
    try {
      this.updatedDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      const results = await this.__update();
      return results;
    } catch (error) {
      throw error;
    }
  }
  //   delete function
  async DeletePositions() {
    try {
      this.deleted_at = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      const results = await this.__delete();
      return results;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = Positions;
