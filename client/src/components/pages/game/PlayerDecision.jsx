import React, { Component } from "react";
import { connect } from "react-redux";
import { call, fold, raise, check } from "../../../actions";

export class PlayerDecision extends Component {
  fold() {
    this.props.dispatch(fold());
  }

  call() {
    this.props.dispatch(call());
    this.props.socket.emit("call", "Hello");
  }

  raise(e) {
    e.preventDefault();
    const value = this.input.value;
    this.props.dispatch(raise(value));
  }

  check() {
    this.props.dispatch(check());
  }

  render() {
    // const playerCount = this.props.playerCount;
    // const player = this.props.playerInfo.find(player => player.playerTurn === true);
    console.log("raised", this.props.raised);
    console.log("street", this.props.street);
    let raised = this.props.raised;
    let street = this.props.street;
    let contributed = 0;
    let stackSize = 0;
    this.props.playerInfo.forEach(player => {
      if (player.playerTurn) {
        contributed = player.contributedTowardsToPlay;
        stackSize = player.stackSize;
      }
    });
    console.log("cont", contributed);
    console.log("stacksize", stackSize);
    let minRaise = 0;
    let maxRaise = contributed + stackSize;
    if (street === "Preflop") {
      if (!raised) {
        minRaise = this.props.toPlay * 2;
        console.log("contributed", contributed);
        console.log("stacksize", stackSize);
        if (stackSize + contributed < minRaise) {
          minRaise = stackSize + contributed;
          maxRaise = stackSize + contributed;
        }
      } else {
        // minRaise = this.props.toPlay * 2 - 1;

        minRaise = this.props.toPlay + this.props.amountRaised;
        if (stackSize + contributed < minRaise) {
          console.log("stack of player 2", stackSize);
          console.log("less than minraise");
          minRaise = stackSize + contributed;
          maxRaise = stackSize + contributed;
        }
      }
    } else {
      if (!raised) {
        minRaise = this.props.maxBuyIn / 100;
        maxRaise = stackSize;
        if (stackSize < minRaise) {
          minRaise = stackSize;
          maxRaise = stackSize;
        }
      } else {
        minRaise = this.props.toPlay + this.props.amountRaised;
        maxRaise = contributed + stackSize;
        if (stackSize + contributed < minRaise) {
          minRaise = stackSize + contributed;
          maxRaise = stackSize + contributed;
        }
      }
    }

    return (
      <div className="App">
        {/*<h2>Your Stack Size:</h2>
        <h6>100</h6>*/}
        <h2>Pot Size: {this.props.potSize}</h2>
        <form>
          {/*<h2>Player {this.props.playerTurn} act</h2>*/}
          <div className="form-section">
            <button onClick={() => this.check()} type="button" name="check">
              Check
            </button>
            <button onClick={() => this.call()} type="button" name="call">
              Call
            </button>
            <button onClick={() => this.fold()} type="button" name="fold">
              Fold
            </button>
            {/*<div>
              <label>
                Raise:
                <input className="amount" type="number" name="amount" placeholder="12" />
              </label>
              <input onClick={(e) => this.raise(e)} type="submit"/>
            <label htmlFor="raise">Raise</label>
            <input onClick={() => this.raise()} type="number" name="amount" placeholder="12" />
          </div>*/}
          </div>
        </form>
        <form onSubmit={e => this.raise(e)}>
          <input
            type="number"
            step="0.01"
            name="raiseAmount"
            id="raiseAmount"
            className="text"
            min={minRaise}
            max={maxRaise}
            /*max="100"*/
            placeholder={minRaise}
            autoComplete="off"
            /*aria-labelledby="feedback"*/
            ref={input => (this.input = input)}
            required
          />
          <button
            type="submit"
            name="submit"
            id="raiseButton"
            className="button"
          >
            Bet/Raise to
          </button>
        </form>
      </div>
    );
  }
}

PlayerDecision.defaultProps = {
  // title: 'Board'
};

const mapStateToProps = state => ({
  maxBuyIn: state.maxBuyIn,
  playerInfo: state.playerInfo,
  potSize: state.potSize,
  handOver: state.handOver,
  headsUp: state.headsUp,
  inHand: state.inHand,
  toPlay: state.toPlay,
  street: state.street,
  raised: state.raised,
  amountRaised: state.amountRaised
});

export default connect(mapStateToProps)(PlayerDecision);
