const joi = require("joi");

const linkrolesSchema = joi.object({
  linkId: joi
    .number()
    .required()
    .messages({ "any.required": "linkId is required" }),
  userId: joi
    .string()
    .min(3)
    .max(200)
    .required()
    .messages({
      "any.required": "userId is required",
      "string.empty": "userId cannot be empty",
    }),
});
const linkrolesQueryParams = joi.object({
  linkroleId: joi.string().required().messages({
    "any.required": "linkroleId is required",
  }),
});

module.exports = { linkrolesSchema, linkrolesQueryParams };
