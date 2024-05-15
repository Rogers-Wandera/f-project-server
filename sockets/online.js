const { logEvent } = require("../middlewares/logs");

const usersonline = [];

const HandleUserOnlineClean = async (db, io) => {
  try {
    const users = await db.findByConditions("usersdata", { online: 1 });
    const ids = [];
    for (const [userId, _] of Object.entries(usersonline)) {
      ids.push(userId);
    }
    users.forEach(async (user) => {
      const connecteduser = ids.find((id) => id == user.id);
      if (!connecteduser) {
        await db.findOneAndUpdate("users", { id: user.id }, { online: 0 });
        io.emit("refreshusers", {});
      }
    });
  } catch (error) {
    logEvent(error.message, "socketLog.md");
  }
};

const HandleOnline = (socket, io) => {
  const onlineusers = (db) => {
    try {
      socket.on("userlogin", async ({ userId }) => {
        usersonline[userId] = socket.id;
        io.emit("onlinestatus", { userId: userId, online: true });
        await db.findOneAndUpdate("users", { id: userId }, { online: 1 });
        io.emit("refreshusers", {});
        io.emit("changes", {});
        HandleUserOnlineClean(db, io);
      });
    } catch (error) {
      logEvent(error.message, "socketLog.md");
    }
  };

  const logoutsuer = async (db) => {
    socket.on("userloggedout", async ({ userId }) => {
      try {
        delete usersonline[userId];
        io.emit("onlinestatus", { userId: userId, online: false });
        await db.findOneAndUpdate("users", { id: userId }, { online: 0 });
        io.emit("refreshusers", {});
      } catch (error) {
        logEvent(error.message, "socketLog.md");
      }
    });
  };

  const offline = async (db) => {
    try {
      for (const [userId, socketId] of Object.entries(usersonline)) {
        if (socketId === socket.id) {
          delete usersonline[userId];
          io.emit("onlinestatus", { userId: userId, online: false });
          await db.findOneAndUpdate("users", { id: userId }, { online: 0 });
          io.emit("refreshusers", {});
        }
      }
    } catch (error) {
      logEvent(error.message, "socketLog.md");
    }
  };

  return { onlineusers, offline, logoutsuer };
};

module.exports = { usersonline, HandleOnline };
