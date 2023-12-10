const validateSchema = (schema, contextData = null) => {
  return async (req, res, next) => {
    try {
      const context = {};
      if (contextData) {
        if (!Array.isArray(contextData)) {
          return res
            .status(400)
            .json({ errors: "contextData must be an array" });
        }
        contextData.forEach((data) => {
          context[data] = req.body[data];
        });
      }
      const validationOptions = contextData
        ? { abortEarly: false, context }
        : { abortEarly: false };
      await schema.validateAsync(req.body, validationOptions);
      next();
    } catch (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));
      return res.status(400).json({ errors });
    }
  };
};

const validateParamsSchema = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.params, { abortEarly: false });
      next();
    } catch (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));
      return res.status(400).json({ errors });
    }
  };
};

const validateQueryParamsSchema = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.query, { abortEarly: false });
      next();
    } catch (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));
      return res.status(400).json({ errors });
    }
  };
};

module.exports = {
  validateSchema,
  validateParamsSchema,
  validateQueryParamsSchema,
};
