const joi = require('joi');

    const predictionsSchema = joi.object({
        classifierId: joi.number().required().messages({'any.required': 'classifierId is required',
        'number.base': 'classifierId must be a number',
        
        
      }),
personName: joi.string().min(3).max(100).required().messages({'any.required': 'personName is required','string.empty': 'personName cannot be empty',
        
        'string.max': 'personName must be at most {#limit} characters','string.min': 'personName must be at least {#limit} characters',
        
      }),
confidence: joi.number().required().messages({'any.required': 'confidence is required',
        'number.base': 'confidence must be a number',
        
        
      }),
personId: joi.string().min(3).max(100).required().messages({'any.required': 'personId is required','string.empty': 'personId cannot be empty',
        
        'string.max': 'personId must be at most {#limit} characters','string.min': 'personId must be at least {#limit} characters',
        
      }),
ranking: joi.number().required().messages({'any.required': 'ranking is required',
        'number.base': 'ranking must be a number',
        
        
      }),
modelType: joi.string().min(3).max(100).required().messages({'any.required': 'modelType is required','string.empty': 'modelType cannot be empty',
        
        'string.max': 'modelType must be at most {#limit} characters','string.min': 'modelType must be at least {#limit} characters',
        
      })
    })
    const predictionsQueryParams = joi.object({
        predictionId: joi.string().required().messages({
            'any.required': 'predictionId is required',
            'any.string': 'predictionId must be a string'
        })
    })
module.exports = {predictionsSchema, predictionsQueryParams};