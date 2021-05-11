import React, { Component } from 'react'
import superagent from 'superagent'

import Force from './Force'
import GameEvents from '../GameEvents'
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
      playerInfo: {},
      backgroundColorLeft: this.props.backgroundColorLeft,
      backgroundColorMiddle: this.props.backgroundColorMiddle,
      backgroundColorRight: this.props.backgroundColorRight,
    }
    this.game = new GameEvents(this.props.gameId)
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

    const question = this.state.openQuestionId && this.state.questions.filter((q) => q._id === this.state.openQuestionId)[0]

    return (
      <>
      <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <div>
        <h3 style={{textAlign: 'center', marginBottom: 0}}>
          Which Side Are You On...
        </h3>
        <h1 style={{
          textAlign: 'center',
          color: question ? 'black' : 'lightgray',
          marginTop: 0,
        }}
        >
          { question && question.text || '...' }
        </h1>
        </div>
        <div style={{flex: 2}}>
          <Force nodes={nodesA} width={'40%'} side={1}
            backgroundColor={this.state.backgroundColorLeft}
          />
          <Force nodes={nodesF} width={'20%'} side={0}
            backgroundColor={this.state.backgroundColorMiddle}
          />
          <Force nodes={nodesB} width={'40%'} side={-1}
            backgroundColor={this.state.backgroundColorRight}
          />
        </div>
      </div>

      { this.props.debug && <pre>
        {JSON.stringify(this.state, null, 2)}
      </pre> }
      </>
    )
  }
}
