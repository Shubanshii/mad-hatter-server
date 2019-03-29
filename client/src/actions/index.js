export const BEGIN_GAME = "BEGIN_GAME";
export const beginGame = () => ({
  type: BEGIN_GAME
});

export const ADD_USER = "ADD_USER";
export const addUser = (user, id) => ({
  type: ADD_USER,
  user,
  id
});

export const ADD_PLAYER_1 = "ADD_PLAYER_1";
export const addPlayer1 = username => ({
  type: ADD_PLAYER_1,
  username
});

export const BEGIN_HAND = "BEGIN_HAND";
export const beginHand = playerInfo => ({
  type: BEGIN_HAND,
  playerInfo
});

export const SET_WINNER = "SET_WINNER";
export const setWinner = () => ({
  type: SET_WINNER
});

export const NEXT_HAND = "NEXT_HAND";
export const nextHand = () => ({
  type: NEXT_HAND
});

export const SET_BLINDS = "SET_BLINDS";
export const setBlinds = () => ({
  type: SET_BLINDS
});

export const CHECK = "CHECK";
export const check = playerIndex => ({
  type: CHECK,
  playerIndex
});

export const CALL = "CALL";
export const call = (amount, playerIndex) => ({
  type: CALL,
  amount,
  playerIndex
});

export const FOLD = "FOLD";
export const fold = playerIndex => ({
  type: FOLD,
  playerIndex
});

export const RAISE = "RAISE";
export const raise = amount => ({
  type: RAISE,
  amount
});

export const DECREASE_STACK_SIZE = "DECREASE_STACK_SIZE";
export const decreaseStackSize = (amount, playerIndex) => ({
  type: DECREASE_STACK_SIZE,
  amount,
  playerIndex
});

//
// export const BET = 'BET';
// export const bet = amount => ({
//     type: BET,
//     amount
// });
//

//

//
// export const INCREASE_STACK_SIZE = 'INCREASE_STACK_SIZE';
// export const increaseStackSize = amount => ({
//   type: INCREASE_STACK_SIZE,
//   amount
// });
//
// export const INCREASE_POT_SIZE = 'INCREASE_POT_SIZE';
// export const increasePotSize = amount => ({
//   type: INCREASE_POT_SIZE,
//   amount
// });
//
// export const DECREASE_POT_SIZE = 'DECREASE_STACK_SIZE';
// export const decreasePotSize = amount => ({
//   type: DECREASE_POT_SIZE,
//   amount
// });
//
// export const UPDATE_MODE = 'UPDATE_MODE';
// export const updateMode = () => ({
//   type: UPDATE_MODE,
// });
//
// export const ROTATE_PLAYER = 'ROTATE_PLAYER';
// export const rotatePlayer = currentPlayer => ({
//   type: ROTATE_PLAYER,
//   currentPlayer
// });
//
// export const ROTATE_ROUND = 'ROTATE_ROUND';
// export const rotateRound = () => ({
//   type: ROTATE_ROUND
// })
//
// export const END_HAND = 'END_HAND';
// export const endHand = () => ({
//   type: END_HAND
// });
//
// export const ROTATE_DEALER = 'ROTATE_DEALER';
// export const rotateDealer = currentDealer => ({
//   type: ROTATE_DEALER
// });
