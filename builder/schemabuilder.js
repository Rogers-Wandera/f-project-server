const path = require("path");
const fs = require("fs");
const SchemaContent = (columns = [], tablename) => {
  try {
    const schemaobjects = {};
    let datetimeexists = false;
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
        } else if (column.type.startsWith("datetime")) {
          type = "date";
          format = "YYYY-MM-DD HH:mm:ss";
          required = column.type.includes("not null") ? true : false;
          datetimeexists = true;
        } else if (column.type.startsWith("date")) {
          type = "date";
          format = "YYYY-MM-DD";
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
        }${required ? ".required()" : ".optional()"}${
          format ? `.format('${format}')` : ""
        }${
          column.enums
            ? `.valid(${column.enums.map((e) => `'${e}'`).join(",")})`
            : ""
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
        }
        ${
          type === "number"
            ? `'number.base': '${column.name} must be a number',`
            : ""
        }
        ${
          maxlength
            ? `'string.max': '${column.name} must be at most {#limit} characters','string.min': '${column.name} must be at least {#limit} characters',`
            : ""
        }
        ${
          column.enums
            ? `'any.only': '${column.name} must be one of ${column.enums.join(
                ", "
              )}',`
            : ""
        }
      })`;
      }
    });
    let queryname = "";
    // trim away s from the tablename if exists
    if (tablename.endsWith("s")) {
      queryname = tablename.slice(0, -1);
    } else {
      queryname = tablename;
    }
    const schemaobjectsEntries = Object.entries(schemaobjects);
    const schemaobjectsString = schemaobjectsEntries
      .map(([key, value]) => `${key}: ${value}`)
      .join(",\n");

    let textimport = "const joi = require('joi');\n";
    if (datetimeexists === true) {
      textimport = "const joi = require('joi').extend(require('@joi/date'));\n";
    }
    const content = `${textimport}
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

const CreateSchema = async (columns = [], tablename, folder = null) => {
  try {
    if (columns.length === 0) {
      return;
    }
    let filexists = `${tablename}schema.js`;
    let filepath = path.join(__dirname, "..", "schema", filexists);
    const copypath = path.join(__dirname, "..", "copy", filexists);
    //   create directory if it does not exist
    if (folder !== null) {
      filepath = path.join(__dirname, "..", "schema", folder, filexists);
      if (!fs.existsSync(path.join(__dirname, "..", "schema", folder))) {
        fs.mkdirSync(path.join(__dirname, "..", "schema", folder));
      }
    } else {
      if (!fs.existsSync(path.join(__dirname, "..", "schema"))) {
        fs.mkdirSync(path.join(__dirname, "..", "schema"));
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
    fs.writeFileSync(filepath, SchemaContent(columns, tablename));
    return true;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = CreateSchema;
