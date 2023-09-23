require("dotenv").config();
const express = require("express");
require("express-async-errors");
const http = require("http");
const Connection = require("./conn/conn");
const { dbConfig } = require("./conn/configs");
const RegisterRoute = require("./routes/registerroute");
const CreateTable = require("./routes/helperroutes/createtable");
const VerifyRoute = require("./routes/verifyroute");
const RegenerateRoute = require("./routes/regenerateroute");
const app = express();
const Server = http.createServer(app);

const database = new Connection(dbConfig);
const base_url = process.env.BASE_API;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  req.db = database;
  next();
});
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const end = Date.now();
    const duration = end - start;
    // console.log(`Request took ${duration}ms to process`);
  });
  next();
});

// routes
app.use(`${base_url}/register`, RegisterRoute);
app.use(`${base_url}/admin`, CreateTable);
app.use(`${base_url}/verify`, VerifyRoute);
app.use(`${base_url}/regenerate`, RegenerateRoute);

// error middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

const port = process.env.PORT || 3500;
Server.listen(port, async () => {
  try {
    await database.connectDB();
    console.log(`Server running on port ${port}`);
    await database.disconnectDb();
  } catch (error) {
    console.log(error);
  }
});
