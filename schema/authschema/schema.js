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
const loginSchema = joi.object({
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
});

const resetPasswordSchema = joi.object({
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.email": "Invalid email address",
      "any.required": "Email is required",
      "string.empty": "Email is required",
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

const resetPasswordLinkSchema = joi.object({
  userId: joi.string().required().messages({
    "string.empty": "User id is required",
    "any.required": "User id is required",
  }),
  token: joi.string().required().messages({
    "string.empty": "Token is required",
    "any.required": "Token is required",
  }),
});

const resetUserPasswordSchema = joi.object({
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

const resetUserPasswordParamsSchema = joi.object({
  userId: joi.string().required().messages({
    "string.empty": "User id is required",
    "any.required": "User id is required",
  }),
});

module.exports = {
  RegistrationSchema,
  tokenSchema,
  regenerateSchema,
  resetPasswordSchema,
  loginSchema,
  resetPasswordLinkSchema,
  resetUserPasswordParamsSchema,
  resetUserPasswordSchema,
};
