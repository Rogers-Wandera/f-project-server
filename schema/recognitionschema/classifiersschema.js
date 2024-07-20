const joi = require("joi");
const { imagesArray } = require("../personschema/schema");

const classifiersSchema = joi.object({
  userId: joi.string().min(3).max(150).required().messages({
    "any.required": "userId is required",
    "string.empty": "userId cannot be empty",
    "string.max": "userId must be at most {#limit} characters",
    "string.min": "userId must be at least {#limit} characters",
  }),
  type: joi
    .string()
    .valid("url_image", "local_image", "blob")
    .required()
    .messages({
      "any.required": "type is required",
      "string.empty": "type cannot be empty",
    }),
  image: imagesArray.optional().allow({}).messages({
    "any.required": "image is required",
  }),
  url: joi.string().optional().allow("").messages({
    "any.required": "url is required",
  }),
  predictionType: joi.string().valid("Image", "Audio").required().messages({
    "any.required": "prediction type is required",
    "string.empty": "prediction type cannot be empty",
  }),
});
const classifiersQueryParams = joi.object({
  classifierId: joi.string().required().messages({
    "any.required": "classifierId is required",
    "any.string": "classifierId must be a string",
  }),
});
module.exports = { classifiersSchema, classifiersQueryParams };
