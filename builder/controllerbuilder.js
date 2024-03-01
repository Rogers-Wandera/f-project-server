const path = require("path");
const fs = require("fs");

const ControllerContent = (columns = [], tablename, folder = null) => {
  try {
    let classname = tablename.charAt(0).toUpperCase() + tablename.slice(1);
    let requestfileds = "";
    let classattr = "";
    columns.forEach((column) => {
      if (!column.type.includes("primary")) {
        let cap = column.name.charAt(0).toUpperCase() + column.name.slice(1);
        requestfileds += `${column.name},`;
        classattr += `${tablename}.${cap} = ${column.name}\n`;
      }
    });
    let queryname = "";
    // trim away s from the tablename if exists
    if (tablename.endsWith("s")) {
      queryname = tablename.slice(0, -1);
    } else {
      queryname = tablename;
    }
    const AddFunction = `const Add${classname} = async (req,res) => {
      try {
        const { ${requestfileds} } = req.body;
        const ${tablename} = new ${classname}(req.db);
        ${classattr}
        ${tablename}.createdBy = req.user.id;
        const results = await ${tablename}.Add${classname}();
        if(results?.success == false) {
          return res.status(400).json({msg: "something went wrong"});
        }
        res.status(200).json({msg: "${classname} added successfully"});
      } catch (error) {
        res.status(400).json({error: error.message})
      }
    }`;
    const EditFunction = `const Update${classname} = async (req,res) => {
      try {
        const { ${requestfileds} } = req.body;
        const { ${queryname}Id } = req.params;
        const ${tablename} = new ${classname}(req.db);
        ${tablename}.Id = ${queryname}Id;
        ${classattr}
        ${tablename}.updatedBy = req.user.id;
        const results = await ${tablename}.Update${classname}();
        if(results?.success == false) {
          return res.status(400).json({msg: "something went wrong"});
        }
        res.status(200).json({msg: "${classname} updated successfully"});
      } catch (error) {
        res.status(400).json({error: error.message})
      }
    }`;
    const deleteFunction = `const Delete${classname} = async (req,res) => {
      try {
        const { ${queryname}Id } = req.params;
        const ${tablename} = new ${classname}(req.db);
        ${tablename}.Id = ${queryname}Id;
        const results = await ${tablename}.Delete${classname}();
        if(results?.success == false) {
          return res.status(400).json({msg: "something went wrong"});
        }
        res.status(200).json({msg: "${classname} removed successfully"});
      } catch (error) {
        res.status(400).json({error: error.message})
      }
    }`;

    const viewdata = `const View${classname} = async (req,res) => {
      try {
        const ${tablename} = new ${classname}(req.db);
        const data = await ${tablename}.View${classname}();
        res.status(200).json({ data: data });
      } catch (error) {
        res.status(400).json({error: error.message})
      }
    }`;

    const viewone = `const ViewSingle${classname} = async (req,res) => {
      try {
        const { ${queryname}Id } = req.params;
        const ${tablename} = new ${classname}(req.db);
        ${tablename}.Id = ${queryname}Id;
        const data = await ${tablename}.ViewSingle${classname}();
        res.status(200).json({ data: data });
      } catch (error) {
        res.status(400).json({error: error.message})
      }
    }`;
    // count the steps to move upto to the folder
    const steps = folder == null ? 0 : folder.split("/").length;
    let viewpath = "";
    if (folder != null) {
      for (let i = 0; i < steps; i++) {
        viewpath += "../";
      }
    } else {
      viewpath = "../";
    }
    const modelpath = viewpath + "../models/" + tablename + "model";
    const content = `
    const ${classname} = require("${modelpath}");
    ${viewdata}
    ${viewone}
    ${AddFunction}
    ${EditFunction}
    ${deleteFunction}
    module.exports = {
      Add${classname},
      Update${classname},
      Delete${classname},
      View${classname},
      ViewSingle${classname},
    }
    `;
    return content;
  } catch (error) {
    throw new Error(error);
  }
};

const CreateClassController = async (
  columns = [],
  tablename,
  folder = null
) => {
  try {
    if (columns.length === 0) {
      return;
    }
    const filexists = `${tablename}controller.js`;
    let filepath = path.join(__dirname, "..", "controllers", filexists);
    let copypath = path.join(__dirname, "..", "copy", filexists);
    if (folder != null) {
      filepath = path.join(__dirname, "..", "controllers", folder, filexists);
    }
    //   create directory if it does not exist
    if (folder !== null) {
      if (!fs.existsSync(path.join(__dirname, "..", "controllers", folder))) {
        fs.mkdirSync(path.join(__dirname, "..", "controllers", folder));
      }
    } else {
      if (!fs.existsSync(path.join(__dirname, "..", "controllers"))) {
        fs.mkdirSync(path.join(__dirname, "..", "controllers"));
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
    fs.writeFileSync(filepath, ControllerContent(columns, tablename, folder));
    return true;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = CreateClassController;
