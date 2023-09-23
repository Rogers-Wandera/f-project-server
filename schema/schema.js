const joi = require("joi");

const RegistrationSchema = joi.object({
  firstname: joi.string().alphanum().min(3).max(30).required().messages({
    "string.empty": "First name is required",
    "any.required": "First name is required",
    "string.alphanum":
      "First name must contain only alphabet characters e.g(A-Z)",
    "string.min": "First name must be at least {#limit} characters",
    "string.max": "First name must be at most {#limit} characters",
  }),
  lastname: joi.string().alphanum().min(3).max(30).required().messages({
    "string.empty": "Last name is required",
    "any.required": "Last name is required",
    "string.alphanum":
      "Last name must contain only alphabet characters e.g(A-Z)",
    "string.min": "Last name must be at least {#limit} characters",
    "string.max": "Last name must be at most {#limit} characters",
  }),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.email": "Invalid email address",
      "any.required": "Email is required",
      "string.empty": "Email is required",
    }),
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[a-zA-Z\d]).{6,}$/))
    .required()
    .messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
      "string.pattern.base":
        "Password must be at least 6 characters long containing at least one letter and one number",
    }),
  confirmpassword: joi.valid(joi.ref("password")).required().messages({
    "any.only": "Passwords must match",
    "any.required": "Password confirmation is required",
  }),
});
const createColumnsSchema = joi.object({
  name: joi.string().alphanum().min(2).max(30).required().messages({
    "string.empty": "Column name is required",
    "any.required": "Column name is required",
    "string.alphanum": "Column name must contain only alphanumeric characters",
    "string.min": "Column name must be at least {#limit} characters",
    "string.max": "Column name must be at most {#limit} characters",
  }),
  type: joi.string().min(3).max(255).required().messages({
    "string.empty": "Column type is required",
    "any.required": "Column type is required",
    "string.min": "Column type must be at least {#limit} characters",
    "string.max": "Column type must be at most {#limit} characters",
  }),
});
const createTableSchema = joi.object({
  tablename: joi
    .string()
    .regex(/^[A-Za-z]+$/)
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.empty": "Table name is required",
      "any.required": "Table name is required",
      "string.alphanum":
        "Table name must contain only alphabet characters e.g(A-Z)",
      "string.min": "Table name must be at least {#limit} characters",
      "string.max": "Table name must be at most {#limit} characters",
      "string.pattern.base":
        "Table name must contain only alphabet characters e.g(A-Z)",
    }),
  columns: joi.array().min(1).items(createColumnsSchema).required().messages({
    "array.min": "At least one column is required",
    "any.required": "Columns are required",
  }),
});

const tokenSchema = joi.object({
  userId: joi.string().required().messages({
    "string.empty": "User id is required",
    "any.required": "User id is required",
  }),
  token: joi.string().required().messages({
    "string.empty": "Token is required",
    "any.required": "Token is required",
  }),
});

const regenerateSchema = joi.object({
  userId: joi.string().required().messages({
    "string.empty": "User id is required",
    "any.required": "User id is required",
  }),
});

module.exports = {
  RegistrationSchema,
  createTableSchema,
  tokenSchema,
  regenerateSchema,
};
