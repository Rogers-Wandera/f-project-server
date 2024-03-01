const path = require("path");
const fs = require("fs");
// this will create classes after the table has been created in the system

const CreateGettersAndSetters = (fields = []) => {
  try {
    let getters = "";
    let setters = "";
    fields.forEach((field) => {
      // attributes += `this.${field.name} = null;\n`;
      let capstr = field.name.charAt(0).toUpperCase() + field.name.slice(1);
      getters += `get ${capstr} () {\n return this.${field.name};\n}`;
      setters += `set ${capstr} (${field.name}) {\n this.${field.name} = ${field.name};\n}`;
    });
    getters += "get CreationDate() {\n return this.creationDate;\n}";
    setters +=
      "set CreationDate(creationDate) {\n this.creationDate = creationDate;\n}";
    getters += "get CreatedBy() {\n return this.createdBy;\n}";
    setters += "set CreatedBy(createdBy) {\n this.createdBy = createdBy;\n}";
    getters += "get UpdatedBy() {\n return this.updatedBy;\n}";
    setters += "set UpdatedBy(updatedBy) {\n this.updatedBy = updatedBy;\n}";
    getters += "get UpdatedDate() {\n return this.updatedDate;\n}";
    setters +=
      "set UpdatedDate(updatedDate) {\n this.updatedDate = updatedDate;\n}";
    getters += "get Deleted_at() {\n return this.deleted_at;\n}";
    setters +=
      "set Deleted_at(deleted_at) {\n this.deleted_at = deleted_at;\n}";
    getters += "get DeletedBy() {\n return this.deletedBy;\n}";
    setters += "set DeletedBy(deletedBy) {\n this.deletedBy = deletedBy;\n}";
    getters += "get IsActive() {\n return this.isActive;}";
    setters += "set IsActive(isActive) {\n this.isActive = isActive;}";
    return { getters, setters };
  } catch (error) {
    throw new Error(error.message);
  }
};

const relationsbuild = (fields = []) => {
  try {
    let relationship = "";
    let relationshipsclass = "";
    let relationshipimports = "";
    fields.forEach((field) => {
      const relations = field?.relationship;
      if (relations) {
        if (relations.length > 0) {
          relations.forEach((rel) => {
            const classpath = path.join(
              __dirname,
              `../models/${rel.tablename}model.js`
            );
            const classname =
              rel.tablename.charAt(0).toUpperCase() + rel.tablename.slice(1);
            let queryname = null;
            if (classname.endsWith("s")) {
              queryname = classname.slice(0, -1);
            } else {
              queryname = classname;
            }
            if (fs.existsSync(classpath)) {
              relationshipimports += `const ${rel.tablename} = require("./${rel.tablename}model");`;
              relationshipsclass += `const ${queryname} = new ${rel.tablename}(this.db);`;
              relationship += `${queryname}.Id = this.${field.name};
              await ${queryname}.__find();`;
            } else {
              relationshipsclass += `const ${queryname} = await this.db.findByConditions("${rel.tablename}", {${rel.relationkey}: this.${field.name},isActive:1});`;
              relationship += `if(${queryname}.length <= 0) {
                throw new Error("No ${queryname} found");
              };`;
            }
          });
        }
      }
    });
    return {
      relationship,
      relationshipsclass,
      relationshipimports,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const DeleteBoilers = (boilers = {}) => {
  try {
    let deleteAddons = "";
    let deleteimports = "";
    let relaclass = "";
    let relationsboilers = "";
    let relationchecks = "";
    // console.log(boilers.deletefunction.childtables);
    if (boilers?.deletefunction?.childtables) {
      if (boilers.deletefunction.childtables.length > 0) {
        boilers.deletefunction.childtables.forEach((bl) => {
          const table = bl.table;
          const classpath = path.join(__dirname, `../models/${table}model.js`);
          const classname = table.charAt(0).toUpperCase() + table.slice(1);
          if (fs.existsSync(classpath)) {
            deleteimports += `const ${table} = require("./${table}model");`;
            relaclass += `const ${classname} = new ${table}(this.db);`;
            relationchecks += `const ${classname.toLowerCase()}exists = await ${classname}.__findcriteria({${
              bl.column
            }: this.id});`;
            relationsboilers += `
            if(${classname.toLowerCase()}exists.length > 0) {
              ${classname}.Id = ${classname.toLowerCase()}exists[0].id;
            ${
              boilers?.deletefunction?.type == "hard"
                ? `await ${classname}.__harddelete();`
                : `await ${classname}.__delete();`
            }}`;
          } else {
            relaclass += `const ${classname} = new Model(this.db);
            ${classname}.table = "${table}";`;
            relationchecks += `const ${classname.toLowerCase()}exists = await ${classname}.__findcriteria({
              ${bl.column}: this.id
            });`;
            relationsboilers += `
            if(${classname.toLowerCase()}exists.length > 0) {
              ${classname}.id = ${classname.toLowerCase()}exists[0].id;
              ${
                boilers?.deletefunction?.type == "hard"
                  ? `await ${classname}.__harddelete();`
                  : `await ${classname}.__delete();`
              }}`;
          }
        });
      }
    }
    deleteAddons = `${relaclass}\n${relationchecks}\n${relationsboilers}`;
    return { deleteimports, deleteAddons };
  } catch (error) {
    throw new Error(error.message);
  }
};

const createFunctions = (fields = [], name = null, boilers = {}) => {
  try {
    let addfunction = "";
    let updatefunction = "";
    let deletefunction = "";
    let viewdata = "";
    let viewone = "";
    const { deleteAddons, deleteimports } = DeleteBoilers(boilers);
    let capitalizedStr = name.charAt(0).toUpperCase() + name.slice(1);
    const { relationship, relationshipsclass } = relationsbuild(fields);
    addfunction = `async Add${capitalizedStr}() {\n
       try {
         ${relationshipsclass}
         ${relationship}
          this.creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
          this.isActive = 1;
          const results = await this.__add();
          return results;
       } catch (error) {
         throw new Error(error);
       }
    }`;
    updatefunction = `async Update${capitalizedStr}() {
        try {
          ${relationshipsclass}
          ${relationship}
           this.updatedDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
           const results = await this.__update();
           return results;
        } catch (error) {
          throw new Error(error);
        }
       }`;
    deletefunction = `async Delete${capitalizedStr}() {
      try {
          this.deleted_at = format(new Date(), "yyyy-MM-dd HH:mm:ss");
          const results = await this.__delete();
          ${deleteAddons}
          return results;
      } catch (error) {
          throw new Error(error);
      }
    }`;

    if (boilers?.deletefunction) {
      if (boilers.deletefunction?.type == "hard") {
        deletefunction = `async Delete${capitalizedStr}() {
          try {
              this.deleted_at = format(new Date(), "yyyy-MM-dd HH:mm:ss");
              const results = await this.__harddelete();
               ${deleteAddons}
              return results;
          } catch (error) {
              throw new Error(error);
          }
        }`;
      }
    }
    viewdata = `async View${capitalizedStr}() {
      try {
          const results = await this.__viewdata();
          return results;
      } catch (error) {
          throw new Error(error);
      }
    }`;

    viewone = `async ViewSingle${capitalizedStr}() {
      try {
          const results = await this.__viewOne();
          return results;
      } catch (error) {
          throw new Error(error);
      }
    }`;
    return {
      addfunction,
      updatefunction,
      deletefunction,
      viewdata,
      viewone,
      deleteimports,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
const ClassContent = (fields = [], name = "", boilers = {}) => {
  try {
    if (fields.length <= 0) {
      return;
    }
    // create the class attributes
    let attributes = "";
    fields.forEach((field) => {
      attributes += `this.${field.name} = null;\n`;
    });
    const { getters, setters } = CreateGettersAndSetters(fields);
    const { relationshipimports } = relationsbuild(fields);
    const {
      addfunction,
      updatefunction,
      deletefunction,
      viewdata,
      viewone,
      deleteimports,
    } = createFunctions(fields, name, boilers);
    // capitalize the first letter of the name
    let capitalizedStr = name.charAt(0).toUpperCase() + name.slice(1);

    const content = `const Model = require("./modal");\n
    ${relationshipimports}
    ${deleteimports}
    const format = require("date-fns/format");
    class ${capitalizedStr} extends Model {
        constructor(dbinstance = null) {\n
          super()\n;
          this.db = dbinstance\n;
          this.table = "${name}"\n;
          ${attributes}
          this.creationDate = null\n;
          this.createdBy = null\n;
          this.updatedBy = null\n;
          this.updatedDate = null\n;
          this.deleted_at = null\n;
          this.deletedBy = null\n;
          this.isActive = null\n;
        }\n
        //   getters
        ${getters}
        //   setters
        ${setters}
        //   view data
        ${viewdata}
        // view one
        ${viewone}
        //   add function
        ${addfunction}
        //   update function
        ${updatefunction}
        //   delete function
        ${deletefunction}
    }\n module.exports = ${capitalizedStr}`;
    return content;
  } catch (error) {
    throw new Error(error.message);
  }
};

const CreateModelClass = async (fields = [], name = "", boilers = {}) => {
  try {
    const filexists = `${name}model.js`;
    const filepath = path.join(__dirname, "..", "models", filexists);
    const copypath = path.join(__dirname, "..", "copy", filexists);
    //   create directory if it does not exist
    if (!fs.existsSync(path.join(__dirname, "..", "models"))) {
      fs.mkdirSync(path.join(__dirname, "..", "models"));
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
    fs.writeFileSync(filepath, ClassContent(fields, name, boilers));
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = CreateModelClass;
