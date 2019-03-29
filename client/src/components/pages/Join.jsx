import React, { Component } from "react";
import { Route, Link, NavLink, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { setRoom } from "../../actions";

export class Join extends Component {
  componentDidMount() {
    console.log(this.props.state);
  }

  setRoom(e) {
    e.preventDefault();
    const value = this.input.value;
    console.log("room", value);
    this.props.dispatch(setRoom(value));
  }

  render() {
    return (
      <div className="App">
        {/* JOIN
        <div className="Game-Link">
          <Link to="/Game">Game</Link>
        </div> */}
        <form onSubmit={e => this.setRoom(e)}>
          <input
            type="text"
            name="roomName"
            id="roomName"
            className="text"
            autoComplete="off"
            /*aria-labelledby="feedback"*/
            ref={input => (this.input = input)}
            required
          />
          <button
            type="submit"
            name="submit"
            id="roomButton"
            className="button"
          >
            Create/Join Room
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  state: state
});

export default connect(mapStateToProps)(Join);
