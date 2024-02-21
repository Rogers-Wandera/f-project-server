const joi = require("joi");

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

const AddRoleSchema = joi.object({
  role: joi.string().valid("Admin", "User", "Editor").required().messages({
    "string.empty": "Role is required",
    "any.required": "Role is required",
    "any.only": "Role must be Admin, User or Editor",
  }),
  userId: joi.string().required().messages({
    "string.empty": "User id is required",
    "any.required": "User id is required",
  }),
});

const AddTempRolesMethodsSchema = joi.object({
  method: joi
    .string()
    .valid("GET", "POST", "PUT", "DELETE", "PATCH")
    .required()
    .messages({
      "string.empty": "Method is required",
      "any.required": "Method is required",
      "any.only": "Method must be GET, POST, PUT or DELETE",
    }),
});

const AddTempRolesSchema = joi.object({
  roleName: joi.string().required().messages({
    "string.empty": "Role Name is required",
    "any.required": "Role Name is required",
  }),
  roleValue: joi.string().required().messages({
    "string.empty": "Role Value is required",
    "any.required": "Role Value is required",
  }),
  description: joi.string().messages({
    "string.empty": "Description is required",
  }),
  expireTime: joi.date().required().messages({
    "string.empty": "Expire time is required",
    "any.required": "Expire time is required",
    "date.base": "Expire time must be a valid date",
  }),
  methods: joi.array().items(AddTempRolesMethodsSchema).required().messages({
    "array.min": "At least one method is required",
    "any.required": "Methods are required",
  }),
});

const GetTempRolesQueryParams = joi.object({
  temproleId: joi.string().required().messages({
    "string.empty": "Temp role id is required",
    "any.required": "Temp role id is required",
  }),
});

module.exports = {
  createTableSchema,
  createColumnsSchema,
  AddRoleSchema,
  AddTempRolesSchema,
  GetTempRolesQueryParams,
};
