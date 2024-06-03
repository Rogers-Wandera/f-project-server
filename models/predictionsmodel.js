const Model = require("./modal");

const classifiers = require("./classifiersmodel");

const format = require("date-fns/format");
class Predictions extends Model {
  constructor(dbinstance = null) {
    super();
    this.db = dbinstance;
    this.table = "predictions";
    this.id = null;
    this.classifierId = null;
    this.personName = null;
    this.confidence = null;
    this.personId = null;
    this.ranking = null;
    this.modelType = null;
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
  get ClassifierId() {
    return this.classifierId;
  }
  get PersonName() {
    return this.personName;
  }
  get Confidence() {
    return this.confidence;
  }
  get PersonId() {
    return this.personId;
  }
  get Ranking() {
    return this.ranking;
  }
  get ModelType() {
    return this.modelType;
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
  set ClassifierId(classifierId) {
    this.classifierId = classifierId;
  }
  set PersonName(personName) {
    this.personName = personName;
  }
  set Confidence(confidence) {
    this.confidence = confidence;
  }
  set PersonId(personId) {
    this.personId = personId;
  }
  set Ranking(ranking) {
    this.ranking = ranking;
  }
  set ModelType(modelType) {
    this.modelType = modelType;
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
  async ViewPredictions() {
    try {
      const results = await this.__viewdata();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  // view one
  async ViewSinglePredictions() {
    try {
      const results = await this.__viewOne();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  HandleResponseData = async () => {
    try {
      const personsmeta = new Model(this.db);
      const person = new Model(this.db);
      const personimages = new Model(this.db);
      person.table = "person";
      personsmeta.table = "personmeta";
      personimages.table = "imagedata";
      const data = await this.db.executeQuery(
        "SELECT *FROM vw_predictions WHERE classifierId = ? order BY confidence DESC",
        [this.classifierId]
      );
      if (data.length > 0) {
        return await Promise.all(
          data.map(async (item) => {
            const meta = await personsmeta.Find({
              personId: item.personId,
              isActive: 1,
            });
            const personData = await person.Find({
              id: item.personId,
            });
            const images = await personimages.Find({
              personId: item.personId,
              isActive: 1,
            });
            item.Person = personData[0];
            item.PersonMeta = meta;
            item.PersonImages = images;
            return item;
          })
        );
      }
      return data;
    } catch (error) {
      throw error;
    }
  };
  //   add function
  async AddPredictions(resdata, createdBy) {
    try {
      const response = resdata.map(async (data) => {
        this.classifierId = data.classifierId;
        this.ranking = data.ranking;
        this.modelType = data.modelType;
        this.personId = data.personId;
        this.confidence = data.confidence;
        this.personName = data.personName;
        this.createdBy = createdBy;
        this.creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
        this.isActive = 1;
        const results = await this.__add();
        return results;
      });
      await Promise.all(response);
      const data = await this.HandleResponseData();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
  //   update function
  async UpdatePredictions() {
    try {
      const Classifier = new classifiers(this.db);
      Classifier.Id = this.classifierId;
      await Classifier.__find();
      this.updatedDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      const results = await this.__update();
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  //   delete function
  async DeletePredictions() {
    try {
      this.deleted_at = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      const results = await this.__delete();

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
}
module.exports = Predictions;
