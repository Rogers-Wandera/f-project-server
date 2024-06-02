const { format } = require("date-fns");
const FileUploader = require("../../conn/uploader");
const Modules = require("../../models/modulesmodel");
const ModuleLinks = require("../../models/modulelinksmodel");
const CreateModelClass = require("../../builder/classbuilder");
const CreateSchema = require("../../builder/schemabuilder");
const CreateClassController = require("../../builder/controllerbuilder");
const CreateRoutes = require("../../builder/routesbuilder");
const Systemroles = require("../../models/systemrolesmodel");
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
    const roles = await req.db.findByConditions("user_roles", {
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
    const systemroles = new Systemroles(req.db);
    const { userId, roleId } = req.body;
    const findUserExists = await req.db.findOne("users", {
      id: userId,
    });
    if (!findUserExists) {
      return res.status(400).json({ error: "User not found" });
    }
    systemroles.Id = roleId;
    const actualRole = await systemroles.ViewSingleSystemroles();
    // const actualRole = USER_ROLES[role];
    const findRoleExists = await req.db.findByConditions("roles", {
      roleId: actualRole.id,
      userId: findUserExists.id,
      isActive: 1,
    });
    if (findRoleExists.length > 0) {
      return res.status(400).json({ error: "Role already exists" });
    }
    const result = await req.db.insertOne("roles", {
      userId: userId,
      roleId: roleId,
      isActive: 1,
      createdBy: req.user.id,
    });
    if (!result?.success) {
      return res.status(500).json({ error: "Something went wrong" });
    }
    res.status(200).json({ msg: "Role added successfully" });
    req.io.emit("loguserout", { userId: userId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const RemoveRole = async (req, res) => {
  try {
    const systemroles = new Systemroles(req.db);
    const { userId, roleId } = req.body;
    const findUserExists = await req.db.findOne("users", {
      id: userId,
    });
    systemroles.Id = roleId;
    if (!findUserExists) {
      return res.status(400).json({ error: "User not found" });
    }
    const actualRole = await systemroles.ViewSingleSystemroles();
    const findRoleExists = await req.db.findByConditions("user_roles", {
      roleId: actualRole.id,
      userId: findUserExists.id,
    });
    if (findRoleExists.length <= 0) {
      return res.status(400).json({ error: "Role not found" });
    }
    if (findRoleExists[0].rolename === "User") {
      return res.status(400).json({ error: "Cannot remove user role" });
    }
    const result = await req.db.softDelete("roles", {
      id: findRoleExists[0].id,
    });
    if (!result) {
      return res.status(500).json({ error: "Something went wrong" });
    }
    req.io.emit("loguserout", { userId: userId });
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
    const {
      tablename,
      columns,
      controllerfolder,
      routesfolder,
      schemafolder,
      routemainname,
      boilerfunctions,
      modulecreation,
    } = req.body;
    const modulesobj = new Modules(req.db);
    const modulelinks = new ModuleLinks(req.db);
    if (modulecreation) {
      modulesobj.Id = modulecreation.moduleId;
      modulelinks.linkname = modulecreation.linkname;
      await modulesobj.__find();
      const linkexists = await modulelinks.findLinkByName();
      if (linkexists) {
        throw new Error("The linkname already exists");
      }
    }
    const result = await req.db.createTable(tablename, columns);
    let createclass = false;
    let schema = false;
    let controller = false;
    let routes = false;
    let modules = false;
    if (result) {
      createclass = await CreateModelClass(columns, tablename, boilerfunctions);
      schema = await CreateSchema(columns, tablename, schemafolder);
      controller = await CreateClassController(
        columns,
        tablename,
        controllerfolder
      );
      routes = await CreateRoutes(
        tablename,
        routesfolder,
        controllerfolder,
        schemafolder,
        routemainname
      );
    }
    if (modulecreation) {
      modulesobj.Id = modulecreation.moduleId;
      modulelinks.ModuleId = modulecreation.moduleId;
      modulelinks.LinkName = modulecreation.linkname;
      modulelinks.Route = modulecreation.route;
      const position = await modulelinks.CalculateNextPosition(
        modulecreation.moduleId
      );
      modulelinks.Position = position;
      const res = await modulelinks.AddLink();
      if (res.success) {
        if (modulecreation.assignroles.length > 0) {
          const senddata = [];
          modulecreation.assignroles.forEach((role) => {
            senddata.push({
              linkId: res.insertId,
              userId: role.userId,
              expireDate: role.expireDate,
              isActive: 1,
              createdBy: req.user.id,
              creationDate: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
            });
          });
          await req.db.insertMany("linkroles", senddata);
          modules = true;
        }
      }
    }
    res.status(200).json({
      result: result,
      createclass: createclass,
      schema: schema,
      controller: controller,
      routes: routes,
      modules: modules,
    });
  } catch (error) {
    await req.db.executeQuery(`DROP TABLE IF EXISTS ${req.body.tablename}`);
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
    const { name } = req.body;
    modulesobj.Name = name;
    modulesobj.IsActive = 1;
    modulesobj.CreationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const position = await modulesobj.CalculateNextPosition();
    modulesobj.Position = position;
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

const GetModules = async (req, res) => {
  try {
    const { start, size, filters, globalFilter, sorting } = req.query;
    const modules = new Modules(req.db);
    modules.page = parseInt(start);
    modules.limit = parseInt(size);
    modules.filters = JSON.parse(filters);
    modules.globalFilter = globalFilter;
    modules.sortBy = JSON.parse(sorting);
    const data = await modules.__viewdata();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const AddModuleLinks = async (req, res) => {
  try {
    const { linkname, route, render, released } = req.body;
    const { moduleId } = req.params;
    const modules = new Modules(req.db);
    const modulelinks = new ModuleLinks(req.db);
    modules.Id = moduleId;
    await modules.__find();
    modulelinks.ModuleId = moduleId;
    modulelinks.LinkName = linkname;
    modulelinks.Render = render;
    modulelinks.Route = route;
    modulelinks.Released = released;
    const position = await modulelinks.CalculateNextPosition(moduleId);
    modulelinks.Position = position;
    const response = await modulelinks.AddLink();
    if (response?.success === false) {
      return res.status(400).json({ msg: "something went wrong" });
    }
    res.status(200).json({ msg: "Link added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const UpdateModuleLinks = async (req, res) => {
  try {
    const { linkname, route, position, render, released } = req.body;
    const { moduleId, linkId } = req.params;
    const modules = new Modules(req.db);
    const modulelinks = new ModuleLinks(req.db);
    modules.Id = moduleId;
    modulelinks.Id = linkId;
    await modules.__find();
    await modulelinks.__find();
    modulelinks.ModuleId = moduleId;
    modulelinks.LinkName = linkname;
    modulelinks.Route = route;
    modulelinks.Render = render;
    modulelinks.released = released;
    modulelinks.Position = position;
    const response = await modulelinks.UpdateLink();
    if (response?.success === false) {
      return res.status(400).json({ msg: "something went wrong" });
    }
    res.status(200).json({ msg: "Link updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const DeleteModuleLinks = async (req, res) => {
  try {
    const { linkId } = req.params;
    const modulelinks = new ModuleLinks(req.db);
    modulelinks.Id = linkId;
    await modulelinks.__find();
    const response = await modulelinks.DeleteLink();
    if (response?.success === false) {
      return res.status(400).json({ msg: "something went wrong" });
    }
    res.status(200).json({ msg: "Link deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const GetModuleLinks = async (req, res) => {
  try {
    const { start, size, filters, globalFilter, sorting } = req.query;
    const { moduleId } = req.params;
    const modulelinks = new ModuleLinks(req.db);
    modulelinks.page = parseInt(start);
    modulelinks.moduleId = moduleId;
    modulelinks.limit = parseInt(size);
    modulelinks.filters = JSON.parse(filters);
    modulelinks.globalFilter = globalFilter;
    modulelinks.sortBy = JSON.parse(sorting);
    const data = await modulelinks.ViewModuleLinks();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const GetLastModuleLinkPosition = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const modulelinks = new ModuleLinks(req.db);
    const data = await modulelinks.CalculateNextPosition(moduleId);
    res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSelectModules = async (req, res) => {
  try {
    const moduleobj = new Modules(req.db);
    const data = await moduleobj.getSelectModules();
    res.status(200).json(data);
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
  GetModuleLinks,
  GetLastModuleLinkPosition,
  getSelectModules,
};
