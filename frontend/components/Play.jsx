import React, { Component } from 'react'
import superagent from 'superagent'

import { pick } from '../../util'

export default class Play extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openQuestionId: null,
      responses: {},
      questions: [],
    }
    // this.manager = new Manager(this.props.gameId)
  }

  componentDidMount() {
    // this.manager.join(this.props.player, this.props.name)
    // this.manager.on('update', (gameState) => {
    //   this.setState(pick(gameState, Object.keys(this.state)))
    // })
  }

  render() {
    const question = this.state.openQuestionId && this.state.questions.filter((q) => q._id === this.state.openQuestionId)[0]
    return (
      <div class="container">
        <div>
          <h3>Question: {question && question.text}</h3>
        </div>
        <div>
          <button className="control">Left</button>
          <button className="control"><span style={{verticalAlign: "middle", fontSize: '1.05em'}}>🏝</span></button>
          <button className="control">Right</button>
        </div>
      </div>
    )
  }
}
 