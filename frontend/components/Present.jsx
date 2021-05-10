import * as React from 'react'
import superagent from 'superagent'
import * as d3 from 'd3'
import Force from './Force'
import Force2 from './Force2'
import Force3 from './Force3'

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
      <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <div>
        <h1 style={{textAlign: 'center'}}>
          Which Side Are You On?
        </h1>
        </div>
        {/*<Graph />*/}
        {/*<div style={{flex: 2}}>
          <Force3 nodes={nodesA} width={'40%'}/>
          <Force3 nodes={nodesF} width={'20%'}/>
          <Force3 nodes={nodesB} width={'40%'}/>
        </div>*/}
        <div style={{flex: 2}}>
          <Force2 nodes={nodesA} width={'40%'}/>
          <Force2 nodes={nodesF} width={'20%'}/>
          <Force2 nodes={nodesB} width={'40%'}/>
        </div>
        {/*<div style={{flex: 2}}>
          <Force nodes={nodesA} width={'40%'}/>
          <Force nodes={nodesF} width={'20%'}/>
          <Force nodes={nodesB} width={'40%'}/>
        </div>*/}
      </div>

      <pre>
        {JSON.stringify(this.state, null, 2)}
      </pre>
      </>
    )
  }
}
