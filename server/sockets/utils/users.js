const users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate the data
  if (!username || !room) {
    return {
      error: "Username and room are required!"
    };
  }

  // Check for existing user
  const existingUser = users.find(user => {
    return user.room === room && user.username === username;
  });

  // Validate username
  if (existingUser) {
    return {
      error: "Username is in use!"
    };
  }

  // Store user
  const user = { id, username, room };
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
