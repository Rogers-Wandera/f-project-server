const Classifiers = require("../../models/classifiersmodel");
const ViewClassifiers = async (req, res) => {
  try {
    const { start, size, filters, globalFilter, sorting } = req.query;
    const classifiers = new Classifiers(req.db);
    classifiers.page = parseInt(start);
    classifiers.limit = parseInt(size);
    classifiers.filters = JSON.parse(filters);
    classifiers.globalFilter = globalFilter;
    classifiers.sortBy = JSON.parse(sorting);
    const data = await classifiers.ViewClassifiers();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const ViewSingleClassifiers = async (req, res) => {
  try {
    const { classifierId } = req.params;
    const classifiers = new Classifiers(req.db);
    classifiers.Id = classifierId;
    const data = await classifiers.ViewSingleClassifiers();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const AddClassifiers = async (req, res) => {
  try {
    const { userId, type, image, url, predictionType } = req.body;
    const classifiers = new Classifiers(req.db);
    classifiers.UserId = userId;
    classifiers.Type = type;
    classifiers.classifierType = predictionType;
    classifiers.createdBy = req.user.id;
    const results = await classifiers.AddClassifiers(image, url, req.token);
    if (!Array.isArray(results)) {
      throw new Error("Failed to classify image");
    }
    res
      .status(200)
      .json({ msg: "Classifiers added successfully", data: results });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  AddClassifiers,
  ViewClassifiers,
  ViewSingleClassifiers,
};
