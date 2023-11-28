require("dotenv").config();
const express = require("express");
require("express-async-errors");
const cors = require("cors");
const http = require("http");
const Connection = require("./conn/conn");
const { dbConfig } = require("./conn/configs");
const RegisterRoute = require("./routes/auth/registerroute");
const CreateTable = require("./routes/helperroutes/createtable");
const VerifyRoute = require("./routes/auth/verifyroute");
const RegenerateRoute = require("./routes/auth/regenerateroute");
const notFound = require("./errorHandler/notfound");
const errorHandler = require("./errorHandler/errorHandler");
const { logger } = require("./middlewares/logs");
const corsOptions = require("./conn/corsOptions");
const credentials = require("./middlewares/credential");
const ResetPassword = require("./routes/auth/resetpasswordroute");
const { RequesteLimiter } = require("./middlewares/ratelimiter");
const LoginRoute = require("./routes/auth/loginroute");
const cronjob = require("node-cron");
const app = express();
const Server = http.createServer(app);
const FileUploader = require("./conn/uploader");

app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));

const database = new Connection(dbConfig);
const fileupload = new FileUploader();
const base_url = process.env.BASE_API;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  req.db = database;
  req.upload = fileupload;
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
app.use(`${base_url}/resetpassword`, ResetPassword);
app.use(`${base_url}/login`, LoginRoute);

// error middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.post(`${base_url}/upload`, async (req, res) => {
  try {
    fileupload.filename = "image";
    const response = await fileupload.handleFileUpload(req, res);
    const resp = await fileupload.multipleUploadCloudinary(response);
    res.status(200).json({ resp });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const limiter = RequesteLimiter(2);
app.use(limiter, notFound);
const port = process.env.PORT || 3500;

app.use(errorHandler);
Server.listen(port, async () => {
  try {
    await database.connectDB();
    console.log(`Server running on port ${port}`);
    await database.disconnectDb();
    const midnightCrons = () => {
      cronjob.schedule("0 0 * * *", async () => {
        await database.DeleteRecycleBinData();
      });
    };
    midnightCrons();
  } catch (error) {
    console.log(error);
  }
});
