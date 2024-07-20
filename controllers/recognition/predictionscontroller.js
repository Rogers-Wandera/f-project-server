const Predictions = require("../../models/predictionsmodel");
const ViewPredictions = async (req, res) => {
  try {
    const { start, size, filters, globalFilter, sorting } = req.query;
    const predictions = new Predictions(req.db);
    predictions.page = parseInt(start);
    predictions.limit = parseInt(size);
    predictions.filters = JSON.parse(filters);
    predictions.globalFilter = globalFilter;
    predictions.sortBy = JSON.parse(sorting);
    const data = await predictions.ViewPredictions();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const ViewSinglePredictions = async (req, res) => {
  try {
    const { predictionId } = req.params;
    const predictions = new Predictions(req.db);
    predictions.Id = predictionId;
    const data = await predictions.ViewSinglePredictions();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const AddPredictions = async (req, res) => {
  try {
    const {
      classifierId,
      personName,
      confidence,
      personId,
      ranking,
      modelType,
    } = req.body;
    const predictions = new Predictions(req.db);
    predictions.ClassifierId = classifierId;
    predictions.PersonName = personName;
    predictions.Confidence = confidence;
    predictions.PersonId = personId;
    predictions.Ranking = ranking;
    predictions.ModelType = modelType;

    predictions.createdBy = req.user.id;
    const results = await predictions.AddPredictions();
    if (results?.success == false) {
      return res.status(400).json({ msg: "something went wrong" });
    }
    res.status(200).json({ msg: "Predictions added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const UpdatePredictions = async (req, res) => {
  try {
    const {
      classifierId,
      personName,
      confidence,
      personId,
      ranking,
      modelType,
    } = req.body;
    const { predictionId } = req.params;
    const predictions = new Predictions(req.db);
    predictions.Id = predictionId;
    predictions.ClassifierId = classifierId;
    predictions.PersonName = personName;
    predictions.Confidence = confidence;
    predictions.PersonId = personId;
    predictions.Ranking = ranking;
    predictions.ModelType = modelType;

    predictions.updatedBy = req.user.id;
    const results = await predictions.UpdatePredictions();
    if (results?.success == false) {
      return res.status(400).json({ msg: "something went wrong" });
    }
    res.status(200).json({ msg: "Predictions updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const DeletePredictions = async (req, res) => {
  try {
    const { predictionId } = req.params;
    const predictions = new Predictions(req.db);
    predictions.Id = predictionId;
    predictions.deletedBy = req.user.id;
    const results = await predictions.DeletePredictions();
    if (results?.success == false) {
      return res.status(400).json({ msg: "something went wrong" });
    }
    res.status(200).json({ msg: "Predictions removed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  AddPredictions,
  UpdatePredictions,
  DeletePredictions,
  ViewPredictions,
  ViewSinglePredictions,
};
