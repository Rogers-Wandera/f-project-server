require("dotenv").config();
const express = require("express");
require("express-async-errors");
const cors = require("cors");
const http = require("http");
const Connection = require("./conn/connection/extenderbuilder");
const notFound = require("./errorHandler/notfound");
const errorHandler = require("./errorHandler/errorHandler");
const { logger } = require("./middlewares/logs");
const corsOptions = require("./conn/corsOptions");
const credentials = require("./middlewares/credential");
const { RequesteLimiter } = require("./middlewares/ratelimiter");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.BASE_FRONT_URL,
    credentials: true,
  },
});
const { HandleCrons } = require("./utils/crons");
const MainRouter = require("./routes");
const path = require("path");
const { HandleOnline } = require("./sockets/online");
const Classifiers = require("./models/classifiersmodel");

app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));

const database = new Connection();
// const fileupload = new FileUploader();
const base_url = process.env.BASE_API;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  "/api/v1/recordings",
  express.static(path.join(__dirname, "recordings"))
);

app.use((req, res, next) => {
  req.db = database;
  req.io = io;
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
  res.json({ message: "Welcome to the API" });
});
app.use(`${base_url}`, MainRouter);
//end of routes

// io
io.on("connection", async (socket) => {
  console.log("a user connected");
  const allsockets = await io.fetchSockets();
  const socketids = allsockets.map((sck) => sck.id);
  if (socketids.length > 0) {
    HandleOnline(socket, io).onlineusers(database);
    HandleOnline(socket, io).logoutsuer(database);
    socket.on("clientusersrefresh", () => {
      io.emit("refreshusers", {});
    });
  }

  socket.on("videostream", async (data) => {
    socket.broadcast.emit("videostream", data);
  });

  socket.on("startstream", async (data) => {
    try {
      const classifiers = new Classifiers(database);
      const response = await classifiers.HandleLivePredicions(data);
      socket.emit("streaminfo", response.msg);
    } catch (error) {
      socket.emit("stream_error", error.message);
    }
  });

  socket.on("stopstream", async (data) => {
    try {
      const classifiers = new Classifiers(database);
      const response = await classifiers.StopLivePredicions(data);
      socket.emit("streaminfo", response.msg);
    } catch (error) {
      socket.emit("stream_error", error.message);
    }
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    HandleOnline(socket, io).offline(database);
  });
});
const limiter = RequesteLimiter(2);
app.use(limiter, notFound);
const port = process.env.PORT || 3500;

app.use(errorHandler);
server.listen(port, async () => {
  try {
    await database.connectDB();
    console.log(`Server running on port ${port}`);
    HandleCrons(database, io);
    await database.disconnectDb();
  } catch (error) {
    console.log(error);
  }
});
