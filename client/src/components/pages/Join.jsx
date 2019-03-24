import React, { Component } from "react";

export default class Join extends Component {
  render() {
    return (
      <div className="App">
        <div className="centered-form">
          <div className="centered-form__box">
            <h1>Join</h1>
            <form action="/game">
              <label htmlFor="">Display name</label>
              <input
                type="text"
                name="username"
                placeholder="Diplay name"
                required
              />
              <label htmlFor="">Room</label>
              <input type="text" name="room" placeholder="Room" required />
              <button>Join</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
