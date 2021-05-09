import EventEmitter from 'eventemitter2'
const CONNECTING = 0
const OPEN = 1
const CLOSING = 2
const CLOSED = 3

export default class Game extends EventEmitter {
  constructor(gameId, WebSocketClient) {
    super()
    this.WebSocketClient = WebSocketClient || window.WebSocket

    this.join = this.join.bind(this)
    this.connectWs = this.connectWs.bind(this)
    this.getWs = this.getWs.bind(this)
    this.closeWs = this.closeWs.bind(this)

    this.ws = null
    this.monitorTimer = null
    this.gameId = gameId
    this.isJoined = false
  }

  closeWs() {
    this.ws.onerror = this.ws.onopen = this.ws.onclose = null
    this.ws.close()
  }

  async connectWs() {
    if (this.ws) {
      this.ws.onerror = this.ws.onopen = this.ws.onclose = null
      this.ws.close()
    }

    const start = Date.now()
    this.ws = new this.WebSocketClient(`ws://${location.host}`);
    this.ws.onerror = (e) => {
      console.error('WebSocket error', e)
      this.emit('error', e)
      this.closeWs()
    }
    this.ws.onopen = () => {
      const connectionTime = Date.now() - start
      this.emit('open', { connectionTime })
    }
    this.ws.onmessage = (message) => {
      try {
        const event = JSON.parse(message.data)
        this.emit(event.event, event)
      } catch(err) {
        console.error('Failed to parse message into JSON', err, message)
      }
    }

    return new Promise((resolve) => {
      this.once('open', (data) => {
        console.log('Opened', data)
        resolve(this.ws)
      })
      this.once('error', (err) => reject(err))
    })
  }

  async getWs() {
    if (!this.ws) {
      return this.connectWs()
    } else {
      return Promise.resolve(this.ws)
    }
  }

  async join(player, name) {
    this.isJoined = true
    const ws = await this.getWs()
    ws.send(JSON.stringify({
      event: 'join',
      player,
      name,
      gameId: this.gameId,
    }))
    this.monitorTimer = setInterval(async () => {
      if (this.isJoined) {
        if (!this.ws) {
          try {
            await this.getWs()
          } catch(err) {

          }
        }
      } else {
        clearInterval(this.monitorTimer)
        this.monitorTimer = null
      }
    }, 5000)
  }
}
