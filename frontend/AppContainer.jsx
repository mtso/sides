import React from 'react';
import WsTest from './WsTest'

import Manage from './components/Manage'
import Lobby from './components/Lobby'

export default class AppContainer extends React.Component {
  render() {
    if (this.props.page === 'manage') {
      return (<Manage gameId={this.props.gameId} adminCode={this.props.adminCode} />)
    }
    if (this.props.page === 'lobby') {
      return (
        <Lobby
          gameId={this.props.gameId} adminCode={this.props.adminCode}
          playerRegex={this.props.playerRegex} playerRegexMessage={this.props.playerRegexMessage}
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
