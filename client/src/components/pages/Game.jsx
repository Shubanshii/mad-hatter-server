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
    //this.props.dispatch(beginGame());
    socket.on("call", data => {
      console.log("logging data", data);
    });

    const { username, room } = Qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true
    });
    console.log("username", username);
    console.log("room", room);
    socket.on("message", message => {
      console.log(message);
    });
    socket.emit("join", { username, room }, error => {
      if (error) {
        alert(error);
        // this.props.location.href = "/join";
      }
    });

    socket.on("joined", data => {
      console.log(data);
    });
    this.props.dispatch(addPlayer1(username));
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
  users: state.users,
  playerCount: state.playerCount,
  playerInfo: state.playerInfo
});

export default connect(mapStateToProps)(Game);
