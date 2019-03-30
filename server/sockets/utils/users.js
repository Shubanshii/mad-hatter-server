const users = [];

const addUser = ({ id, userInfo, room }) => {
  // username = username.trim().toLowerCase();
  userInfo.username = userInfo.username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  console.log("adduser", userInfo);

  // Validate the data
  // handle error handling later
  // if (!userInfo || !room) {
  //   return {
  //     error: "Username and room are required!"
  //   };
  // }

  // Check for existing user
  // handle error handling later
  // const existingUser = users.find(user => {
  //   return user.room === room && user.username === username;
  // });

  // Validate username
  // handle error handling later
  // if (existingUser) {
  //   return {
  //     error: "Username is in use!"
  //   };
  // }

  // Store user
  const user = { id, userInfo, room };
  users.push(user);
  return { user };
};

const getUser = id => {
  const user = users.find(user => user.id === id);
  return user;
};

module.exports = {
  addUser,
  getUser
};
