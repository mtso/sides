import React, { Component, createRef } from "react"
import * as d3 from "d3"

import { toMap } from '../../util'

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newGameId: this.props.newGameId,
    }
  }

  render() {
    return (
      <div class="container">
        <h2>Which Side Are You On?</h2>

        <form action='/new_game' method='POST'>
          <input
            onChange={(e) => this.setState({ newGameId: e.target.value })}
            type='text'
            className='control'
            value={this.state.newGameId}
            name='gameId'
          />
          <input
            type='submit'
            className='control'
            value='Create Game'
          />
          {this.props.state && <div style={{fontSize: '0.7em', fontWeight: 600, color: 'coral'}}>Game ID already exists. Please choose another one.</div>}
        </form>

        <div>—</div>
        <h3>About</h3>
        <p style={{maxWidth: '500px'}}>
          <em>Which Side Are You On?</em> helps you to run a group game that
          asks questions and has participants joining one side or the other.
        </p>
      </div>
    )
  }
}
