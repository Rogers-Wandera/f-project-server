const Systemroles = require("../../models/systemrolesmodel");
const ViewSystemroles = async (req, res) => {
  try {
    const { start, size, filters, globalFilter, sorting } = req.query;
    const systemroles = new Systemroles(req.db);
    systemroles.page = parseInt(start);
    systemroles.limit = parseInt(size);
    systemroles.filters = JSON.parse(filters);
    systemroles.globalFilter = globalFilter;
    systemroles.sortBy = JSON.parse(sorting);
    const data = await systemroles.ViewSystemroles();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const ViewSingleSystemroles = async (req, res) => {
  try {
    const { systemroleId } = req.params;
    const systemroles = new Systemroles(req.db);
    systemroles.Id = systemroleId;
    const data = await systemroles.ViewSingleSystemroles();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const AddSystemroles = async (req, res) => {
  try {
    const { rolename, value, released, description } = req.body;
    const systemroles = new Systemroles(req.db);
    systemroles.Rolename = rolename;
    systemroles.Value = value;
    systemroles.Released = released;
    systemroles.Description = description;

    systemroles.createdBy = req.user.id;
    const results = await systemroles.AddSystemroles();
    if (results?.success == false) {
      return res.status(400).json({ msg: "something went wrong" });
    }
    res.status(200).json({ msg: "Systemroles added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const UpdateSystemroles = async (req, res) => {
  try {
    const { rolename, value, released, description } = req.body;
    const { systemroleId } = req.params;
    const systemroles = new Systemroles(req.db);
    systemroles.Id = systemroleId;
    systemroles.Rolename = rolename;
    systemroles.Value = value;
    systemroles.Released = released;
    systemroles.Description = description;

    systemroles.updatedBy = req.user.id;
    const results = await systemroles.UpdateSystemroles();
    if (results?.success == false) {
      return res.status(400).json({ msg: "something went wrong" });
    }
    res.status(200).json({ msg: "Systemroles updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const DeleteSystemroles = async (req, res) => {
  try {
    const { systemroleId } = req.params;
    const systemroles = new Systemroles(req.db);
    systemroles.Id = systemroleId;
    systemroles.deletedBy = req.user.id;
    const results = await systemroles.DeleteSystemroles();
    if (results?.success == false) {
      return res.status(400).json({ msg: "something went wrong" });
    }
    res.status(200).json({ msg: "Systemroles removed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const NotAsignedRoles = async (req, res) => {
  try {
    const { userId } = req.params;
    const systemroles = new Systemroles(req.db);
    const response = await systemroles.ViewNotAssigned(userId);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  AddSystemroles,
  UpdateSystemroles,
  DeleteSystemroles,
  ViewSystemroles,
  ViewSingleSystemroles,
  NotAsignedRoles,
};
