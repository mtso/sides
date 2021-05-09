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
  }

  async handleSubmit(e) {
    if (this.props.playerRegex &&
        !(new RegExp(this.props.playerRegex).test(this.state.player))) {
      e.preventDefault()
    }
    else if (!this.state.name) {
      e.preventDefault()
    }
    // else {
    //   e.preventDefault()
    //   const { player, name } = this.state
    //   const resp = await superagent.post('/' + this.props.gameId + '/join')
    //     .send({ player, name })
    //   console.log(resp)
    //   // if (resp.player) {
    //   window.location.href = `/${this.props.gameId}/play?player=${encodeURIComponent(player)}&name=${encodeURIComponent(name)}`
    //   // }
    // }
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
