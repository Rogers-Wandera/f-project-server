const Model = require("./modal");

const format = require("date-fns/format");
class Userprofileimages extends Model {
  constructor(dbinstance = null) {
    super();
    this.db = dbinstance;
    this.table = "userprofileimages";
    this.id = null;
    this.image = null;
    this.userId = null;
    this.creationDate = null;
    this.createdBy = null;
    this.updatedBy = null;
    this.updatedDate = null;
    this.deleted_at = null;
    this.deletedBy = null;
    this.isActive = null;
    this.public_id = null;
  }

  //   getters
  get Id() {
    return this.id;
  }
  get Image() {
    return this.image;
  }
  get UserId() {
    return this.userId;
  }

  get Public_id() {
    return this.public_id;
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
  set Image(image) {
    this.image = image;
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
  set Public_id(public_id) {
    this.public_id = public_id;
  }
  //   view data
  async ViewUserprofileimages() {
    try {
      const results = await this.__viewdata();
      return results;
    } catch (error) {
      throw error;
    }
  }
  // view one
  async ViewSingleUserprofileimages() {
    try {
      const results = await this.__viewOne();
      return results;
    } catch (error) {
      throw error;
    }
  }
  async findImageExists() {
    try {
      const results = await this.db.findByConditions("userprofileimages", {
        userId: this.userId,
        isActive: 1,
      });
      if (results.length > 0) {
        return results[0];
      }
      return [];
    } catch (error) {
      throw new Error(error.message);
    }
  }
  //   add function
  async AddUserprofileimages() {
    try {
      const exists = await this.findImageExists();
      if (Object.keys(exists).length > 0) {
        const id = exists.id;
        this.id = id;
        const response = await this.db.findOneAndUpdate(
          this.table,
          {
            id: this.id,
          },
          { public_id: this.public_id, image: this.image }
        );
        return response;
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
  async UpdateUserprofileimages() {
    try {
      const User = await this.db.findByConditions("users", {
        id: this.userId,
        isActive: 1,
      });
      if (User.length <= 0) {
        throw new Error("No User found");
      }
      this.updatedDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      const results = await this.__update();
      return results;
    } catch (error) {
      throw error;
    }
  }
  //   delete function
  async DeleteUserprofileimages() {
    try {
      this.deleted_at = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      const results = await this.__delete();
      return results;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = Userprofileimages;
