const joi = require("joi");

const relationshipSchema = joi.object({
  tablename: joi.string().required().messages({
    "string.empty": "Table name cannot be empty",
    "any.required": "Table name is required",
  }),
  relationkey: joi.string().required().messages({
    "string.empty": "Column name cannot be empty",
    "any.required": "Column name is required",
  }),
});

// const saveSchema = joi.object({
//   table: joi.string().required().messages({
//     "string.empty": "Table name cannot be empty",
//     "any.required": "Table name is required",
//   }),
//   relatedfields: joi
//     .array()
//     .items({
//       name: joi.string().required().messages({
//         "string.empty": "Name cannot be empty",
//         "any.required": "Name is required",
//       }),
//       parentfield: joi.string().required().messages({
//         "string.empty": "Parent Field cannot be empty",
//         "any.required": "Parent Field is required",
//       }),
//     })
//     .required()
//     .messages({
//       "any.required": "Related fields are required",
//     }),
//   otherfields: joi
//     .array()
//     .items(
//       joi.object({
//         name: joi.string().required().messages({
//           "string.empty": "Name cannot be empty",
//           "any.required": "Name is required",
//         }),
//         type: joi
//           .string()
//           .valid("string", "number", "date")
//           .required()
//           .messages({
//             "string.empty": "Type cannot be empty",
//             "any.required": "Type is required",
//             "any.only": "Type must be 'string', 'number', or 'date'",
//           }),
//         defaultValue: joi.any().when("type", {
//           is: "string",
//           then: joi.string().required().messages({
//             "string.empty": "Default value for string cannot be empty",
//             "any.required": "Default value for string is required",
//           }),
//           otherwise: joi.when("type", {
//             is: "number",
//             then: joi.number().required().messages({
//               "any.required": "Default value for number is required",
//             }),
//             otherwise: joi.when("type", {
//               is: "date",
//               then: joi.date().required().messages({
//                 "any.required": "Default value for date is required",
//               }),
//             }),
//           }),
//         }),
//       })
//     )
//     .optional()
//     .messages({
//       "any.required": "Other fields are required",
//     }),
// });

const boilerfunctionsSchema = joi.object({
  deletefunction: joi
    .object({
      type: joi.string().valid("soft", "hard").required().messages({
        "string.empty": "Type is required",
        "any.required": "Type is required",
        "any.only": "Type must be soft or hard",
      }),
      childtables: joi
        .array()
        .items({
          table: joi.string().required().messages({
            "string.empty": "Child table is required",
            "any.required": "Child table is required",
          }),
          column: joi.string().required().messages({
            "string.empty": "Child column is required",
            "any.required": "Child column is required",
          }),
        })
        .optional()
        .messages({
          "string.base": "Child tables must be an array of strings",
          "any.required": "Child tables are required",
        }),
    })
    .optional()
    .messages({
      "any.unknown": "Unknown property",
      "any.required": "Delete function is required",
    }),
  // addfunction: joi
  //   .object({
  //     saves: joi.array().items().optional().messages({}),
  //   })
  //   .optional()
  //   .messages({
  //     "any.unknown": "Unknown property",
  //     "any.required": "Add function is required",
  //   }),
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
  enums: joi.array().items(joi.string()).optional().messages({
    "string.base": "Enums must be an array of strings",
  }),
  relationship: joi.array().items(relationshipSchema).optional().messages({
    "string.base": "Relationship must be a string",
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
  controllerfolder: joi.string().optional().required().messages({
    "string.empty": "Controller folder is required",
    "any.required": "Controller folder is required",
  }),
  routesfolder: joi.string().optional().required().messages({
    "string.empty": "Routes folder is required",
    "any.required": "Routes folder is required",
  }),
  schemafolder: joi.string().optional().required().messages({
    "string.empty": "Schema folder is required",
    "any.required": "Schema folder is required",
  }),
  routemainname: joi.string().required().required().messages({
    "string.empty": "Route main name is required",
    "any.required": "Route main name is required",
  }),
  boilerfunctions: boilerfunctionsSchema.optional().messages({
    "any.unknown": "Unknown property",
    "any.required": "Boiler functions are required",
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
