const joi = require("joi");

const userprofileimagesSchema = joi.object({
  image: joi.string().min(3).max(250).required().messages({
    "any.required": "image is required",
    "string.empty": "image cannot be empty",
    "string.max": "image must be at most {#limit} characters",
    "string.min": "image must be at least {#limit} characters",
  }),
  userId: joi.string().min(3).max(200).required().messages({
    "any.required": "userId is required",
    "string.empty": "userId cannot be empty",
    "string.max": "userId must be at most {#limit} characters",
    "string.min": "userId must be at least {#limit} characters",
  }),
});
const userprofileimagesQueryParams = joi.object({
  userprofileimageId: joi.string().required().messages({
    "any.required": "userprofileimageId is required",
    "any.string": "userprofileimageId must be a string",
  }),
});
module.exports = { userprofileimagesSchema, userprofileimagesQueryParams };
