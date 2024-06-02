const joi = require("joi");

const trainerSchema = joi.object({
  userId: joi.string().min(3).max(250).required().messages({
    "any.required": "userId is required",
    "string.empty": "userId cannot be empty",

    "string.max": "userId must be at most {#limit} characters",
    "string.min": "userId must be at least {#limit} characters",
  }),
  type: joi.string().valid("Audio", "Image").required().messages({
    "any.required": "type is required",
    "string.empty": "type cannot be empty",
  }),
  trainerOptions: joi
    .object({
      version: joi.string().valid("v1", "v2").required().messages({
        "any.required": "version is required",
        "any.valid": "Version must be in v1 or v2",
        "string.empty": "Version cannot be empty",
      }),
      activation: joi.string().valid("relu", "sigmoid").required().messages({
        "any.required": "Activation is required",
        "any.valid": "Activation must be in relu or sigmoid",
        "string.empty": "Activation cannot be empty",
      }),
      // remove: joi.number().valid(1, 0).required().messages({
      //   "any.required": "Remove is required",
      //   "any.valid": "Remove must be in 0 or 1",
      //   "string.empty": "Remove cannot be empty",
      // }),
      // download: joi.number().valid(1, 0).required().messages({
      //   "any.required": "Download is required",
      //   "any.valid": "Download must be in 0 or 1",
      //   "string.empty": "Download cannot be empty",
      // }),
    })
    .optional()
    .messages({
      "any.object": "trainerOptions must be an object",
    }),
});
const trainerQueryParams = joi.object({
  trainerId: joi.string().required().messages({
    "any.required": "trainerId is required",
    "any.string": "trainerId must be a string",
  }),
});
module.exports = { trainerSchema, trainerQueryParams };
