const joi = require("joi");
const prefixes = ["+256", "+254", "+255"];

const customValidation = (value, helpers) => {
  if (typeof value !== "string") {
    return helpers.message('"value" must be a string');
  }
  const startsWithPrefix = prefixes.some((prefix) => value.startsWith(prefix));
  if (!startsWithPrefix) {
    return helpers.message(
      `"value" must start with one of the following prefixes: ${prefixes.join(
        ", "
      )}`
    );
  }
  return value;
};

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
  adminCreated: joi.alternatives().try(
    joi.number().required().messages({
      "number.base": "Admin created must be a number",
      "any.required": "Admin created is required",
    }),
    joi.allow(null).messages({
      "any.allowOnly": "Admin created is required",
      "any.required": "Admin created is required",
    })
  ),
  gender: joi.string().valid("Male", "Female").required().messages({
    "string.empty": "Gender cannot be empty",
    "any.required": "Gender is required",
    "any.only": "Gender must be Male or Female",
  }),
  tel: joi.string().required().custom(customValidation).messages({
    "string.empty": "Telephone number cannot be empty",
    "any.required": "Telephone number is required",
  }),
  position: joi.number().required().positive().messages({
    "any.required": "Position is required.",
    "number.base": "Position must be a number",
    "number.positive": "Position must be greater than or equal to 1",
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
