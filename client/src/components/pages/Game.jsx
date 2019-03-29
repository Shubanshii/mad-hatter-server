import React, { Component } from "react";
import Qs from "qs";
import PlayerCircle from "./game/PlayerCircle";
import PlayerDecision from "./game/PlayerDecision";
import Notification from "./game/Notification";
import socketIOClient from "socket.io-client";
import { connect } from "react-redux";
import { beginGame, addPlayer1 } from "../../actions";

export class Game extends Component {
  state = {
    socket: null
  };
  componentDidMount() {
    const socket = socketIOClient("http://127.0.0.1:5000");

    this.setState({
      socket
    });

    console.log("users", this.props.users);
    console.log("room", this.props.room);
    socket.on("join", () => {});
  }

  render() {
    return (
      <div className="App">
        <main role="main">
          <header>
            <h1>Table Name</h1>
            <h2>Test: {this.props.playerCount}</h2>
          </header>
          <Notification />
          {/*<PlayerCircle />
          <PlayerDecision socket={this.state.socket} /> */}
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  // state: state,
  users: state.users,
  room: state.room,
  playerCount: state.playerCount,
  playerInfo: state.playerInfo
});

export default connect(mapStateToProps)(Game);
