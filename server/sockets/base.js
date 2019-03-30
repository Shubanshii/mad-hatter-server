const { addUser } = require("./utils/users");

module.exports = function(io) {
  io.on("connection", socket => {
    console.log("logging client");
    socket.on("join", ({ userInfo, room }, callback) => {
      console.log("joining and whatnot");
      console.log("basejs", userInfo);
      // figure out error handling later
      // const { error, user } = addUser({ id: socket.id, username, room });
      console.log("basejs", room);
      console.log("basejs socketid", socket.id);
      const { user } = addUser({ id: socket.id, userInfo, room });

      // if (error) {
      //   return callback(error);
      // }

      // socket.join(room);
      // socket.emit("joined", { room: user.room });
      // if this does not work, make it go to everyone for a bit to test
      // socket.broadcast.to(room).emit(
      //   "message",
      //   `${user} has joined!`
      //   // generateMessage("Admin", `${user.username} has joined!`)
      // );
    });
    socket.on("call", data => {
      console.log("logging data", data);
      io.emit("call", data);
    });
  });
};
