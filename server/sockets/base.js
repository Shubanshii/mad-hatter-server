const { addUser } = require("./utils/users");

module.exports = function(io) {
  io.on("connection", socket => {
    console.log("logging client");
    socket.on("join", ({ username, room }, callback) => {
      console.log("joining and whatnot");
      const { error, user } = addUser({ id: socket.id, username, room });
      console.log("basejs", user);
      if (error) {
        return callback(error);
      }

      socket.join(user.room);
      socket.emit("joined", { room: user.room });
    });
    socket.on("call", data => {
      console.log("logging data", data);
      io.emit("call", data);
    });
  });
};
