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
  expireDate: joi.alternatives().try(
    joi.date().required().format("YYYY-MM-DD HH:mm").min(new Date()).messages({
      "any.required": "Expire Date is required",
      "date.format": "Expire Date must be in format YYYY-MM-DD HH:mm",
      "date.base": "Expire Date must be a date",
      "date.min": "Expire Date must be greater than or equal to now",
    }),
    joi.allow(null).messages({
      "any.allowOnly": "Exipre Date is required",
      "any.required": "Exipre Date is required",
    })
  ),
});

const linkrolesupdateSchema = joi.object({
  expireDate: joi.date().required().format("YYYY-MM-DD HH:mm").messages({
    "any.required": "Expire Date is required",
    "date.format": "Expire Date must be in format YYYY-MM-DD HH:mm",
    "date.base": "Expire Date must be a date",
  }),
});
const linkrolesQueryParams = joi.object({
  linkroleId: joi.string().required().messages({
    "any.required": "linkroleId is required",
    "any.string": "linkroleId must be a string",
  }),
});
module.exports = {
  linkrolesSchema,
  linkrolesQueryParams,
  linkrolesupdateSchema,
};
