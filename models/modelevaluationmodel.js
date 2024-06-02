const Model = require("./modal");

const format = require("date-fns/format");
class Modelevaluation extends Model {
  constructor(dbinstance = null) {
    super();
    this.db = dbinstance;
    this.table = "modelevaluation";
    this.id = null;
    this.trainerId = null;
    this.testAccuracy = null;
    this.testLoss = null;
    this.trainAccuracy = null;
    this.trainLoss = null;
    this.modelName = null;
    this.status = null;
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
  get TrainerId() {
    return this.trainerId;
  }
  get TestAccuracy() {
    return this.testAccuracy;
  }
  get TestLoss() {
    return this.testLoss;
  }
  get TrainAccuracy() {
    return this.trainAccuracy;
  }
  get TrainLoss() {
    return this.trainLoss;
  }
  get ModelName() {
    return this.modelName;
  }
  get Status() {
    return this.status;
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
  set TrainerId(trainerId) {
    this.trainerId = trainerId;
  }
  set TestAccuracy(testAccuracy) {
    this.testAccuracy = testAccuracy;
  }
  set TestLoss(testLoss) {
    this.testLoss = testLoss;
  }
  set TrainAccuracy(trainAccuracy) {
    this.trainAccuracy = trainAccuracy;
  }
  set TrainLoss(trainLoss) {
    this.trainLoss = trainLoss;
  }
  set ModelName(modelName) {
    this.modelName = modelName;
  }
  set Status(status) {
    this.status = status;
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
  async ViewModelevaluation(type = "Image") {
    try {
      const sql = `SELECT mv.*,tr.itemsCount,tr.type,tr.userId, 
      CONCAT(ur.firstname, ' ', ur.lastname) as userName FROM modelevaluation mv INNER JOIN trainer tr ON tr.id = mv.trainerId
      INNER JOIN users ur ON ur.id = tr.userId WHERE tr.type = ?`;
      const data = await this.__viewCustomQueryPaginate(sql, [type]);
      return data;
    } catch (error) {
      throw error;
    }
  }
  // view one
  async ViewSingleModelevaluation(type = "Image") {
    try {
      const sql = `SELECT mv.*,tr.itemsCount,tr.type,tr.userId, 
      CONCAT(ur.firstname, ' ', ur.lastname) as userName FROM modelevaluation mv INNER JOIN trainer tr ON tr.id = mv.trainerId
      INNER JOIN users ur ON ur.id = tr.userId WHERE tr.type = ? AND mv.status = 'Current'`;
      const results = await this.db.executeQuery(sql, [type]);
      if (results.length > 0) {
        return results[0];
      }
      return {};
    } catch (error) {
      throw error;
    }
  }
  //   add function
  async AddModelevaluation(type) {
    try {
      this.creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.isActive = 1;
      const sql = `SELECT mv.*,tr.itemsCount,tr.type,tr.userId, 
      CONCAT(ur.firstname, ' ', ur.lastname) as userName FROM modelevaluation mv INNER JOIN trainer tr ON tr.id = mv.trainerId
      INNER JOIN users ur ON ur.id = tr.userId WHERE tr.type = ? AND mv.status = 'Current'`;
      const response = await this.db.executeQuery(sql, [type]);
      const dbinstance = this.db;
      if (response.length > 0) {
        const promises = response.map(async (item) => {
          const modelevaluation = new Modelevaluation(dbinstance);
          modelevaluation.id = item.id;
          modelevaluation.status = "Old";
          modelevaluation.updatedBy = this.createdBy;
          const response = await modelevaluation.UpdateModelevaluation();
          return response;
        });
        await Promise.all(promises);
      }
      const results = await this.__add();
      return results;
    } catch (error) {
      throw error;
    }
  }
  //   update function
  async UpdateModelevaluation() {
    try {
      this.updatedDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      const results = await this.__update();
      return results;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = Modelevaluation;
