const validateSchema = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
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
