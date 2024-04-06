const { checkExpireDate } = require("../helpers/helperfuns");
const { logEvent } = require("./logs");

const VerifyRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.roles) {
        return res
          .status(401)
          .json({ msg: "not authorized to access this route" });
      }
      const rolesArray = [...allowedRoles];
      const results = req.roles.map((role) => rolesArray.includes(role));
      const checkResults = results.find((val) => val === true);

      // get the request method
      const method = req.method;
      const urlpath = `${req.baseUrl}${req.route.path}`;

      // looking into the temporary roles to find a match
      const findTempRoles = await req.db.findByConditions("vw_usertemproles", {
        userId: req.user.id,
        roleValue: urlpath,
        trrisActive: 1,
      });

      let urlExists = false;
      const methods = [];

      // check to see if the role and method exist on the temproles
      if (findTempRoles.length > 0) {
        for (let i = 0; i < findTempRoles.length; i++) {
          methods.push(findTempRoles[i].method);
          if (findTempRoles[i].roleValue === urlpath) {
            if (methods.includes(method)) {
              urlExists = findTempRoles[i];
              break;
            }
            break;
          }
        }
      }

      let expired = false;
      // if the role is true and has expired we send a 401 error
      if (urlExists) {
        // check if the role has expired
        expired = checkExpireDate(urlExists.expireTime);
        if (expired) {
          return res.status(401).json({
            msg: "Your access rights have expired contact Authorized personel",
          });
        }
      } else {
        // else we check
        if (!checkResults) {
          return res.status(401).json({
            msg: "This is a protected Route. Contact Authorized personel",
          });
        }
      }
      // log the user and what he or she is accessing
      const usercred = `Name: ${req.user.displayName}, Id: ${req.user.id} `;
      const accessroute = ` Method: ${method}, Route: ${urlpath}`;
      logEvent(usercred + accessroute, "accesslog.md");
      next();
    } catch (error) {
      res.status(400).json({ error: "Verify roles error -> " + error.message });
    }
  };
};

module.exports = VerifyRoles;
