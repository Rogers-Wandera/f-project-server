const express = require("express");
const router = express.Router();
const { validateSchema } = require("../../middlewares/validationAuth");
const { createTableSchema } = require("../../schema/schema");

router
  .route("/createtable")
  .post(validateSchema(createTableSchema), async (req, res) => {
    try {
      const { tablename, columns } = req.body;
      const result = await req.db.createTable(tablename, columns);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
