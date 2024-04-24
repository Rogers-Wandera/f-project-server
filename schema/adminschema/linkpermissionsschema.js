const joi = require("joi");

const linkpermissionsSchema = joi.object({
  accessName: joi.string().min(3).max(250).required().messages({
    "any.required": "accessName is required",
    "string.empty": "accessName cannot be empty",

    "string.max": "accessName must be at most {#limit} characters",
    "string.min": "accessName must be at least {#limit} characters",
  }),
  acessRoute: joi.string().min(3).max(250).required().messages({
    "any.required": "acessRoute is required",
    "string.empty": "acessRoute cannot be empty",

    "string.max": "acessRoute must be at most {#limit} characters",
    "string.min": "acessRoute must be at least {#limit} characters",
  }),
  method: joi.string().min(3).max(250).required().messages({
    "any.required": "method is required",
    "string.empty": "method cannot be empty",

    "string.max": "method must be at most {#limit} characters",
    "string.min": "method must be at least {#limit} characters",
  }),
  description: joi.string().min(3).max(250).required().messages({
    "any.required": "description is required",
    "string.empty": "description cannot be empty",

    "string.max": "description must be at most {#limit} characters",
    "string.min": "description must be at least {#limit} characters",
  }),
});
const linkpermissionsQueryParams = joi.object({
  linkpermissionId: joi.string().required().messages({
    "any.required": "linkpermissionId is required",
    "any.string": "linkpermissionId must be a string",
  }),
});
module.exports = { linkpermissionsSchema, linkpermissionsQueryParams };
