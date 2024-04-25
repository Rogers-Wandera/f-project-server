const Rolepermissions = require("../../models/rolepermissionsmodel");
const ViewRolepermissions = async (req, res) => {
  try {
    const { linkId } = req.params;
    const { userId } = req.query;
    const rolepermissions = new Rolepermissions(req.db);
    rolepermissions.userId = userId;
    console.log(linkId, userId);
    const data = await rolepermissions.ViewRolepermissions(linkId);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const ViewSingleRolepermissions = async (req, res) => {
  try {
    const { rolepermissionId } = req.params;
    const rolepermissions = new Rolepermissions(req.db);
    rolepermissions.Id = rolepermissionId;
    const data = await rolepermissions.ViewSingleRolepermissions();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const AddRolepermissions = async (req, res) => {
  try {
    const { roleId, permissionId, userId } = req.body;
    const rolepermissions = new Rolepermissions(req.db);
    rolepermissions.RoleId = roleId;
    rolepermissions.PermissionId = permissionId;
    rolepermissions.UserId = userId;
    rolepermissions.createdBy = req.user.id;
    const results = await rolepermissions.AddRolepermissions();
    if (results?.success == false) {
      return res.status(400).json({ msg: "something went wrong" });
    }
    res.status(200).json({ msg: "Rolepermissions added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const UpdateRolepermissions = async (req, res) => {
  try {
    const { roleId, permissionId, userId } = req.body;
    const { rolepermissionId } = req.params;
    const rolepermissions = new Rolepermissions(req.db);
    rolepermissions.Id = rolepermissionId;
    rolepermissions.RoleId = roleId;
    rolepermissions.PermissionId = permissionId;
    rolepermissions.UserId = userId;
    rolepermissions.updatedBy = req.user.id;
    const results = await rolepermissions.UpdateRolepermissions();
    if (results?.success == false) {
      return res.status(400).json({ msg: "something went wrong" });
    }
    res.status(200).json({ msg: "Rolepermissions updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const DeleteRolepermissions = async (req, res) => {
  try {
    const { rolepermissionId } = req.params;
    const rolepermissions = new Rolepermissions(req.db);
    rolepermissions.Id = rolepermissionId;
    rolepermissions.deletedBy = req.user.id;
    const results = await rolepermissions.DeleteRolepermissions();
    if (results?.success == false) {
      return res.status(400).json({ msg: "something went wrong" });
    }
    res.status(200).json({ msg: "Rolepermissions removed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  AddRolepermissions,
  UpdateRolepermissions,
  DeleteRolepermissions,
  ViewRolepermissions,
  ViewSingleRolepermissions,
};
