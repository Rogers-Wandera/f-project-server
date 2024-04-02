const Positions = require("../../models/positionsmodel");
const ViewPositions = async (req, res) => {
  try {
    const { start, size, filters, globalFilter, sorting } = req.query;
    const positions = new Positions(req.db);
    positions.page = parseInt(start);
    positions.limit = parseInt(size);
    positions.filters = JSON.parse(filters);
    positions.globalFilter = globalFilter;
    positions.sortBy = JSON.parse(sorting);
    const data = await positions.ViewPositions();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const ViewSinglePositions = async (req, res) => {
  try {
    const { positionId } = req.params;
    const positions = new Positions(req.db);
    positions.Id = positionId;
    const data = await positions.ViewSinglePositions();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const AddPositions = async (req, res) => {
  try {
    const { position } = req.body;
    const positions = new Positions(req.db);
    positions.Position = position;
    positions.createdBy = req.user.id;
    const results = await positions.AddPositions();
    if (results?.success == false) {
      return res.status(400).json({ msg: "something went wrong" });
    }
    res.status(200).json({ msg: "Positions added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const UpdatePositions = async (req, res) => {
  try {
    const { position } = req.body;
    const { positionId } = req.params;
    const positions = new Positions(req.db);
    positions.Id = positionId;
    positions.Position = position;

    positions.updatedBy = req.user.id;
    const results = await positions.UpdatePositions();
    if (results?.success == false) {
      return res.status(400).json({ msg: "something went wrong" });
    }
    res.status(200).json({ msg: "Positions updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const DeletePositions = async (req, res) => {
  try {
    const { positionId } = req.params;
    const positions = new Positions(req.db);
    positions.Id = positionId;
    positions.deletedBy = req.user.id;
    const results = await positions.DeletePositions();
    if (results?.success == false) {
      return res.status(400).json({ msg: "something went wrong" });
    }
    res.status(200).json({ msg: "Positions removed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSelectFormatted = async (req, res) => {
  try {
    const positions = new Positions(req.db);
    positions.limit = 100;
    const data = await positions.ViewPositions();
    const formated = data.docs.map((item) => {
      return { label: item.position, value: item.id.toString() };
    });
    res.status(200).json(formated);
  } catch (error) {
    res.status(400).json(error);
  }
};
module.exports = {
  AddPositions,
  UpdatePositions,
  DeletePositions,
  ViewPositions,
  ViewSinglePositions,
  getSelectFormatted,
};
