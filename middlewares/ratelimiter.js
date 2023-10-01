const { rateLimit } = require("express-rate-limit");

const RequesteLimiter = (
  limit,
  message = "Too many Request Please try again after 1 hour"
) => {
  return rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: limit,
    standardHeaders: "draft-7",
    message: message,
    legacyHeaders: false,
  });
};

module.exports = { RequesteLimiter };
