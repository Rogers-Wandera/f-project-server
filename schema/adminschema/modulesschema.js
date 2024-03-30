const joi = require("joi");

const ModulesSchema = joi.object({
  name: joi.string().required().min(3).max(30).messages({
    "string.empty": "Module name is required",
    "any.required": "Module name is required",
    "string.alphanum": "Module name must contain only alphanumeric characters",
    "string.min": "Module name must be at least {#limit} characters",
    "string.max": "Module name must be at most {#limit} characters",
  }),
  position: joi.number().optional().messages({
    "number.base": "Position must be a number",
  }),
});

const queryparams = joi.object({
  id: joi.string().required().messages({
    "string.empty": "Id is required",
    "any.required": "Id is required",
  }),
});

const modulelinksschema = joi.object({
  linkname: joi.string().required().min(3).max(30).messages({
    "string.empty": "Link name is required",
    "any.required": "Link name is required",
    "string.alphanum": "Link name must contain only alphanumeric characters",
    "string.min": "Link name must be at least {#limit} characters",
    "string.max": "Link name must be at most {#limit} characters",
  }),
  position: joi.number().optional().messages({
    "number.base": "Position must be a number",
  }),
  route: joi.string().required().min(3).max(200).messages({
    "string.empty": "Route is required",
    "any.required": "Route is required",
    "string.min": "Route must be at least {#limit} characters",
    "string.max": "Route must be at most {#limit} characters",
  }),
  released: joi.number().optional().messages({
    "number.base": "Released must be a number",
  }),
});

module.exports = { ModulesSchema, queryparams, modulelinksschema };
