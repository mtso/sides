import React, { Component } from 'react'
import superagent from 'superagent'

import Force from './Force'
import Game from '../Game'
import { pick, getKeyFromPlayer } from '../../util'

export default class Present extends Component {
  constructor(props) {
    super(props)
    this.state = {
      questions: [],
      responses: {},
      openQuestionId: null,
      online: [],
      players: [],
      playerInfo: {}
    }
    this.game = new Game(this.props.gameId)
  }

  componentDidMount() {
    this.game.join('present', 'present')
    this.game.on('update', (event) => {
      this.setState(pick(event, Object.keys(this.state)))
    })
  }

  generateNode() {
    return {
      r: 20,
      name: ''+(Math.floor(Math.random() * 30)),
    }
  }

  render() {
    const questionId = this.state.openQuestionId
    let nodesA = []
    let nodesB = []
    let nodesF = []

    if (questionId) {
      const resp = this.state.responses[questionId] || {}
      resp.a = resp.a || []
      resp.b = resp.b || []

      const visited = this.state.players.reduce((acc, p) => {
        acc[p] = p
        return acc
      }, {})

      nodesA = resp.a.map((p) => {
        delete visited[p]
        const info = this.state.playerInfo[getKeyFromPlayer(p)]
        return {
          player: info.player,
          name: info.name,
          r: 20,
        }
      })
      nodesB = resp.b.map((p) => {
        delete visited[p]
        const info = this.state.playerInfo[getKeyFromPlayer(p)]
        return {
          player: info.player,
          name: info.name,
          r: 20,
        }
      })
      nodesF = Object.values(visited).map((p) => {
        const info = this.state.playerInfo[getKeyFromPlayer(p)]
        return {
          player: info.player,
          name: info.name,
          r: 20,
        }
      })

    } else {
      nodesF = (this.state.online || []).map((p) => {
        return {
          player: p.player,
          name: p.name,
          r: 20,
        }
      })
    }

    return (
      <>
      <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <div>
        <h1 style={{textAlign: 'center'}}>
          Which Side Are You On?
        </h1>
        </div>
        <div style={{flex: 2}}>
          <Force nodes={nodesA} width={'40%'} side={1} />
          <Force nodes={nodesF} width={'20%'} side={0} />
          <Force nodes={nodesB} width={'40%'} side={-1}/>
        </div>
      </div>

      { this.props.debug && <pre>
        {JSON.stringify(this.state, null, 2)}
      </pre> }
      </>
    )
  }
}
