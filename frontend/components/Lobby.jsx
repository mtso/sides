import React, { Component } from 'react'
import superagent from 'superagent'

export default class Lobby extends Component {
  constructor(props) {
    super(props)
    this.state = {
      player: '',
      name: '',
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.savePlayerData = this.savePlayerData.bind(this)
    this.getPlayerData = this.getPlayerData.bind(this)
  }

  componentDidMount() {
    const data = this.getPlayerData()
    if (data && data.createdAt >= (Date.now() - 30 * 60 * 1000)) {
      this.setState({
        player: data.player,
        name: data.name,
      })
    }
  }

  async handleSubmit(e) {
    if (this.props.playerRegex &&
        !(new RegExp(this.props.playerRegex).test(this.state.player))) {
      e.preventDefault()
    }
    else if (!this.state.name) {
      e.preventDefault()
    }
    this.savePlayerData(this.state.player, this.state.name)
  }

  savePlayerData(player, name) {
    const key = `sides:${this.props.gameId}:player`
    localStorage.setItem(key, JSON.stringify({ player, name, createdAt: Date.now() }))
  }

  getPlayerData() {
    const key = `sides:${this.props.gameId}:player`
    const data = localStorage.getItem(key)
    if (!data) return null;
    try {
      return JSON.parse(data)
    } catch(err) {
      console.error('failed to parse local data', err, data)
      return null
    }
  }

  render() {
    return (
      <div className="container">
        <h3>{this.props.gameId}</h3>
        <form
          method="POST" action={`/${this.props.gameId}/join`}
          onSubmit={this.handleSubmit}
        >
          <div>
            <label htmlFor="player">Player ID</label> <input
              id="player"
              name="player"
              type="text"
              className="control"
              value={this.state.player}
              placeholder="Player ID"
              onChange={(e) => this.setState({ player: e.target.value })}
              style={{marginBottom: '0.2em'}}
            />
            {this.props.playerRegexMessage && (
              <div style={{
                fontSize: '0.7em', fontWeight:600, color:'darkgray',
                marginBottom: '0.8em',
              }}
              >{this.props.playerRegexMessage}</div>
            )}
          </div>
          <div>
            <label htmlFor="name">Name</label> <input
              id="name"
              name="name"
              type="text"
              className="control"
              value={this.state.name}
              placeholder="Player Name"
              onChange={(e) => this.setState({ name: e.target.value })}
            />
          </div>
          <div>
            <input
              type="submit"
              className="control"
              value="Join Game"
            />
          </div>
        </form>
      </div>
    )
  }
}
