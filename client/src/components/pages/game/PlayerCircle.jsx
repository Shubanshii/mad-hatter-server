import React, { Component } from "react";
import Notification from "./Notification";
import { connect } from "react-redux";
//import {nextHand, setWinner, setBlinds} from './actions';

export class PlayerCircle extends Component {
  // componentDidUpdate() {
  //   console.log('component updation');
  //   let playerInfo = this.props.playerInfo;
  //   if(this.props.inHand.length === 1) {
  //     this.props.dispatch(setWinner());
  //     //heads up logic
  //     if(this.props.headsUp) {
  //
  //       this.props.dispatch(nextHand());
  //       this.props.dispatch(setBlinds());
  //
  //     }
  //   }
  // }
  render() {
    // console.log(this.props.stackSizes);
    return (
      <div className="App">
        <ul className="circle-container">
          {/*<Notification />*/}
          <li>
            <h3>{this.props.playerInfo[0].name}</h3>
            <h5>{this.props.playerInfo[0].stackSize}</h5>
          </li>
          {/*<li>
            <h3>{this.props.playerInfo[1].name}</h3>
            <h5>{this.props.playerInfo[1].stackSize}</h5>
          </li>*/}
        </ul>
      </div>
    );
  }
}

PlayerCircle.defaultProps = {
  // title: 'Board'
};

const mapStateToProps = state => ({
  playerInfo: state.playerInfo,
  inHand: state.inHand,
  headsUp: state.headsUp
});

export default connect(mapStateToProps)(PlayerCircle);
