// import {CHECK, CALL, BET, RAISE, FOLD, UPDATE_MODE, INCREASE_STACK_SIZE, DECREASE_STACK_SIZE, INCREASE_POT_SIZE, DECREASE_POT_SIZE,
//   ROTATE_PLAYER, ROTATE_ROUND, END_HAND, ROTATE_DEALER} as actions from '../actions';
import * as actions from "../actions";
console.log("This is the last version");
const initialState = {
  playerCount: 2,
  toPlay: 1,
  amountRaised: 0,
  toCall: 1,
  completed: false,
  preFlopThreeBet: false,
  handIndex: 1,
  handOver: false,
  // mode: 'Small Blind',
  raised: false,
  checkedPlayers: 0,
  headsUp: true,
  inHand: [],
  streets: ["Preflop", "Flop", "Turn", "River"],
  street: "Preflop",
  playerInfo: [
    {
      id: 1,
      name: "",
      stackSize: 100,
      inHand: true,
      playerTurn: true,
      playerIndex: 0,
      smallBlind: true,
      bigBlind: false,
      contributedTowardsToPlay: 0,
      hasChecked: false
    },
    {
      id: 2,
      name: "",
      stackSize: 100,
      inHand: true,
      playerTurn: false,
      playerIndex: 1,
      smallBlind: false,
      bigBlind: true,
      contributedTowardsToPlay: 0,
      hasChecked: false
    }
  ],
  potSize: 0,
  // we'll figure out how to add more positions later
  positions: ["Dealer", "Big Blind"],
  position: "Dealer",
  dealer: "Player 1",
  maxBuyIn: 100,
  gameOver: false
  // playerTurn: 'Player 1',
};

// only for heads up dealer preflop right now
export const hatterReducer = (state = initialState, action) => {
  let modifiedState = Object.assign({}, state, {});
  let mustDeclareWinner = false;
  let winner;
  let refund = 0;
  let toAdd = 0;
  let currentContribution = 0;
  let amount = 0;
  let smallBlind = state.maxBuyIn / 200;
  let bigBlind = state.maxBuyIn / 100;
  let i = 0;
  let unraised = !state.raised;
  let pF = state.street === "Preflop";
  let allInRefund = 0;

  function addAllPlayersToHand() {
    modifiedState.inHand = [];
    modifiedState.playerInfo = state.playerInfo.map(player => {
      player.inHand = true;
      return player;
    });
    state.playerInfo.forEach(player => {
      if (player.inHand) {
        modifiedState.inHand.push({ id: player.id });
      }
    });
  }

  function handleBeginGame() {
    addAllPlayersToHand();
    console.log("inhandpushtest", modifiedState.inHand);
    addToPot(smallBlind + bigBlind);
    modifiedState.playerInfo = state.playerInfo.map(player => {
      if (player.smallBlind === true) {
        removeFromStack(player, smallBlind);
        setContributedTowards(player, smallBlind);
      } else if (player.bigBlind === true) {
        removeFromStack(player, bigBlind);
        setContributedTowards(player, bigBlind);
      }
      return player;
    });
  }

  function handleAddPlayer() {
    // this is super ghetto at the momnet
    modifiedState.playerInfo = state.playerInfo.map(player => {
      if (player.name === "") {
        player.name = action.username;
      }
      return player;
    });
  }

  function setUpNextHand() {
    mustDeclareWinner = false;
    modifiedState.raised = false;
    modifiedState.handIndex++;
    modifiedState.street = "Preflop";
    addAllPlayersToHand();
    switchBlinds();
    modifiedState.toPlay = 1;
    modifiedState.potSize = 0;
    modifiedState.completed = false;
    addToPot(smallBlind + bigBlind);
    modifiedState.playerInfo = modifiedState.playerInfo.map(player => {
      if (player.stackSize <= 0) {
        if (player.smallBlind) {
          refund += Math.abs(player.stackSize);
          player.stackSize = 0;
          mustDeclareWinner = true;
        }
      }
      return player;
    });
    modifiedState.potSize -= refund;
    if (mustDeclareWinner) {
      allInAlert();
      declareAndRewardWinner();
      mustDeclareWinner = false;
    } else {
      alert("Next hand.  Blinds Placed");
    }
  }

  function switchTurns() {
    modifiedState.playerInfo = modifiedState.playerInfo.map(player => {
      if (player.playerTurn) {
        player.playerTurn = false;
      } else {
        player.playerTurn = true;
      }
      return player;
    });
  }

  function incrementStreet() {
    //modifiedState.street = "Flop";
    console.log(state.streets.indexOf(state.street));
    let streetIndex = state.streets.indexOf(state.street);
    streetIndex++;
    modifiedState.street = state.streets[streetIndex];
    modifiedState.toPlay = 0;
    modifiedState.amountRaised = 0;
    modifiedState.raised = false;
    modifiedState.checkedPlayers = 0;
    modifiedState.playerInfo = state.playerInfo.map(player => {
      if (player.smallBlind) {
        player.playerTurn = false;
        player.hasChecked = false;
        resetContributed(player, 0);
      } else if (player.bigBlind) {
        player.playerTurn = true;
        player.hasChecked = false;
        resetContributed(player, 0);
      }
      return player;
    });
  }

  function switchBlinds() {
    modifiedState.playerInfo = modifiedState.playerInfo.map(player => {
      //switch big and small blind and subtract blinds from stacks and add player to hand
      if (player.smallBlind) {
        player.smallBlind = false;
        player.bigBlind = true;
        player.inHand = true;
        removeFromStack(player, bigBlind);
        resetContributed(player, bigBlind);
      } else if (player.bigBlind) {
        player.smallBlind = true;
        player.playerTurn = true;
        player.bigBlind = false;
        player.inHand = true;
        removeFromStack(player, smallBlind);
        resetContributed(player, smallBlind);
      }
      return player;
    });
  }

  function addToPot(amount) {
    modifiedState.potSize += amount;
  }

  function removeFromStack(player, amount) {
    player.stackSize -= amount;
  }

  function setContributedTowards(player, amount) {
    player.contributedTowardsToPlay += amount;
  }

  function resetContributed(player, amount) {
    player.contributedTowardsToPlay = amount;
  }

  function checkForZeroStack() {
    console.log("checkingrorzero");
    modifiedState.playerInfo.forEach(player => {
      if (player.stackSize === 0) {
        mustDeclareWinner = true;
      }
    });
    if (mustDeclareWinner) {
      allInAlert();
      declareAndRewardWinner();
    }
  }

  function allInAlert() {
    alert("Player All In");
  }

  function handleRemoveFoldedPlayer(players) {
    console.log(players);
    modifiedState.inHand = [];
    console.log(modifiedState.inHand);
    players.forEach(player => {
      if (player.inHand) {
        modifiedState.inHand.push({ id: player.id });
      }
    });
    console.log(modifiedState.inHand);
  }

  function removeFoldedPlayer() {
    modifiedState.playerInfo = state.playerInfo.map(player => {
      if (player.playerTurn) {
        player.playerTurn = false;
        player.inHand = false;
      }
      return player;
    });
    handleRemoveFoldedPlayer(modifiedState.playerInfo);
  }

  function handleFold() {
    if (!state.raised && state.street !== "Preflop") {
      alert("Can't fold unless facing a raise or a bet.");
    } else {
      // this will only work for heads up
      // try resetting emptying modifiedState.inHand and pushing players how did not fold
      removeFoldedPlayer();

      if (modifiedState.inHand.length === 1) {
        // heads up logic
        // small blind folds heads up preflop
        // set id of winner
        winner = modifiedState.inHand[0].id;
        //pass id of winner to reward winner
        rewardWinner(winner);
        // this is heads up so blinds will be switched instead of rotated

        setUpNextHand();
      }
    }
  }

  function setHasChecked() {
    modifiedState.playerInfo = state.playerInfo.map(player => {
      if (player.playerTurn) {
        player.hasChecked = true;
        modifiedState.checkedPlayers++;
      }
      return player;
    });
    switchTurns();
  }

  function handleCheck() {
    console.log(state.street);
    if (state.street === "Preflop") {
      for (i = 0; i < state.playerInfo.length; i++) {
        if (state.playerInfo[i].smallBlind && state.playerInfo[i].playerTurn) {
          alert("Can't check here");
        }
        // Big Blind checks preflop
        else if (
          state.playerInfo[i].bigBlind &&
          state.playerInfo[i].playerTurn
        ) {
          // modifiedState.street = "Flop";
          incrementStreet();
        }
      }
    } else if (state.street === "River") {
      setHasChecked();
      if (modifiedState.checkedPlayers === modifiedState.inHand.length) {
        console.log("rivering");
        declareAndRewardWinner();
        // declareWinner();
        //
        // for(i = 0; i<state.inHand.length; i++) {
        //
        //   if (state.inHand[i].id === winner) {
        //     rewardWinner(winner);
        //   }
        //   if(modifiedState.playerInfo[i].stackSize === 0) {
        //     alert('Game over.');
        //   }
        // }
      }
    } else {
      console.log("checking");
      // there has to be a better way to do this
      // modifiedState.playerInfo = state.playerInfo.map(player => {
      //   if(player.playerTurn) {
      //     player.hasChecked = true;
      //     modifiedState.checkedPlayers++;
      //   }
      //   return player;
      // });
      // switchTurns();
      setHasChecked();
      if (modifiedState.checkedPlayers === modifiedState.inHand.length) {
        incrementStreet();
      }

      // state.playerInfo.forEach(player => {
      //   if(!player.hasChecked) {
      //
      //   }
      // })
    }
  }

  function smallBlindCompletes() {
    addToPot(smallBlind);
    modifiedState.playerInfo = state.playerInfo.map(player => {
      if (player.playerTurn && player.smallBlind) {
        removeFromStack(player, smallBlind);
        setContributedTowards(player, smallBlind);
      }
      return player;
    });
    switchTurns();
    modifiedState.completed = true;
    checkForZeroStack();
  }

  function handlePreflopCall() {
    if (!state.raised) {
      if (!state.completed) {
        smallBlindCompletes();
      } else {
        alert("Can't call here.  Check or raise.");
      }
    } else {
      // big blind calls raise heads up

      console.log("statetoplay", state.toPlay);
      modifiedState.playerInfo = state.playerInfo.map(player => {
        if (player.playerTurn) {
          if (
            player.stackSize -
              (state.toPlay - player.contributedTowardsToPlay) >
            0
          ) {
            amount = state.toPlay - player.contributedTowardsToPlay;
            removeFromStack(player, amount);

            player.contributedTowardsToPlay = state.toPlay;

            console.log("contributedtowards", player.contributedTowardsToPlay);
          } else {
            allInRefund =
              state.toPlay - player.contributedTowardsToPlay - player.stackSize;
            console.log("loggingstate", state.toPlay);
            console.log(
              "logging playercontributed",
              player.contributedTowardsToPlay
            );
            console.log("loggin stack", player.stackSize);
            console.log("allinrefund", allInRefund);
            amount = player.stackSize;
            player.stackSize = 0;
          }
        }
        return player;
      });

      // braek here
      modifiedState.playerInfo = modifiedState.playerInfo.map(player => {
        if (!player.playerTurn) {
          player.stackSize += allInRefund;
        }
        return player;
      });
      // substitute this with callamount.
      console.log("amount", amount);
      console.log("allinrefund", allInRefund);
      console.log("moddypot", modifiedState.potSize);
      addToPot(amount - allInRefund);

      modifiedState.playerInfo.forEach(player => {
        if (player.stackSize === 0) {
          mustDeclareWinner = true;
        }
        console.log("calleachplayer", player);
      });
      if (mustDeclareWinner) {
        allInAlert();
        declareAndRewardWinner();
      } else {
        incrementStreet();
      }
    }
  }

  function handleFlopTurnCall() {
    if (!state.raised) {
      alert("Can't call here.  Check or raise.");
    } else {
      modifiedState.playerInfo = state.playerInfo.map(player => {
        if (player.playerTurn) {
          console.log(
            "logging value of subtraction",
            player.stackSize - (state.toPlay - player.contributedTowardsToPlay)
          );
          if (
            player.stackSize -
              (state.toPlay - player.contributedTowardsToPlay) >
            0
          ) {
            amount = state.toPlay - player.contributedTowardsToPlay;
            removeFromStack(player, amount);

            player.contributedTowardsToPlay = state.toPlay;

            console.log("contributedtowards", player.contributedTowardsToPlay);
          } else {
            allInRefund =
              state.toPlay - player.contributedTowardsToPlay - player.stackSize;
            console.log("loggingstate", state.toPlay);
            console.log(
              "logging playercontributed",
              player.contributedTowardsToPlay
            );
            console.log("loggin stack", player.stackSize);
            console.log("allinrefund", allInRefund);
            amount = player.stackSize;
            player.stackSize = 0;
          }
        }
        return player;
      });

      modifiedState.playerInfo = modifiedState.playerInfo.map(player => {
        if (!player.playerTurn) {
          player.stackSize += allInRefund;
        }
        return player;
      });
      // substitute this with callamount.
      console.log("amount", amount);
      console.log("allinrefund", allInRefund);
      console.log("moddypot", modifiedState.potSize);
      addToPot(amount - allInRefund);
      modifiedState.playerInfo.forEach(player => {
        if (player.stackSize === 0) {
          mustDeclareWinner = true;
        }
        console.log("calleachplayer", player);
      });
      if (mustDeclareWinner) {
        allInAlert();
        declareAndRewardWinner();
      } else {
        incrementStreet();
      }
    }
  }

  function handleRiverCall() {
    if (!state.raised) {
      alert("Can't call here.  Check or raise.");
    } else {
      modifiedState.playerInfo = state.playerInfo.map(player => {
        if (player.playerTurn) {
          if (
            player.stackSize -
              (state.toPlay - player.contributedTowardsToPlay) >
            0
          ) {
            amount = state.toPlay - player.contributedTowardsToPlay;
            removeFromStack(player, amount);

            player.contributedTowardsToPlay = state.toPlay;

            console.log("contributedtowards", player.contributedTowardsToPlay);
          } else {
            allInRefund =
              state.toPlay - player.contributedTowardsToPlay - player.stackSize;
            console.log("loggingstate", state.toPlay);
            console.log(
              "logging playercontributed",
              player.contributedTowardsToPlay
            );
            console.log("loggin stack", player.stackSize);
            console.log("allinrefund", allInRefund);
            amount = player.stackSize;
            player.stackSize = 0;
          }
        }
        return player;
      });

      modifiedState.playerInfo = modifiedState.playerInfo.map(player => {
        if (!player.playerTurn) {
          player.stackSize += allInRefund;
        }
        return player;
      });
      // substitute this with callamount.
      console.log("amount", amount);
      console.log("allinrefund", allInRefund);
      console.log("moddypot", modifiedState.potSize);
      addToPot(amount - allInRefund);
      let playersAllIn = [];
      modifiedState.playerInfo.forEach(player => {
        if (player.stackSize === 0) {
          playersAllIn.push(player);
        }

        console.log("calleachplayer", player);
      });
      if (playersAllIn.lenght === 1) {
        alert("Player All In");
      } else {
        alert("Both players All In");
      }

      declareAndRewardWinner();
    }
  }

  function handleCall() {
    // small blind calls heads up
    // let callAmount = 0;
    if (state.headsUp) {
      if (state.street === "Preflop") {
        handlePreflopCall();
      } else if (state.street === "Flop" || state.street === "Turn") {
        handleFlopTurnCall();
      } else {
        handleRiverCall();
      }
    }

    console.log(modifiedState);
  }

  function smallBlindOpenRaises() {
    if (
      state.playerInfo[i].stackSize - (action.amount - state.maxBuyIn / 200) >=
      0
    ) {
      modifiedState.amountRaised = amount - modifiedState.toPlay;
      console.log("amountraised", modifiedState.amountRaised);
      modifiedState.toPlay = amount;
      console.log("toplay", modifiedState.toPlay);
      addToPot(amount - state.maxBuyIn / 200);
      modifiedState.preFlopThreeBet = true;
      //Repeating yourself here.  add smallblind to func as an arg
      modifiedState.playerInfo = state.playerInfo.map(player => {
        if (player.smallBlind && player.playerTurn) {
          player.contributedTowardsToPlay = amount;
          //100.5
        }
        return player;
      });
    } else {
      alert("Not enough funds");
    }
  }

  function bigBlindOpenRaises() {
    if (
      state.playerInfo[i].stackSize - (action.amount - state.maxBuyIn / 100) >=
      0
    ) {
      modifiedState.amountRaised = amount - modifiedState.toPlay;
      console.log("amountraised", modifiedState.amountRaised);
      modifiedState.toPlay = amount;
      console.log("toplay", modifiedState.toPlay);
      addToPot(amount - state.maxBuyIn / 100);
      modifiedState.preFlopThreeBet = true;
      //repeating yourself same as above.  maybe a function for both
      // small and big in this scenario of adding to contributedTowardsToPlay
      // is in order
      modifiedState.playerInfo = state.playerInfo.map(player => {
        if (player.bigBlind && player.playerTurn) {
          player.contributedTowardsToPlay = amount;
        }
        return player;
      });
    } else {
      alert("Not enough funds");
    }
  }

  function preFlopThreeBetAdd() {
    state.playerInfo.forEach(player => {
      if (player.playerTurn) {
        currentContribution = player.contributedTowardsToPlay;
      }
    });
    console.log("currentcontribution", currentContribution);
    toAdd = modifiedState.toPlay - currentContribution;
    addToPot(toAdd);
  }

  function preFlopThreeBetSubtract() {
    modifiedState.playerInfo = state.playerInfo.map(player => {
      if (player.playerTurn) {
        removeFromStack(player, toAdd);
      }
      return player;
    });
  }

  function preFlopThreeBet() {
    // add money to pot
    modifiedState.amountRaised = amount - modifiedState.toPlay;
    modifiedState.toPlay = amount;

    console.log("toplay3bet", modifiedState.toPlay);
    preFlopThreeBetAdd();
    preFlopThreeBetSubtract();
    modifiedState.playerInfo = modifiedState.playerInfo.map(player => {
      if (player.playerTurn) {
        player.contributedTowardsToPlay = amount;
      }
      return player;
    });
    console.log(modifiedState);
    switchTurns();
  }

  function handlePreflopRaise() {
    if (unraised) {
      if (action.amount >= state.toPlay * 2) {
        console.log("raising");
        //raise from small blind heads up
        if (state.headsUp) {
          for (i = 0; i < state.playerInfo.length; i++) {
            if (pF) {
              if (
                state.playerInfo[i].playerTurn &&
                state.playerInfo[i].smallBlind
              ) {
                smallBlindOpenRaises();
              } else if (
                state.playerInfo[i].playerTurn &&
                state.playerInfo[i].bigBlind
              ) {
                bigBlindOpenRaises();
              }
            }
          }

          modifiedState.playerInfo = state.playerInfo.map(player => {
            if (player.playerTurn && player.smallBlind) {
              if (
                player.stackSize - (action.amount - state.maxBuyIn / 200) >=
                0
              ) {
                // modifying element outside of array, probably not good
                modifiedState.raised = true;
                removeFromStack(player, action.amount - state.maxBuyIn / 200);
              }
            } else if (player.playerTurn && player.bigBlind) {
              if (
                player.stackSize - (action.amount - state.maxBuyIn / 100) >=
                0
              ) {
                // player.playerTurn = false;
                modifiedState.raised = true;
                removeFromStack(player, action.amount - state.maxBuyIn / 100);
              }
            }
            //instead use switch turn function

            return player;
          });
          switchTurns();
        }
      } else {
        // if after placing blinds player has less than a blind left
        console.log("player has less than a blind left");
        modifiedState.toPlay = amount;
        state.playerInfo.forEach(player => {
          if (player.playerTurn) {
            currentContribution = player.contributedTowardsToPlay;
          }
        });
        toAdd = modifiedState.toPlay - currentContribution;
        addToPot(toAdd);
        modifiedState.playerInfo = state.playerInfo.map(player => {
          if (player.playerTurn) {
            removeFromStack(player, toAdd);
          }
          return player;
        });
        modifiedState.raised = true;
        switchTurns();
      }
    } else if (!unraised && state.preFlopThreeBet) {
      preFlopThreeBet();
    }
  }

  function handleFlopTurnRiverRaise() {
    if (unraised) {
      state.playerInfo.forEach(player => {
        if (player.playerTurn && player.stackSize >= amount) {
          modifiedState.amountRaised = amount;
          modifiedState.toPlay = amount;
          addToPot(amount);
          modifiedState.raised = true;
        }
      });
      modifiedState.playerInfo = state.playerInfo.map(player => {
        if (player.playerTurn && player.stackSize >= amount) {
          removeFromStack(player, amount);
          setContributedTowards(player, amount);
        }
        return player;
      });

      switchTurns();
    } else {
      state.playerInfo.forEach(player => {
        if (
          player.playerTurn &&
          player.stackSize >= amount - player.contributedTowardsToPlay
        ) {
          // modifiedState.toPlay = amount;
          // modifiedState.amountRaised = amount - player.contributedTowardsToPlay;
          modifiedState.amountRaised = amount - modifiedState.toPlay;
          modifiedState.toPlay = amount;
          console.log(
            "how much is it adding/subbing",
            amount - player.contributedTowardsToPlay
          );
          addToPot(amount - player.contributedTowardsToPlay);
        }
      });
      modifiedState.playerInfo = state.playerInfo.map(player => {
        if (
          player.playerTurn &&
          player.stackSize + player.contributedTowardsToPlay >= amount
        ) {
          console.log("removing from stack");
          removeFromStack(player, amount - player.contributedTowardsToPlay);
          //setContributedTowards(player, amount);
          player.contributedTowardsToPlay = amount;
        }
        return player;
      });

      switchTurns();
    }
    // modifiedState.playerInfo = state.playerInfo.map(player => {
    //   if(player.playerTurn && player.stack) {
    //
    //   }
    // })
  }

  function handleRaise() {
    // repeating yourself
    amount = parseFloat(action.amount);
    console.log("logging amount for decimal", amount);

    if (pF) {
      handlePreflopRaise();
    } else {
      handleFlopTurnRiverRaise();
    }
  }

  function declareWinner() {
    winner = prompt("Enter number of winner");
    winner = parseInt(winner, 10);
    let foundWinner = state.inHand.find(player => {
      return player.id === winner;
    });

    console.log(foundWinner);
    if (foundWinner === undefined) {
      alert("Player not in hand");
      declareWinner();
    }
  }
  function rewardWinner(winner) {
    console.log("rewardwinner", winner);
    modifiedState.playerInfo = state.playerInfo.map(player => {
      if (player.id === winner) {
        // add pot to winner's stack
        player.stackSize += modifiedState.potSize;
      }
      return player;
    });
    console.log("checking stack size", modifiedState.playerInfo);
  }

  function declareAndRewardWinner() {
    declareWinner();

    for (i = 0; i < state.inHand.length; i++) {
      if (state.inHand[i].id === winner) {
        rewardWinner(winner);
      }
      if (modifiedState.playerInfo[i].stackSize === 0) {
        modifiedState.gameOver = true;
      }
    }
    if (modifiedState.gameOver) {
      alert("Game over.");
    } else {
      setUpNextHand();
    }
  }
  switch (action.type) {
    case actions.BEGIN_GAME:
      handleBeginGame();

      break;
    case actions.ADD_PLAYER:
      handleAddPlayer();

      break;
    case actions.FOLD:
      handleFold();

      break;
    case actions.CHECK:
      // can't check when small blind or dealer preflop heads up.  can only complete
      if (state.raised) {
        alert("Can't check here");
      } else if (state.headsUp === true && state.raised === false) {
        handleCheck();
      }
      break;
    case actions.CALL:
      handleCall();

      break;
    case actions.RAISE:
      handleRaise();

      break;
    default:
      console.log("No action chosen");
  }
  return modifiedState;
};
