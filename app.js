require("dotenv").config();
const express = require("express");
require("express-async-errors");
const cors = require("cors");
const http = require("http");
const Connection = require("./conn/conn");
const { dbConfig } = require("./conn/configs");
const RegisterRoute = require("./routes/auth/registerroute");
const AdminRoute = require("./routes/adminroutes/adminroutes");
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
const PersonRoute = require("./routes/personroutes/createPerson");
const PersonImageRoute = require("./routes/personroutes/personimages");
const { CheckAccessRights } = require("./utils/crons");

app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));

const database = new Connection(dbConfig);
// const fileupload = new FileUploader();
const base_url = process.env.BASE_API;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  req.db = database;
  // req.upload = fileupload;
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
app.get("/", (req, res) => {
  res.send("hello welcome to my api");
});
app.use(`${base_url}/register`, RegisterRoute);
app.use(`${base_url}/admin`, AdminRoute);
app.use(`${base_url}/verify`, VerifyRoute);
app.use(`${base_url}/regenerate`, RegenerateRoute);
app.use(`${base_url}/resetpassword`, ResetPassword);
app.use(`${base_url}/login`, LoginRoute);
app.use(`${base_url}/person`, PersonRoute);
app.use(`${base_url}/person/images`, PersonImageRoute);

// // error middleware
// app.use((err, req, res, next) => {
//   res.status(500).json({ error: err.message });
// });

const limiter = RequesteLimiter(2);
app.use(limiter, notFound);
const port = process.env.PORT || 3500;

app.use(errorHandler);
Server.listen(port, async () => {
  try {
    await database.connectDB();
    console.log(`Server running on port ${port}`);
    // hourly cron
    cronjob.schedule("0 * * * *", async () => {
      await CheckAccessRights(database);
    });
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
