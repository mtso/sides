import React from 'react';

export default class WsTest extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      connectionTime: null,
      ping: null,
      messageId: null,
      messageTs: null,
    }
    this.ws = null
    this.connectWs = this.connectWs.bind(this)
    this.handleMessage = this.handleMessage.bind(this)
    this.monitor = this.monitor.bind(this)
  }

  componentDidMount() {
    this.monitor()
    setInterval(this.monitor, 5000)
  }

  monitor() {
    let conn;
    if (!this.ws) {
      conn = this.connectWs()
    } else {
      conn = Promise.resolve(this.ws)
    }
    const messageId = Date.now()
    this.setState({
      messageId,
      messageTs: Date.now(),
    }, () => {
      conn.then((ws) => {
        ws.send(JSON.stringify({
          messageId,
          event: 'send',
          room: this.props.room,
          message: 'hello from client',
        }))
      }).catch((err) => console.error(err))
    })
  }

  handleMessage(message) {
    console.log('got message', message)
    try {
      const msg = JSON.parse(message.data)
      if (msg.messageId === this.state.messageId && msg.event === 'response') {
        const ping = Date.now() - this.state.messageTs
        console.log('received response ping', ping, msg.message, msg.room)
        this.setState({ ping })
      }
    } catch (err) {
      console.error('failed to parse message', message)
    }
  }

  connectWs() {
    const self = this
    return new Promise((resolve, reject) => {
      if (this.ws) {
        this.ws.onerror = this.ws.onopen = this.ws.onclose = null;
        this.ws.close();
      }

      const start = Date.now()
      console.log('connecting ws')
      this.ws = new WebSocket(`ws://${location.host}`);
      this.ws.onerror = function (e) {
        console.error('WebSocket error', e);
      };
      this.ws.onopen = function () {
        const connectionTime = Date.now() - start
        self.setState({ connectionTime })
        console.log('WebSocket connection established');
        resolve(self.ws)
      };
      this.ws.onclose = function () {
        console.log('WebSocket connection closed');
        self.ws = null;
      };
      this.ws.onmessage = this.handleMessage
    })
  }

  render() {
    return (
      <div class="container">
        <div>Connection Time: {this.state.connectionTime}</div>
        <div>Ping: {this.state.ping}</div>
        <div>Message ID: {this.state.messageId}, MessageTs: {this.state.messageTs}</div>
      </div>
    )
  }
}
