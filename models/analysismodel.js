const { countqueries, predictionsqueris } = require("../queries/queries");
const Model = require("./modal");

const weeklyDays = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
class AnalysisModel extends Model {
  constructor(dbinstance) {
    super(dbinstance);
  }

  async getCounts() {
    try {
      const data = {};
      for (const key in countqueries) {
        const countdata = await this.db.executeQuery(countqueries[key]);
        data[key] = countdata[0].count;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async GetPredictionsAnalysis(year = new Date().getFullYear()) {
    try {
      const data = {};
      const monthly = await this.monthlyPreditions(year);
      const Weekly = await this.db.executeQuery(
        predictionsqueris["Weekly Predictions"]
      );
      const formmated = Weekly.map((week, index) => {
        const day = weeklyDays[index];
        return { day: day, count: week.prediction_count };
      });
      const daily = await this.DailyPredictions();
      const todaypreddata = await this.TodayPredictionData();
      const predictionscount = await this.PredictionsCount();
      data["monthly"] = monthly;
      data["weekly"] = formmated;
      data["daily"] = daily;
      data["todaydata"] = todaypreddata;
      data["predictioncount"] = predictionscount;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async monthlyPreditions(year = new Date().getFullYear()) {
    const response = await this.db.executeQuery(
      predictionsqueris["Monthly Predictions"],
      [year]
    );
    const monthlyPredictions = Array(12).fill(0);
    response.forEach((row) => {
      monthlyPredictions[row.month - 1] = row.prediction_count;
    });
    return monthlyPredictions;
  }

  async DailyPredictions() {
    const response = await this.db.executeQuery(
      predictionsqueris["Daily Predictions"]
    );
    return {
      count: response[0].prediction_count,
      match: Number(response[0].matched_count),
    };
  }

  async TodayPredictionData() {
    const response = await this.db.executeQuery(
      predictionsqueris["Today Predictions Data"]
    );
    return response;
  }

  async PredictionsCount() {
    const data = {};
    for (const key in predictionsqueris["Predictions Count"]) {
      const response = await this.db.executeQuery(
        predictionsqueris["Predictions Count"][key]
      );
      data[key] = response[0].count;
    }
    return data;
  }
}
module.exports = AnalysisModel;
