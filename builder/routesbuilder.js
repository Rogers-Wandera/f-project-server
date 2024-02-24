const path = require("path");
const fs = require("fs");

const RoutesContent = (
  tablename,
  folder = null,
  controllerfolder = null,
  schemafolder = null
) => {
  try {
    let classname = tablename.charAt(0).toUpperCase() + tablename.slice(1);
    let queryname = "";
    // trim away s from the tablename if exists
    if (tablename.endsWith("s")) {
      queryname = tablename.slice(0, -1);
    } else {
      queryname = tablename;
    }
    let conpath = "../";
    let schemapath = "../";
    let jwtpath = "../";
    let emailpath = "../";
    let rolespath = "../";
    let verifyrolespath = "../";
    let schemaverifypath = "../";
    const steps = folder == null ? 0 : folder.split("/").length;
    if (folder !== null) {
      for (let i = 0; i < steps; i++) {
        conpath += "../";
        schemapath += "../";
        jwtpath += "../";
        emailpath += "../";
        rolespath += "../";
        verifyrolespath += "../";
        schemaverifypath += "../";
      }
    }
    let controller = conpath + "controllers/" + tablename + "controller.js";
    if (controllerfolder !== null) {
      controller =
        conpath +
        `controllers/${controllerfolder}/` +
        tablename +
        "controller.js";
    }
    let schema = schemapath + "schema/" + tablename + "schema.js";
    if (schemafolder !== null) {
      schema = schemapath + `schema/${schemafolder}/` + tablename + "schema.js";
    }
    const jwt = schemapath + "middlewares/verifyJwt";
    const email = emailpath + "middlewares/verifyEmail";
    const roles = verifyrolespath + "middlewares/verifyRoles";
    const userroles = rolespath + "conn/rolesList";
    const verifyschema = schemaverifypath + "middlewares/validationAuth";
    const routes = `router.route('/').get(VerifyJwt,VerifyEmail,VerifyRoles(USER_ROLES.Admin),View${classname})
    .post(VerifyJwt,VerifyEmail,VerifyRoles(USER_ROLES.Admin),validateSchema(${tablename}Schema),Add${classname})
    router.route("/:${queryname}Id").get(VerifyJwt,VerifyEmail,VerifyRoles(USER_ROLES.Admin),ViewSingle${classname})
    .patch(VerifyJwt,VerifyEmail,VerifyRoles(USER_ROLES.Admin),validateSchema(${tablename}Schema),Update${classname})
    .delete(VerifyJwt,VerifyEmail,VerifyRoles(USER_ROLES.Admin),Delete${classname})`;
    const content = `
        const express = require("express");
        const {Add${classname}, Update${classname}, Delete${classname}, View${classname}, ViewSingle${classname}} = require("${controller}")
        const {${tablename}Schema, ${tablename}QueryParams} = require("${schema}")
        const {
            validateSchema,
            validateQueryParamsSchema,
        } = require("${verifyschema}");
        const VerifyJwt = require("${jwt}");
        const VerifyEmail = require("${email}");
        const VerifyRoles = require("${roles}");
        const USER_ROLES = require("${userroles}");
        const router = express.Router();
        ${routes}
        module.exports = router;
    `;
    return content;
  } catch (error) {
    throw new Error(error);
  }
};

const appendRoute = (routemainname, tablename, folder = null) => {
  try {
    let filexists = `${tablename}route.js`;
    let routerpath = `./routes/${filexists}`;
    if (folder !== null) {
      routerpath = `./routes/${folder}/${filexists}`;
    }
    let classname = tablename.charAt(0).toUpperCase() + tablename.slice(1);
    let newroute = "app.use(`${base_url}/";
    newroute += routemainname + "`, " + classname + "Router);";

    let data = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
    let lines = data.split("\n");
    const index = lines.findIndex((line) => line.includes("//end of routes"));
    if (index !== -1) {
      lines.splice(index, 0, newroute);
      const text = lines.join("\n");
      fs.writeFileSync(path.join(__dirname, "..", "app.js"), text);
    }
  } catch (error) {
    console.error(`Error appending route: ${error}`);
  }
};

const appendImport = (tablename, folder = null) => {
  try {
    let filexists = `${tablename}route.js`;
    let routerpath = `./routes/${filexists}`;
    if (folder !== null) {
      routerpath = `./routes/${folder}/${filexists}`;
    }
    let classname = tablename.charAt(0).toUpperCase() + tablename.slice(1);

    let data = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
    let lines = data.split("\n");
    const routesindex = lines.findIndex((line) =>
      line.includes("// end of routes imports")
    );
    if (routesindex !== -1) {
      lines.splice(
        routesindex,
        0,
        `const ${classname}Router = require("${routerpath}")`
      );
      const text = lines.join("\n");
      fs.writeFileSync(path.join(__dirname, "..", "app.js"), text);
    }
  } catch (error) {
    console.error(`Error appending import: ${error}`);
  }
};

const CreateRoutes = async (
  tablename,
  folder = null,
  controllerfolder = null,
  schemafolder = null,
  routemainname = null
) => {
  try {
    let filexists = `${tablename}route.js`;
    let filepath = path.join(__dirname, "..", "routes", filexists);
    const copypath = path.join(__dirname, "..", "copy", filexists);
    //   create directory if it does not exist
    if (folder !== null) {
      filepath = path.join(__dirname, "..", "routes", folder, filexists);
      if (!fs.existsSync(path.join(__dirname, "..", "routes", folder))) {
        fs.mkdirSync(path.join(__dirname, "..", "routes", folder));
      }
    } else {
      if (!fs.existsSync(path.join(__dirname, "..", "routes"))) {
        fs.mkdirSync(path.join(__dirname, "..", "routes"));
      }
    }
    // check if fileexists and replace it else create it
    if (fs.existsSync(filepath)) {
      // create a copy of the file and replace it
      if (!fs.existsSync(path.join(__dirname, "..", "copy"))) {
        fs.mkdirSync(path.join(__dirname, "..", "copy"));
      }
      fs.copyFileSync(filepath, copypath);
      fs.unlinkSync(filepath);
    }
    fs.writeFileSync(
      filepath,
      RoutesContent(tablename, folder, controllerfolder, schemafolder)
    );
    appendImport(tablename, folder);
    appendRoute(routemainname, tablename, folder);
    return true;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = CreateRoutes;
