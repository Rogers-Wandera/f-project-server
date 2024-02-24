const joi = require("joi");

    const linkrolesSchema = joi.object({
        linkId: joi.number().required().messages({'any.required': 'linkId is required',
        'number.base': 'linkId must be a number',
        
        
      }),
userId: joi.string().min(3).max(200).required().valid('people','person').messages({'any.required': 'userId is required','string.empty': 'userId cannot be empty',
        
        'string.max': 'userId must be at most {#limit} characters','string.min': 'userId must be at least {#limit} characters',
        'any.only': 'userId must be one of people, person',
      })
    })
    const linkrolesQueryParams = joi.object({
        linkroleId: joi.string().required().messages({
            'any.required': 'linkroleId is required',
            'any.string': 'linkroleId must be a string'
        })
    })
module.exports = {linkrolesSchema, linkrolesQueryParams};