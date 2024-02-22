const path = require("path");
const fs = require("fs");
// this will create classes after the table has been created in the system

const ClassContent = (fields = [], name = "") => {
  try {
    if (fields.length <= 0) {
      return;
    }
    // create the class attributes
    let attributes = "";
    let getters = "";
    let setters = "";
    let addfunction = "";
    let updatefunction = "";
    let deletefunction = "";
    fields.forEach((field) => {
      attributes += `this.${field.name} = null;\n`;
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
    // capitalize the first letter of the name
    let capitalizedStr = name.charAt(0).toUpperCase() + name.slice(1);
    addfunction = `async Add${capitalizedStr}() {\n
        this.creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
        this.isActive = 1;
        const results = await this.__add();
        return results;
    }`;
    updatefunction = `async Update${capitalizedStr}() {
        this.updatedDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
        const results = await this.__update();
        return results;}`;
    deletefunction = `async Delete${capitalizedStr}() {
        this.deleted_at = format(new Date(), "yyyy-MM-dd HH:mm:ss");
        const results = await this.__delete();
        return results;}`;
    const content = `const Model = require("./modal");\n
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
        //   add function
        ${addfunction}
        //   update function
        ${updatefunction}
        //   delete function
        ${deletefunction}
    }\n module.exports = ${capitalizedStr}`;
    return content;
  } catch (error) {
    throw new Error("method-> ClassContent: " + error.message);
  }
};

const CreateModelClass = async (fields = [], name = "") => {
  try {
    const filexists = `${name}model.js`;
    const filepath = path.join(__dirname, "..", "models", filexists);
    const copypath = path.join(__dirname, "..", "Copy", filexists);
    //   create directory if it does not exist
    if (!fs.existsSync(path.join(__dirname, "..", "models"))) {
      fs.mkdirSync(path.join(__dirname, "..", "models"));
    }
    // check if fileexists and replace it else create it
    if (fs.existsSync(filepath)) {
      // create a copy of the file and replace it
      if (!fs.existsSync(path.join(__dirname, "..", "Copy"))) {
        fs.mkdirSync(path.join(__dirname, "..", "Copy"));
      }
      fs.copyFileSync(filepath, copypath);
      fs.unlinkSync(filepath);
    }
    fs.writeFileSync(filepath, ClassContent(fields, name));
    return true;
  } catch (error) {
    throw new Error("method-> CreateModelClass: " + error.message);
  }
};

module.exports = CreateModelClass;
