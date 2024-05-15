const { fromUnixTime, subMinutes, isAfter } = require("date-fns");
const jwt = require("jsonwebtoken");
function TokenExpirey(socket, io) {
  socket.on("usertoken", ({ token }) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err) {
        const expiryDate = fromUnixTime(decoded.exp);
        const now = new Date();
        const TwentyMinutesBeforeExpiry = subMinutes(expiryDate, 20);
        const checkisabout = isAfter(now, TwentyMinutesBeforeExpiry);
        if (checkisabout) {
          io.emit("tokenexpireabout", {
            userId: decoded.user.id,
            socketId: socket.id,
          });
        }
      }
    });
  });
}

const ServerAskToken = (io) => {
  io.emit("getusertoken", {});
};

module.exports = { TokenExpirey, ServerAskToken };
