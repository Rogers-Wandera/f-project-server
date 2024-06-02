const Trainer = require("../../models/trainermodel");
const ViewTrainer = async (req, res) => {
  try {
    const { start, size, filters, globalFilter, sorting } = req.query;
    const trainer = new Trainer(req.db);
    trainer.page = parseInt(start);
    trainer.limit = parseInt(size);
    trainer.filters = JSON.parse(filters);
    trainer.globalFilter = globalFilter;
    trainer.sortBy = JSON.parse(sorting);
    const data = await trainer.ViewTrainer();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const ViewSingleTrainer = async (req, res) => {
  try {
    const { trainerId } = req.params;
    const trainer = new Trainer(req.db);
    trainer.Id = trainerId;
    const data = await trainer.ViewSingleTrainer();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const AddTrainer = async (req, res) => {
  try {
    const { userId, type, trainerOptions } = req.body;
    const trainer = new Trainer(req.db);
    trainer.UserId = userId;
    trainer.Type = type;
    trainer.createdBy = req.user.id;
    const results = await trainer.AddTrainer(req.token, trainerOptions);
    res.status(200).json({ msg: results });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  AddTrainer,
  ViewTrainer,
  ViewSingleTrainer,
};
