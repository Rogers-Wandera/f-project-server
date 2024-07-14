const AnalysisModel = require("../../models/analysismodel");

const CountDataAnalysis = async (req, res) => {
  try {
    const analysismodel = new AnalysisModel(req.db);
    const counts = await analysismodel.getCounts();
    res.status(200).json({ data: counts });
  } catch (error) {
    throw error;
  }
};

const PredictionsAnalysis = async (req, res) => {
  try {
    const analysismodel = new AnalysisModel(req.db);
    const year = req.query.year;
    const response = await analysismodel.GetPredictionsAnalysis(
      year || new Date().getFullYear()
    );
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(200).json({ error: error.message });
  }
};

module.exports = { CountDataAnalysis, PredictionsAnalysis };
