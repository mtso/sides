import React from 'react';
import WsTest from './WsTest'

import Manage from './components/Manage'
import Lobby from './components/Lobby'
import Play from './components/Play'

export default class AppContainer extends React.Component {
  render() {
    if (this.props.page === 'manage') {
      return (<Manage gameId={this.props.gameId} adminCode={this.props.adminCode} />)
    }
    if (this.props.page === 'lobby') {
      return (
        <Lobby
          gameId={this.props.gameId}
          playerRegex={this.props.playerRegex}
          playerRegexMessage={this.props.playerRegexMessage}
        />
      )
    } else if (this.props.page === 'play') {
      console.log(this.props)
      return (
        <Play
          gameId={this.props.gameId}
          player={this.props.player}
          name={this.props.name}
        />
      )
    }

    return (
      <div className="app_container container">
        <WsTest room={this.props.testInfo} />
        <div className="container">
        hi, <span style={{fontWeight: '600'}}>{this.props.testInfo}</span>
        <div style={{fontStyle: 'oblique'}}>hello world</div>
        <div>
          <button
            className="control"
          >hi</button>
        </div>
        </div>
      </div>
    )
  }
}
