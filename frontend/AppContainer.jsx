import React from 'react';
import WsTest from './WsTest'

export default class AppContainer extends React.Component {
  render() {
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
