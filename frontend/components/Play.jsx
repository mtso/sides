import React, { Component } from 'react'
import superagent from 'superagent'

import { pick } from '../../util'
import Game from '../Game'

export default class Play extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openQuestionId: null,
      questions: [],
    }
    // this.manager = new Manager(this.props.gameId)

    this.game = new Game(this.props.gameId)
  }

  componentDidMount() {
    // this.manager.join(this.props.player, this.props.name)
    // this.manager.on('update', (gameState) => {
    //   this.setState(pick(gameState, Object.keys(this.state)))
    // })

    this.game.join(this.props.player, this.props.name)
    this.game.on('update', ({ openQuestionId, questions }) => {
      this.setState({
        openQuestionId,
        questions,
      })
    })
    this.game.on('ping', (event) => console.log('Event:ping', event))
    this.game.on('response', (event) => console.log('Event:response', event))
  }

  async makeChoice(choice) {
    const resp = await superagent.post('/api/games/' + this.props.gameId + '/choose')
      .send({
        questionId: this.state.openQuestionId,
        player: this.props.player,
        choice: choice,
      })
    this.setState(pick(resp, Object.keys(this.state)))
  }

  render() {
    const question = this.state.openQuestionId && this.state.questions.filter((q) => q._id === this.state.openQuestionId)[0]
    const buttonMiddleTitle = this.props.buttonMiddleTitle || '🏝'
    return (
      <div class="container">
        <div>
          <h3>Question: {question && question.text}</h3>
        </div>
        <div>
          <button className="control"
            onClick={(e) => this.makeChoice('a')}
          >{this.props.buttonLeftTitle || 'Left'}</button>
          <button className="control"
            onClick={(e) => this.makeChoice(null)}
          >
          {
            /\p{Extended_Pictographic}/u.test(buttonMiddleTitle)
              ? <span style={{verticalAlign: "middle", fontSize: '1.05em'}}>{buttonMiddleTitle}</span>
              : {buttonMiddleTitle}
          }
          </button>
          <button className="control"
            onClick={(e) => this.makeChoice('b')}
          >{this.props.buttonRightTitle || 'Right'}</button>
        </div>
      </div>
    )
  }
}
 