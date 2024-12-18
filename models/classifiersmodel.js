const ClassifierClass = require("../app/classifier/classifier");
const Model = require("./modal");
const format = require("date-fns/format");
const Predictions = require("./predictionsmodel");

const classifierobj = new ClassifierClass();
class Classifiers extends Model {
  constructor(dbinstance = null) {
    super();
    this.db = dbinstance;
    this.table = "classifiers";
    this.id = null;
    this.userId = null;
    this.type = null;
    this.creationDate = null;
    this.createdBy = null;
    this.updatedBy = null;
    this.updatedDate = null;
    this.deleted_at = null;
    this.deletedBy = null;
    this.isActive = null;
    this.status = null;
    this.classifierType = null;
  }

  //   getters
  get Id() {
    return this.id;
  }

  get ClassifierType() {
    return this.classifierType;
  }
  get UserId() {
    return this.userId;
  }
  get Type() {
    return this.type;
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
  set ClassifierType(classifierType) {
    this.classifierType = classifierType;
  }
  set UserId(userId) {
    this.userId = userId;
  }
  set Type(type) {
    this.type = type;
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
  async ViewClassifiers() {
    try {
      const results = await this.__viewdata();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  // view one
  async ViewSingleClassifiers() {
    try {
      const results = await this.__viewOne();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  HandlePredictions(predictions, insertId) {
    try {
      const kr_predictions = predictions.data.kr_predictions.predicted_people;
      const lbhprediction = predictions.data.lbhprediction;
      const predicted_class = predictions.data.kr_predictions.predicted_class;
      const data = [];
      kr_predictions.forEach((pr) => {
        data.push({
          confidence: pr.confidence,
          personId: pr.id,
          ranking: pr.rank,
          personName: pr.label,
          classifierId: insertId,
          modelType: "Keras Model",
        });
      });
      data.push({
        confidence: predicted_class.confidence,
        personId: predicted_class.id,
        ranking: predicted_class.rank,
        personName: predicted_class.label,
        classifierId: insertId,
        modelType: "Keras Model",
      });
      lbhprediction.forEach((pr) => {
        data.push({
          confidence: pr.confidence,
          personId: pr.id,
          ranking: 1,
          personName: pr.label,
          classifierId: insertId,
          modelType: "LBH Model",
        });
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  //   add function
  async AddClassifiers(image, url, token) {
    try {
      const predictions = new Predictions(this.db);
      const User = await this.db.findByConditions("users", {
        id: this.userId,
        isActive: 1,
      });
      if (User.length <= 0) {
        throw new Error("No User found");
      }
      classifierobj.token = token;
      if (this.type == "url_image") {
        classifierobj.data = { type: this.type, image: { url: url } };
      } else if (this.type == "blob") {
        classifierobj.data = { type: this.type, image: { blob: url } };
      } else {
        classifierobj.data = { type: this.type, image: image };
      }
      const response = await classifierobj.PredictImage("/classifier/predict");
      this.creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.isActive = 1;
      const results = await this.__add();
      if (results.insertId > 0) {
        const data = this.HandlePredictions(response, results.insertId);
        return await predictions.AddPredictions(data, this.createdBy);
      }
      return results;
    } catch (error) {
      throw error;
    }
  }

  async HandlePredictAdudio(data) {
    try {
      const predictions = new Predictions(this.db);
      if (!data.path) throw new Error("Path is required");
      classifierobj.token = data.token;
      classifierobj.data = { audio: { path: data.path } };
      const response = await classifierobj.PredictImage("/audio/predict");
      this.creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.isActive = 1;
      const results = await this.__add();
      if (results.insertId > 0) {
        const predictionsdata = this.HandleAudioPredictions(
          response,
          results.insertId
        );
        return await predictions.AddPredictions(
          predictionsdata,
          this.createdBy
        );
      }
      return results;
    } catch (error) {
      throw error;
    }
  }

  HandleAudioPredictions(response, insertId) {
    const predicted = response.data.predict;
    const others = response.data.others;
    const predictiondata = [];
    if (predicted) {
      predictiondata.push({
        confidence: predicted.confidence,
        personId: predicted.id,
        ranking: 1,
        personName: predicted.label,
        classifierId: insertId,
        modelType: "Audio Model",
      });
    }
    if (others) {
      others.forEach((pr, index) => {
        predictiondata.push({
          confidence: pr.confidence,
          personId: pr.id,
          ranking: index + 2,
          personName: pr.label,
          classifierId: insertId,
          modelType: "Audio Model",
        });
      });
    }
    return predictiondata;
  }
  //   update function
  async UpdateClassifiers() {
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
      throw new Error(error);
    }
  }
  //   delete function
  async DeleteClassifiers() {
    try {
      this.deleted_at = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      const results = await this.__delete();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async UpdateFound(personId, found = 1) {
    try {
      const predictions = new Predictions(this.db);
      predictions.updatedBy = this.updatedBy;
      predictions.classifierId = this.id;
      predictions.personId = personId;
      const response = await predictions.UpdateMatch(found);
      if (Array.isArray(response)) {
        if (found == 1) {
          this.status = "Match Found";
        } else {
          this.status = "No Match Found";
        }
        await this.__update();
        return response;
      }
      return [];
    } catch (error) {
      throw error;
    }
  }

  async HandleLivePredicions(data) {
    try {
      const { token, userId, stream } = data;
      classifierobj.token = token;
      classifierobj.data = { userId, stream };
      const response = await classifierobj.HandleRealTime(
        "/classifier/realtime/start"
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async StopLivePredicions(data) {
    try {
      const { token, userId } = data;
      classifierobj.token = token;
      classifierobj.data = { userId };
      const response = await classifierobj.HandleRealTime(
        "/classifier/realtime/stop"
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = Classifiers;
