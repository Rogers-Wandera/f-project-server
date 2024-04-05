const joi = require("joi");

const positionsSchema = joi.object({
  position: joi.string().min(3).max(200).required().messages({
    "any.required": "position is required",
    "string.empty": "position cannot be empty",

    "string.max": "position must be at most {#limit} characters",
    "string.min": "position must be at least {#limit} characters",
  }),
});
const positionsQueryParams = joi.object({
  positionId: joi.string().required().messages({
    "any.required": "positionId is required",
    "any.string": "positionId must be a string",
  }),
});
module.exports = { positionsSchema, positionsQueryParams };
