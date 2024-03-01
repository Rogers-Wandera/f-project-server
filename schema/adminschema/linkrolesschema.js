const joi = require("joi").extend(require("@joi/date"));

const linkrolesSchema = joi.object({
  linkId: joi.number().required().messages({
    "any.required": "linkId is required",
    "number.base": "linkId must be a number",
  }),
  userId: joi.string().min(3).max(200).required().messages({
    "any.required": "userId is required",
    "string.empty": "userId cannot be empty",

    "string.max": "userId must be at most {#limit} characters",
    "string.min": "userId must be at least {#limit} characters",
  }),
  expireDate: joi
    .date()
    .required()
    .format("YYYY-MM-DD HH:mm")
    .min(new Date())
    .messages({
      "any.required": "expireDate is required",
      "date.format": "expireDate must be in format YYYY-MM-DD HH:mm",
      "date.base": "expireDate must be a date",
      "date.min": "expireDate must be greater than or equal to now",
    }),
});
const linkrolesQueryParams = joi.object({
  linkroleId: joi.string().required().messages({
    "any.required": "linkroleId is required",
    "any.string": "linkroleId must be a string",
  }),
});
module.exports = { linkrolesSchema, linkrolesQueryParams };
