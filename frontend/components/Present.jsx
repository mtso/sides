import * as React from 'react'
import superagent from 'superagent'
import * as d3 from 'd3'
import Force from './Force'

import Game from '../Game'
import { pick } from '../../util'

export default class Present extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      questions: [],
      responses: {},
      openQuestionId: null,
      online: [],
      players: [],
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
        acc[p.player] = p
        return acc
      }, {})
      console.log(visited)

      nodesA = resp.a.map((p) => {
        delete visited[p.player]
        return {
          name: p.name,
          r: 20,
        }
      })
      nodesB = resp.b.map((p) => {
        delete visited[p.player]
        return {
          name: p.name,
          r: 20,
        }
      })
      nodesF = Object.values(visited).map((p) => {
        return {
          name: p.name,
          r: 20,
        }
      })

    } else {
      nodesF = (this.state.online || []).map((p) => {
        return {
          name: p.name,
          r: 20,
        }
      })
    }

    return (
      <>
      <h1>
        Which Side Are You On?
      </h1>
      {/*<Graph />*/}
      <div>
      <Force nodes={nodesA} width={'40%'}/>
      <Force nodes={nodesF} width={'19%'}/>
      <Force nodes={nodesB} width={'40%'}/>
      </div>
      <pre>
        {JSON.stringify(this.state.gameState, null, 2)}
      </pre>
      </>
    )
  }
}
