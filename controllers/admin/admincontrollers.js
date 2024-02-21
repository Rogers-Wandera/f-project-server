const USER_ROLES = require("../../conn/rolesList");
const { format } = require("date-fns");
const FileUploader = require("../../conn/uploader");
const Modules = require("../../models/modulesmodel");
const ModuleLinks = require("../../models/modulelinksmodel");
const fileuploader = new FileUploader();

const GetUserRoles = async (req, res) => {
  try {
    const { userId } = req.params;
    const findUserExists = await req.db.findOne("users", {
      id: userId,
    });
    if (!findUserExists) {
      return res.status(400).json({ error: "User not found" });
    }
    const roles = await req.db.findByConditions("roles", {
      userId: userId,
      isActive: 1,
    });
    res.status(200).json(roles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const AddRoles = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const findUserExists = await req.db.findOne("users", {
      id: userId,
    });
    if (!findUserExists) {
      return res.status(400).json({ error: "User not found" });
    }
    const actualRole = USER_ROLES[role];
    if (!actualRole) {
      return res.status(400).json({ error: "Invalid role" });
    }
    const findRoleExists = await req.db.findByConditions("roles", {
      role: actualRole,
      userId: findUserExists.id,
    });
    if (findRoleExists.length > 0) {
      return res.status(400).json({ error: "Role already exists" });
    }
    const result = await req.db.insertOne("roles", {
      userId: userId,
      role: actualRole,
      rolename: role,
      isActive: 1,
    });
    if (!result?.success) {
      return res.status(500).json({ error: "Something went wrong" });
    }
    res.status(200).json({ msg: "Role added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const RemoveRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const findUserExists = await req.db.findOne("users", {
      id: userId,
    });
    if (!findUserExists) {
      return res.status(400).json({ error: "User not found" });
    }
    const actualRole = USER_ROLES[role];
    if (!actualRole) {
      return res.status(400).json({ error: "Invalid role" });
    }
    const findRoleExists = await req.db.findByConditions("roles", {
      role: actualRole,
      userId: findUserExists.id,
    });
    if (findRoleExists.length <= 0) {
      return res.status(400).json({ error: "Role not found" });
    }
    if (findRoleExists[0].rolename === "User") {
      return res.status(400).json({ error: "Cannot remove user role" });
    }
    const result = await req.db.deleteOne("roles", {
      id: findRoleExists[0].id,
    });
    if (!result) {
      return res.status(500).json({ error: "Something went wrong" });
    }
    res.status(200).json({ msg: "Role removed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const AssignTempRouteRoles = async (req, res) => {
  try {
    const { roleName, roleValue, expireTime, methods, description } = req.body;
    const { userId } = req.params;
    const findUserExists = await req.db.findOne("users", {
      id: userId,
    });
    if (!findUserExists) {
      return res.status(400).json({ error: "User not found" });
    }
    const findTempRoles = await req.db.findByConditions("temrouteroles", {
      userId: userId,
      roleValue: roleValue,
      isActive: 1,
    });
    if (findTempRoles.length > 0) {
      return res.status(400).json({ error: "Role already exists" });
    }
    const actualExpireTime = format(
      new Date(expireTime),
      "yyyy-MM-dd HH:mm:ss"
    );
    const results = await req.db.insertOne("temrouteroles", {
      userId: userId,
      roleName,
      roleValue,
      expireTime: actualExpireTime,
      creationDate: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      description,
      createdBy: req.user.id,
      isActive: 1,
    });
    if (!results?.success) {
      return res.status(500).json({ error: "Something went wrong" });
    }
    const insertId = results.insertId;
    const formateddata = methods.map((method) => {
      return {
        tempRouteId: insertId,
        method: method.method,
        creationDate: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        isActive: 1,
      };
    });
    const response = await req.db.insertMany("tempmethods", formateddata);
    if (!response?.success) {
      return res.status(500).json({ error: "Something went wrong" });
    }
    res.status(200).json({ msg: "Role added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const GetUserTempRoles = async (req, res) => {
  try {
    const { userId } = req.params;
    const findUserExists = await req.db.findOne("users", {
      id: userId,
    });
    if (!findUserExists) {
      return res.status(400).json({ error: "User not found" });
    }
    const sql = `SELECT trr.*,CONCAT(u.firstname, " ", u.lastname) as userName
    FROM temrouteroles trr INNER JOIN users u ON u.id = trr.userId
    WHERE trr.userId = ? AND trr.isActive = 1;`;
    const revokedroles = `SELECT trr.*,CONCAT(u.firstname, " ", u.lastname) as userName
    FROM temrouteroles trr INNER JOIN users u ON u.id = trr.userId
    WHERE trr.userId = ? AND trr.isActive = 0;`;
    const results = await req.db.executeQuery(sql, [userId]);
    const revoked = await req.db.executeQuery(revokedroles, [userId]);
    const usertemroles = {};
    usertemroles["active"] = results;
    usertemroles["revoked"] = revoked;
    res.status(200).json(usertemroles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const GetTempRolesMethods = async (req, res) => {
  try {
    const { temproleId } = req.query;
    const result = await req.db.findByConditions("tempmethods", {
      tempRouteId: temproleId,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const RemoveTempMethods = async (req, res, temproleId) => {
  try {
    const findTempMethods = await req.db.findByConditions("tempmethods", {
      tempRouteId: temproleId,
    });
    if (findTempMethods.length > 0) {
      const ids = findTempMethods.map((method) => method.id);
      const result = await req.db.deleteMany("tempmethods", ids);
      if (result) {
        return true;
      }
    }
    return false;
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const RemoveTempRole = async (req, res) => {
  try {
    const { temproleId } = req.query;
    const { userId } = req.params;
    const findUserExists = await req.db.findOne("users", {
      id: userId,
    });
    if (!findUserExists) {
      return res.status(400).json({ error: "User not found" });
    }
    const result = await req.db.deleteOne("temrouteroles", { id: temproleId });
    if (result) {
      RemoveTempMethods(req, res, temproleId);
    }
    res.status(200).json({ msg: "Role removed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const CreateTable = async (req, res) => {
  try {
    const { tablename, columns } = req.body;
    const result = await req.db.createTable(tablename, columns);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const UploadImages = async (req, res) => {
  try {
    const imagesToUpload = await fileuploader.handleFileUpload(req, res, 10);
    if (!imagesToUpload?.image) {
      return res
        .status(400)
        .json({ error: "No image uploaded please select an image" });
    }
    const images = imagesToUpload.image;
    res.status(200).json({ images });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const UploadAudio = async (req, res) => {
  try {
    const audioToUpload = await fileuploader.handleFileUpload(req, res);
    if (!audioToUpload?.audio) {
      return res
        .status(400)
        .json({ error: "No audio uploaded please select an image" });
    }
    const audios = audioToUpload.audio;
    res.status(200).json({ audios });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const AddModules = async (req, res) => {
  try {
    const modulesobj = new Modules(req.db);
    const { name, position } = req.body;
    modulesobj.Name = name;
    modulesobj.Position = position;
    modulesobj.IsActive = 1;
    modulesobj.CreationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const results = await modulesobj.AddModules();
    if (results.success) {
      return res.status(200).json({ msg: "Module added successfully" });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const RemoveModules = async (req, res) => {
  try {
    const moduleobj = new Modules(req.db);
    const { moduleId } = req.params;
    moduleobj.Id = moduleId;
    const response = await moduleobj.DeleteModules();
    if (response) {
      return res.status(200).json({ msg: "Module removed successfully" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const EditModules = async (req, res) => {
  try {
    const modulesobj = new Modules(req.db);
    const { name, position } = req.body;
    const { moduleId } = req.params;
    modulesobj.Name = name;
    modulesobj.Position = position;
    modulesobj.Id = moduleId;
    const results = await modulesobj.UpdateModules();
    if (results) {
      return res.status(200).json({ msg: "Module edited successfully" });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const GetModules = (req, res) => {
  try {
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const AddModuleLinks = async (req, res) => {
  try {
    const { linkname, route, position } = req.body;
    const { moduleId } = req.params;
    const modules = new Modules(req.db);
    const modulelinks = new ModuleLinks(req.db);
    modules.Id = moduleId;
    await modules.__find();
    modulelinks.ModuleId = moduleId;
    modulelinks.LinkName = linkname;
    modulelinks.Route = route;
    modulelinks.Position = position;
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const UpdateModuleLinks = async (req, res) => {
  try {
    const {} = req.body;
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const DeleteModuleLinks = async (req, res) => {
  try {
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  AddRoles,
  CreateTable,
  RemoveRole,
  GetUserRoles,
  AssignTempRouteRoles,
  GetUserTempRoles,
  GetTempRolesMethods,
  RemoveTempRole,
  UploadImages,
  UploadAudio,
  AddModules,
  RemoveModules,
  EditModules,
  GetModules,
  AddModuleLinks,
  UpdateModuleLinks,
  DeleteModuleLinks,
};