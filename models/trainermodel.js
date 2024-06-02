const ClassifierClass = require("../app/classifier/classifier");
const Model = require("./modal");
const format = require("date-fns/format");
const { v4: uuid } = require("uuid");
const Modelevaluation = require("./modelevaluationmodel");

const classifier = new ClassifierClass();
class Trainer extends Model {
  constructor(dbinstance = null) {
    super();
    this.db = dbinstance;
    this.table = "trainer";
    this.id = null;
    this.userId = null;
    this.type = null;
    this.itemsCount = null;
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
  get UserId() {
    return this.userId;
  }
  get Type() {
    return this.type;
  }
  get ItemsCount() {
    return this.itemsCount;
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
  set UserId(userId) {
    this.userId = userId;
  }
  set Type(type) {
    this.type = type;
  }
  set ItemsCount(itemsCount) {
    this.itemsCount = itemsCount;
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
  async ViewTrainer() {
    try {
      const results = await this.__viewdata();
      return results;
    } catch (error) {
      throw error;
    }
  }
  // view one
  async ViewSingleTrainer() {
    try {
      const results = await this.__viewOne();
      return results;
    } catch (error) {
      throw error;
    }
  }
  //   add function
  async AddTrainer(token, options) {
    try {
      const modelevaluation = new Modelevaluation(this.db);
      const User = await this.db.findByConditions("users", {
        id: this.userId,
        isActive: 1,
      });
      if (User.length <= 0) {
        throw new Error("No User found");
      }
      this.id = uuid();
      classifier.token = token;
      let url = "/audio/train";
      if (this.type.toLowerCase() === "image") {
        url = "/classifier/train";
        const variants = await classifier.checkVariants();
        classifier.data = { ...options, ...variants };
      }
      const response = await classifier.trainClassifier(url);
      this.ItemsCount = response.data.itemsCount;
      modelevaluation.testAccuracy = response.data.evaluation.Test[0];
      modelevaluation.testLoss = response.data.evaluation.Test[1];
      modelevaluation.trainAccuracy = response.data.evaluation.Train[0];
      modelevaluation.trainLoss = response.data.evaluation.Train[1];
      modelevaluation.modelName = response.data.modelName;
      modelevaluation.status = "Current";
      modelevaluation.trainerId = this.id;
      modelevaluation.createdBy = this.createdBy;
      this.creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.isActive = 1;
      const results = await this.__add();
      if (results["success"] == true) {
        await modelevaluation.AddModelevaluation(this.type);
      }
      return response.data.msg;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = Trainer;
