const Modelevaluation = require("../../models/modelevaluationmodel");
const ViewModelevaluation = async (req, res) => {
  try {
    const { start, size, filters, globalFilter, sorting } = req.query;
    const { type } = req.params;
    const modelevaluation = new Modelevaluation(req.db);
    modelevaluation.page = parseInt(start);
    modelevaluation.limit = parseInt(size);
    modelevaluation.filters = JSON.parse(filters);
    modelevaluation.globalFilter = globalFilter;
    modelevaluation.sortBy = JSON.parse(sorting);
    const data = await modelevaluation.ViewModelevaluation(type);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const ViewSingleModelevaluation = async (req, res) => {
  try {
    const { type } = req.params;
    const modelevaluation = new Modelevaluation(req.db);
    const data = await modelevaluation.ViewSingleModelevaluation(type);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  ViewModelevaluation,
  ViewSingleModelevaluation,
};
