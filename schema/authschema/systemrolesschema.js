const joi = require("joi");

const systemrolesSchema = joi.object({
  rolename: joi.string().min(3).max(250).required().messages({
    "any.required": "rolename is required",
    "string.empty": "rolename cannot be empty",

    "string.max": "rolename must be at most {#limit} characters",
    "string.min": "rolename must be at least {#limit} characters",
  }),
  value: joi
    .number()
    .required()
    .messages({
      "any.required": "value is required",
      "number.base": "value must be a number",
    }),
  released: joi
    .number()
    .required()
    .messages({
      "any.required": "released is required",
      "number.base": "released must be a number",
    }),
  description: joi.string().min(3).max(250).required().messages({
    "any.required": "description is required",
    "string.empty": "description cannot be empty",

    "string.max": "description must be at most {#limit} characters",
    "string.min": "description must be at least {#limit} characters",
  }),
});
const systemrolesQueryParams = joi.object({
  systemroleId: joi.string().required().messages({
    "any.required": "systemroleId is required",
    "any.string": "systemroleId must be a string",
  }),
});
module.exports = { systemrolesSchema, systemrolesQueryParams };
