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

    const userInfo = this.props.users[0];
    const room = this.props.room;
    // figure out error handling later
    socket.emit("join", { userInfo, room });
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
