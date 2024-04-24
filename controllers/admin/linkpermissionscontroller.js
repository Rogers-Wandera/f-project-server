const Linkpermissions = require("../../models/linkpermissionsmodel");
const ViewLinkpermissions = async (req, res) => {
  try {
    const { start, size, filters, globalFilter, sorting } = req.query;
    const linkpermissions = new Linkpermissions(req.db);
    const { linkId } = req.params;
    linkpermissions.linkId = linkId;
    linkpermissions.page = parseInt(start);
    linkpermissions.limit = parseInt(size);
    linkpermissions.filters = JSON.parse(filters);
    linkpermissions.globalFilter = globalFilter;
    linkpermissions.sortBy = JSON.parse(sorting);
    const data = await linkpermissions.ViewLinkpermissions();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const ViewSingleLinkpermissions = async (req, res) => {
  try {
    const { linkpermissionId } = req.params;
    const linkpermissions = new Linkpermissions(req.db);
    linkpermissions.Id = linkpermissionId;
    const data = await linkpermissions.ViewSingleLinkpermissions();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const AddLinkpermissions = async (req, res) => {
  try {
    const { accessName, acessRoute, method, description } = req.body;
    const linkpermissions = new Linkpermissions(req.db);
    const { linkId } = req.params;
    linkpermissions.LinkId = linkId;
    linkpermissions.AccessName = accessName;
    linkpermissions.AcessRoute = acessRoute;
    linkpermissions.Method = method;
    linkpermissions.Description = description;
    linkpermissions.createdBy = req.user.id;
    const results = await linkpermissions.AddLinkpermissions();
    if (results?.success == false) {
      return res.status(400).json({ msg: "something went wrong" });
    }
    res.status(200).json({ msg: "Linkpermissions added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const UpdateLinkpermissions = async (req, res) => {
  try {
    const { accessName, acessRoute, method, description } = req.body;
    const { linkpermissionId } = req.params;

    const linkpermissions = new Linkpermissions(req.db);
    linkpermissions.Id = linkpermissionId;
    linkpermissions.AccessName = accessName;
    linkpermissions.AcessRoute = acessRoute;
    linkpermissions.Method = method;
    linkpermissions.Description = description;
    linkpermissions.updatedBy = req.user.id;
    const results = await linkpermissions.UpdateLinkpermissions();
    if (results?.success == false) {
      return res.status(400).json({ msg: "something went wrong" });
    }
    res.status(200).json({ msg: "Linkpermissions updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const DeleteLinkpermissions = async (req, res) => {
  try {
    const { linkpermissionId } = req.params;
    const linkpermissions = new Linkpermissions(req.db);
    linkpermissions.Id = linkpermissionId;
    linkpermissions.deletedBy = req.user.id;
    const results = await linkpermissions.DeleteLinkpermissions();
    if (results?.success == false) {
      return res.status(400).json({ msg: "something went wrong" });
    }
    res.status(200).json({ msg: "Linkpermissions removed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const ViewCustomPermissions = async (req, res) => {
  try {
    const { linkId } = req.params;
    const linkpermissions = new Linkpermissions(req.db);
    linkpermissions.linkId = linkId;
    const data = linkpermissions.ViewSelectPermissions();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  AddLinkpermissions,
  UpdateLinkpermissions,
  DeleteLinkpermissions,
  ViewLinkpermissions,
  ViewSingleLinkpermissions,
  ViewCustomPermissions,
};
