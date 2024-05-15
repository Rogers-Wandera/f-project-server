const joi = require("joi");

const refreshtokensSchema = joi.object({
  userId: joi.string().min(3).max(250).required().messages({
    "any.required": "userId is required",
    "string.empty": "userId cannot be empty",
    "string.max": "userId must be at most {#limit} characters",
    "string.min": "userId must be at least {#limit} characters",
  }),
  token: joi.string().required().messages({
    "any.required": "token is required",
    "string.empty": "token cannot be empty",
  }),
});
const refreshtokensQueryParams = joi.object({
  refreshtokenId: joi.string().required().messages({
    "any.required": "refreshtokenId is required",
    "any.string": "refreshtokenId must be a string",
  }),
});
module.exports = { refreshtokensSchema, refreshtokensQueryParams };
