import React, { Component } from 'react'
import superagent from 'superagent'

import Force from './Force'
import GameEvents from '../GameEvents'
import { pick, toMap, getKeyFromPlayer } from '../../util'

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
      radius: 40, // default
    }
    this.game = new GameEvents(this.props.gameId)
  }

  componentDidMount() {
    this.game.join('present', 'present')
    this.game.on('update', (event) => {
      this.setState(pick(event, Object.keys(this.state)))
    })
  }

  render() {
    const R = this.state.radius
    const questionId = this.state.openQuestionId
    let nodesA = []
    let nodesB = []
    let nodesF = []

    if (questionId) {
      const onlineMap = toMap(this.state.online || [], (p) => p.player)
      const visited = toMap(this.state.online || [], (p) => p.player)
      const resp = this.state.responses[questionId] || {}
      resp.a = (resp.a || []).filter((p) => !!this.state.playerInfo[getKeyFromPlayer(p)])
      resp.b = (resp.b || []).filter((p) => !!this.state.playerInfo[getKeyFromPlayer(p)])

      nodesA = resp.a.map((p) => {
        delete visited[p]
        let info = this.state.playerInfo[getKeyFromPlayer(p)]
        info = info || this.onlineMap[p.player]
        return {
          player: info.player,
          name: info.name,
          online: !!onlineMap[info.player],
          r: R,
        }
      })
      nodesB = resp.b.map((p) => {
        delete visited[p]
        let info = this.state.playerInfo[getKeyFromPlayer(p)]
        info = info || this.onlineMap[p.player]
        return {
          player: info.player,
          name: info.name,
          online: !!onlineMap[info.player],
          r: R,
        }
      })
      nodesF = Object.values(visited).map((p) => {
        let info = this.state.playerInfo[getKeyFromPlayer(p.player)]
        info = info || this.onlineMap[p.player]
        return {
          player: info.player,
          name: info.name,
          online: !!onlineMap[info.player],
          r: R,
        }
      })

    } else {
      const onlineMap = toMap(
        this.state.online || [],
        (p) => p.player,
        (v) => ({...v, online: true, r: R})
      )
      nodesF = Object.values(onlineMap)
    }

    const question = this.state.openQuestionId && this.state.questions.filter((q) => q._id === this.state.openQuestionId)[0]

    return (
      <>
      <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <div>
        <h4 style={{textAlign: 'center', marginBottom: 0}}>
          Which Side Are You On...
        </h4>
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
