const path = require("path");
const fs = require("fs");
const SchemaContent = (columns = [], tablename) => {
  try {
    const schemaobjects = {};
    columns.forEach((column) => {
      if (!column.type.includes("primary")) {
        let type = "";
        let maxlength = null;
        let format = null;
        let required = null;
        if (
          column.type.startsWith("varchar") ||
          column.type.startsWith("text") ||
          column.type.startsWith("blob")
        ) {
          type = "string";
          if (column.type.startsWith("varchar")) {
            const matches = column.type.match(/\((.*?)\)/);
            if (matches && matches.length > 1) {
              maxlength = parseInt(matches[1]); // Parse length as integer
            }
          }
          required = column.type.includes("not null") ? true : false;
        } else if (
          column.type.startsWith("int") ||
          column.type.startsWith("tinyint") ||
          column.type.startsWith("bigint") ||
          column.type.startsWith("smallint")
        ) {
          type = "number";
          required = column.type.includes("not null") ? true : false;
        } else if (
          column.type.startsWith("decimal") ||
          column.type.startsWith("float") ||
          column.type.startsWith("double")
        ) {
          type = "number";
          required = column.type.includes("not null") ? true : false;
        } else if (
          column.type.startsWith("datetime") ||
          column.type.startsWith("timestamp")
        ) {
          type = "date";
          format = "YYYY-MM-DD HH:mm:ss";
          required = column.type.includes("not null") ? true : false;
        } else if (column.type.startsWith("date")) {
          type = "date";
          format = "YYYY-MM-DD HH:mm:ss";
          required = column.type.includes("not null") ? true : false;
        } else if (column.type.startsWith("time")) {
          type = "date";
          format = "YYYY-MM-DD HH:mm:ss";
          required = column.type.includes("not null") ? true : false;
        } else {
          // Unsupported type, handle as string
          type = "string";
          required = column.type.includes("not null") ? true : false;
        }
        schemaobjects[column.name] = `joi.${type}()${
          maxlength ? `.min(3).max(${maxlength})` : ""
        }${required ? ".required()" : ""}${
          format ? `.format('${format}')` : ""
        }.messages({${
          required ? `'any.required': '${column.name} is required',` : ""
        }${
          format
            ? `'string.format': '${column.name} must be in format ${format}',`
            : ""
        }${
          type === "string"
            ? `'string.empty': '${column.name} cannot be empty',`
            : ""
        }})`;
      }
    });
    let queryname = "";
    // trim away s from the tablename if exists
    if (tablename.endsWith("s")) {
      queryname = tablename.slice(0, -1);
    }
    const schemaobjectsEntries = Object.entries(schemaobjects);
    const schemaobjectsString = schemaobjectsEntries
      .map(([key, value]) => `${key}: ${value}`)
      .join(",\n");

    const content = `const joi = require("joi");\n
    const ${tablename}Schema = joi.object({
        ${schemaobjectsString}
    })
    const ${tablename}QueryParams = joi.object({
        ${queryname}Id: joi.string().required().messages({
            'any.required': '${queryname}Id is required',
            'any.string': '${queryname}Id must be a string'
        })
    })\nmodule.exports = {${tablename}Schema, ${tablename}QueryParams};`;
    return content;
  } catch (error) {
    throw new Error(error);
  }
};

const CreateSchema = async (columns = [], tablename) => {
  try {
    if (columns.length === 0) {
      return;
    }
    const filexists = `${tablename}schema.js`;
    const filepath = path.join(__dirname, "..", "schema", filexists);
    const copypath = path.join(__dirname, "..", "Copy", filexists);
    //   create directory if it does not exist
    if (!fs.existsSync(path.join(__dirname, "..", "schema"))) {
      fs.mkdirSync(path.join(__dirname, "..", "schema"));
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
    fs.writeFileSync(filepath, SchemaContent(columns, tablename));
    return true;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = CreateSchema;
