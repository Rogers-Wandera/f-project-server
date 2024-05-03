const joi = require("joi");
const createPersonSchema = joi
  .object({
    firstName: joi.string().required().messages({
      "string.empty": "First name cannot be empty",
      "any.required": "First name is required",
    }),
    lastName: joi.string().required().messages({
      "string.empty": "Last name cannot be empty",
      "any.required": "Last name is required",
    }),
    status: joi.string().valid("Alive", "Deceased").required().messages({
      "string.empty": "Status cannot be empty",
      "any.required": "Status is required",
      "any.only": "Status must be alive or deceased",
    }),
    gender: joi.string().valid("Male", "Female").required().messages({
      "string.empty": "Gender cannot be empty",
      "any.required": "Gender is required",
      "any.only": "Gender must be male or female",
    }),
    nationalId: joi
      .string()
      .length(14)
      .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)
      .custom((value, helpers) => {
        const specifiedGender = helpers.prefs.context.gender.toLowerCase();
        const expectedGenderCode = specifiedGender === "male" ? "CM" : "CF";
        const genderCode = value.substring(0, 2).toUpperCase();
        if (genderCode !== expectedGenderCode) {
          return helpers.message(
            `Gender mismatch in the ID. Expected: ${specifiedGender} to start with ${expectedGenderCode}`
          );
        }
      })
      .required()
      .messages({
        "string.empty": "National id cannot be empty",
        "any.required": "National id is required",
        "string.length": "National ID should be exactly 14 characters",
        "string.pattern.base": "ID must contain numbers and letters only",
      }),
  })
  .prefs({ convert: false });

const PersonMeta = joi.object({
  metaName: joi.string().required().messages({
    "string.empty": "Meta name cannot be empty",
    "any.required": "Meta name is required",
  }),
  metaDesc: joi.string().required().messages({
    "string.empty": "Meta description cannot be empty",
    "any.required": "Meta description is required",
  }),
});

const PersonMetaParams = joi.object({
  personId: joi.string().required().messages({
    "string.empty": "Person id cannot be empty",
    "any.required": "Person id is required",
  }),
});

const PersonMetaQueryParams = joi.object({
  metaId: joi.string().required().messages({
    "string.empty": "Meta id cannot be empty",
    "any.required": "Meta id is required param",
  }),
});

const imagesArray = joi.object({
  fieldname: joi.string().valid("image").required().messages({
    "string.empty": "Fieldname cannot be empty",
    "any.required": "Fieldname is required",
    "any.only": "Fieldname must be image",
  }),
  originalname: joi.string().required().messages({
    "string.empty": "Original name cannot be empty",
    "any.required": "Original name is required",
  }),
  encoding: joi.string().required().messages({
    "string.empty": "Encoding cannot be empty",
    "any.required": "Encoding is required",
  }),
  mimetype: joi
    .string()
    .valid("image/jpeg", "image/png", "image/jpg")
    .required()
    .messages({
      "string.empty": "Mimetype cannot be empty",
      "any.required": "Mimetype is required",
      "any.only": "image type must be jpeg, png, jpg",
    }),
  destination: joi.string().required().messages({
    "string.empty": "Destination cannot be empty",
    "any.required": "Destination is required",
  }),
  filename: joi.string().required().messages({
    "string.empty": "Filename cannot be empty",
    "any.required": "Filename is required",
  }),
  path: joi.string().required().messages({
    "string.empty": "Path cannot be empty",
    "any.required": "Path is required",
  }),
  size: joi.number().required().messages({
    "string.empty": "Size cannot be empty",
    "any.required": "Size is required",
  }),
});

const PersonImageSchema = joi.object({
  images: joi.array().items(imagesArray).min(1).required().messages({
    "array.empty": "Images cannot be empty",
    "any.required": "Images is required",
    "array.min": "At least one Images is required",
  }),
});

const PersonImageMetaSchema = joi.object({
  metaName: joi.string().required().messages({
    "string.empty": "Meta name cannot be empty",
    "any.required": "Meta name is required",
  }),
  metaDesc: joi.string().required().messages({
    "string.empty": "Meta description cannot be empty",
    "any.required": "Meta description is required",
  }),
});

const PersonImageQueryParams = joi.object({
  imageId: joi.string().required().messages({
    "string.empty": "Image id cannot be empty",
    "any.required": "Image id is required param",
  }),
});

const deleteschema = joi.object({
  imageId: joi.string().required().messages({
    "string.empty": "Image id cannot be empty",
    "any.required": "Image id is required param",
  }),
  publicId: joi.string().required().messages({
    "string.empty": "Public id cannot be empty",
    "any.required": "Public id is required param",
  }),
});

const deletemanyimagesschema = joi.object({
  data: joi.array().items(deleteschema).min(1).required().messages({
    "any.required": "Data is required",
    "array.min": "At least one image is required",
    "array.empty": "Data cannot be empty",
  }),
});

const PersonImageMetaQueryParams = joi.object({
  metaId: joi.string().required().messages({
    "string.empty": "Meta id cannot be empty",
    "any.required": "Meta id is required param",
  }),
  imageId: joi.string().required().messages({
    "string.empty": "Image id cannot be empty",
    "any.required": "Image id is required param",
  }),
});

const PersonAudioObject = joi.object({
  path: joi.string().required().messages({
    "string.empty": "Path cannot be empty",
    "any.required": "Path is required",
  }),
  flags: joi.string().messages({
    "string.empty": "Flags cannot be empty",
    "any.required": "Flags is required",
  }),
  defaultEncoding: joi.string().messages({
    "string.empty": "Default encoding cannot be empty",
    "any.required": "Default encoding is required",
  }),
});

const PersonAudioSchema = joi.object({
  audio: PersonAudioObject.required().messages({
    "string.empty": "Audio cannot be empty",
    "any.required": "Audio is required",
  }),
  recorded: joi.string().valid("true", "false").required().messages({
    "string.empty": "Recorded cannot be empty",
    "any.required": "Recorded is required",
    "any.only": "Recorded must be true or false",
  }),
});

const PersonAudioParams = joi.object({
  audioId: joi.string().required().messages({
    "string.empty": "Audio id cannot be empty",
    "any.required": "Audio id is required param",
  }),
});

module.exports = {
  createPersonSchema,
  PersonMeta,
  PersonMetaParams,
  PersonMetaQueryParams,
  PersonImageSchema,
  PersonImageMetaSchema,
  PersonImageQueryParams,
  PersonImageMetaQueryParams,
  PersonAudioSchema,
  PersonAudioParams,
  imagesArray,
  deletemanyimagesschema,
};
