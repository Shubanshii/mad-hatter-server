const { addUser } = require("./utils/users");

module.exports = function(io) {
  io.on("connection", socket => {
    console.log("logging client");
    socket.on("join", ({ username, room }, callback) => {
      console.log("joining and whatnot");
      console.log("basejs", username, room);
      // const { error, user } = addUser({ id: socket.id, username, room });
      console.log("basejs", user);
      // if (error) {
      //   return callback(error);
      // }

      socket.join(room);
      // socket.emit("joined", { room: user.room });
      // if this does not work, make it go to everyone for a bit to test
      socket.broadcast.to(room).emit(
        "message",
        `${username} has joined!`
        // generateMessage("Admin", `${user.username} has joined!`)
      );
    });
    socket.on("call", data => {
      console.log("logging data", data);
      io.emit("call", data);
    });
  });
};
