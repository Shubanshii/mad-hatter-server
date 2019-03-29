import React, { Component } from "react";
import { connect } from "react-redux";
//import {beginHand} from './actions';

export class Notification extends Component {
  // componentDidMount() {
  //   let inHandCount = 0;
  //   for (var i = 0; i < this.props.playerInfo.length; i++) {
  //     if(this.props.playerInfo[i].inHand === true) {
  //       inHandCount++;
  //     }
  //   }
  //   if(inHandCount === 1) {
  //     this.props.dispatch(nextHand());
  //   }
  // }
  // componentDidUpdate() {
  //   if(this.props.handOver) {
  //     this.props.dispatch(beginHand());
  //   }
  //
  // }
  // componentDidUpdate() {
  //   if(this.props.inHand.length === 1) {
  //
  //   }
  // }

  render() {
    let playerInfo = this.props.playerInfo;
    let playerTurn;
    let smallBlind;
    let bigBlind;
    for (var i = 0; i < playerInfo.length; i++) {
      if (playerInfo[i].smallBlind === true) {
        smallBlind = playerInfo[i].name;
      } else if (playerInfo[i].bigBlind === true) {
        bigBlind = playerInfo[i].name;
      }

      if (playerInfo[i].playerTurn) {
        playerTurn = playerInfo[i].name;
      }
    }
    // const player = this.props.playerInfo.find(player => player.playerTurn === true);
    // console.log(this.props.playerInfo);
    // console.log('playerturn', player.name);
    return (
      <div className="App">
        <h3>Hand: {this.props.handIndex}</h3>
        <h3>Street: {this.props.street}</h3>
        {/*<h3>Turn: {player.name}</h3>*/}
        {/*<h3>Decision: </h3>*/}
        <h3>Turn: {playerTurn}</h3>
        <h3>Small Blind: {smallBlind}</h3>
        <h3>Big Blind: {bigBlind}</h3>
      </div>
    );
  }
}

Notification.defaultProps = {
  // title: 'Board'
};

const mapStateToProps = state => ({
  street: state.street,
  handIndex: state.handIndex,
  playerInfo: state.playerInfo,
  handOver: state.handOver,
  inHand: state.inHand
});

export default connect(mapStateToProps)(Notification);
