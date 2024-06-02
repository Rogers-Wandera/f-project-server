const joi = require("joi");

const rolepermissionsSchema = joi.object({
  roleId: joi.number().required().messages({
    "any.required": "roleId is required",
    "number.base": "roleId must be a number",
  }),
  permissionId: joi.number().required().messages({
    "any.required": "permissionId is required",
    "number.base": "permissionId must be a number",
  }),
  userId: joi.string().min(3).max(250).required().messages({
    "any.required": "userId is required",
    "string.empty": "userId cannot be empty",
    "string.max": "userId must be at most {#limit} characters",
    "string.min": "userId must be at least {#limit} characters",
  }),
});
const rolepermissionsQueryParams = joi.object({
  rolepermissionId: joi.string().required().messages({
    "any.required": "rolepermissionId is required",
    "any.string": "rolepermissionId must be a string",
  }),
});
module.exports = { rolepermissionsSchema, rolepermissionsQueryParams };
