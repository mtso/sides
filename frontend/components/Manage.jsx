import React, { Component } from 'react'
import superagent from 'superagent'

import GameEvents from '../GameEvents'
import { pick, toMap, getKeyFromPlayer } from '../../util'
import { styleText } from '../colors'

export default class Manage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      questions: [],
      playerRegex: null,
      newPlayerRegex: null,
      playerRegexMessage: null,
      newPlayerRegexMessage: null,
      openQuestionId: null,
      players: [],
      playerInfo: {},
      responses: {},
      newQuestionValue: '',
      online: [],

      buttonLeftTitle: null,
      buttonMiddleTitle: null,
      buttonRightTitle: null,
      newButtonLeftTitle: null,
      newButtonMiddleTitle: null,
      newButtonRightTitle: null,
      backgroundColorLeft: null,
      backgroundColorMiddle: null,
      backgroundColorRight: null,
      newBackgroundColorLeft: null,
      newBackgroundColorMiddle: null,
      newBackgroundColorRight: null,

      radius: null,
      newRadius: null,

      editQuestionId: null,
      editQuestionValue: '',
    }

    this.game = new GameEvents(this.props.gameId)
    this.setOpenQuestion = this.setOpenQuestion.bind(this)
    this.hasChangesToSave = this.hasChangesToSave.bind(this)
    this.saveOptions = this.saveOptions.bind(this)
    this.updateQuestion = this.updateQuestion.bind(this)
  }

  async componentDidMount() {
    const resp = await superagent.get('/api/games/' + this.props.gameId)
    const { questions, openQuestionId, playerRegex, playerRegexMessage, players, responses } = resp.body
    this.setState({
      ...pick(resp.body, Object.keys(this.state)),
      newPlayerRegex: resp.body.playerRegex,
      newPlayerRegexMessage: resp.body.playerRegexMessage,

      newButtonLeftTitle: resp.body.buttonLeftTitle,
      newButtonMiddleTitle: resp.body.buttonMiddleTitle,
      newButtonRightTitle: resp.body.buttonRightTitle,
      newBackgroundColorLeft: resp.body.backgroundColorLeft,
      newBackgroundColorMiddle: resp.body.backgroundColorMiddle,
      newBackgroundColorRight: resp.body.backgroundColorRight,
      newRadius: resp.body.radius,
    })

    this.game.join('admin', 'admin')
    this.game.on('update', (event) => {
      this.setState(pick(event, Object.keys(this.state)))
    })
  }

  async addQuestion(text) {
    if (!text) { return }
    const newQuestions = this.state.questions.concat([{text}])
    const resp = await superagent.post('/api/games/' + this.props.gameId)
      .query({ adminCode: this.props.adminCode})
      .send({ questions: newQuestions })
    const { questions } = resp.body
    this.setState({ questions, newQuestionValue: '' })
  }

  async updatePlayerRegex(newPlayerRegex, newPlayerRegexMessage) {
    const resp = await superagent.post('/api/games/' + this.props.gameId)
      .query({ adminCode: this.props.adminCode})
      .send({
        playerRegex: newPlayerRegex || null,
        playerRegexMessage: newPlayerRegexMessage || null
      })
    const { playerRegex, playerRegexMessage } = resp.body
    this.setState({ playerRegex, playerRegexMessage })
  }

  async saveOptions() {
    const resp = await superagent.post('/api/games/' + this.props.gameId)
      .query({ adminCode: this.props.adminCode})
      .send({
        playerRegex: this.state.newPlayerRegex || null,
        playerRegexMessage: this.state.newPlayerRegexMessage || null,

        buttonLeftTitle: this.state.newButtonLeftTitle || null,
        buttonMiddleTitle: this.state.newButtonMiddleTitle || null,
        buttonRightTitle: this.state.newButtonRightTitle || null,
        backgroundColorLeft: this.state.newBackgroundColorLeft || null,
        backgroundColorMiddle: this.state.newBackgroundColorMiddle || null,
        backgroundColorRight: this.state.newBackgroundColorRight || null,

        radius: (+this.state.newRadius) || null,
      })

    this.setState({
      ...pick(resp.body, Object.keys(this.state)),
      newPlayerRegex: resp.body.playerRegex,
      newPlayerRegexMessage: resp.body.playerRegexMessage,

      newButtonLeftTitle: resp.body.buttonLeftTitle,
      newButtonMiddleTitle: resp.body.buttonMiddleTitle,
      newButtonRightTitle: resp.body.buttonRightTitle,
      newBackgroundColorLeft: resp.body.backgroundColorLeft,
      newBackgroundColorMiddle: resp.body.backgroundColorMiddle,
      newBackgroundColorRight: resp.body.backgroundColorRight,
      newRadius: resp.body.radius,
    })
  }

  async setOpenQuestion(openQuestionId) {
    const resp = await superagent.post('/api/games/' + this.props.gameId)
      .query({ adminCode: this.props.adminCode })
      .send({ openQuestionId })
    this.setState({ openQuestionId: resp.body.openQuestionId })
  }

  hasChangesToSave() {
    return this.state.playerRegex !== this.state.newPlayerRegex
      || this.state.playerRegexMessage !== this.state.newPlayerRegexMessage

      || this.state.buttonLeftTitle !== this.state.newButtonLeftTitle
      || this.state.buttonMiddleTitle !== this.state.newButtonMiddleTitle
      || this.state.buttonRightTitle !== this.state.newButtonRightTitle
      || this.state.backgroundColorLeft !== this.state.newBackgroundColorLeft
      || this.state.backgroundColorMiddle !== this.state.newBackgroundColorMiddle
      || this.state.backgroundColorRight !== this.state.newBackgroundColorRight
      || this.state.radius !== this.state.newRadius
  }

  async updateQuestion(id, text) {
    const questions = this.state.questions.map((q) => {
      if (q._id === id) {
        q.text = text
      }
      return q
    })
    const resp = await superagent.post('/api/games/' + this.props.gameId)
      .query({ adminCode: this.props.adminCode })
      .send({ questions })
    this.setState({
      questions: resp.body.questions,
      editQuestionId: null,
      editQuestionValue: '',
    })
  }

  render() {
    const onlineMap = toMap(this.state.online, (p) => p.player)
    const onlineList = this.state.players.filter((p) => !!onlineMap[p]).map((p) => this.state.playerInfo[getKeyFromPlayer(p)])
    const offlineList = this.state.players.filter((p) => !onlineMap[p]).map((p) => this.state.playerInfo[getKeyFromPlayer(p)])

    return (
      <>
        <div className='container'>
          <div className="row">
            <div className="col">
              <div>
                Send this link to players: <a href={"/" + this.props.gameId}>{location.host}{"/" + this.props.gameId}</a>
              </div>
              <div>
                Put this on a big screen: <a href={"/" + this.props.gameId + "/present"}>{location.host}{"/" + this.props.gameId}/present</a>
              </div>

              <details style={{backgroundColor:"#eee"}}>
                <summary>Options</summary>
                <div className="container">
                  <div>
                    Bookmark the admin link <a href={"/" + this.props.gameId + "/manage-" + this.props.adminCode}>{location.host}{"/" + this.props.gameId + "/manage-" + this.props.adminCode}</a>
                  </div>
                  <div>
                    <a href={"/" + this.props.gameId + `/data.json`} download>Download the JSON data for questions and responses.</a>
                  </div>
                  <div>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      this.saveOptions()
                    }}>
                      <h4>Validate Player IDs (email)</h4>
                      <div>Player Regex: <input className="control" type="text"
                        placeholder={'^.*@email\\.com$'}
                        value={this.state.newPlayerRegex}
                        onChange={(e) => this.setState({ newPlayerRegex: e.target.value })}
                      /></div>
                      <div>Player Regex Message: <input className="control" type="text"
                        placeholder={'Please enter your email.'}
                        value={this.state.newPlayerRegexMessage}
                        onChange={(e) => this.setState({ newPlayerRegexMessage: e.target.value })}
                      /></div>
                      <div>Left Button Title: <input className="control" type="text"
                        placeholder={'Left'}
                        value={this.state.newButtonLeftTitle}
                        onChange={(e) => this.setState({ newButtonLeftTitle: e.target.value })}
                      /></div>
                      <div>Middle Button Title: <input className="control" type="text"
                        placeholder={'Left'}
                        value={this.state.newButtonMiddleTitle}
                        onChange={(e) => this.setState({ newButtonMiddleTitle: e.target.value })}
                      /></div>
                      <div>Right Button Title: <input className="control" type="text"
                        placeholder={'Left'}
                        value={this.state.newButtonRightTitle}
                        onChange={(e) => this.setState({ newButtonRightTitle: e.target.value })}
                      /></div>
                      <div>Left Background Color: <input className="control" type="text"
                        placeholder={'Left'}
                        value={this.state.newBackgroundColorLeft}
                        onChange={(e) => this.setState({ newBackgroundColorLeft: e.target.value })}
                      /></div>
                      <div>Middle Background Color: <input className="control" type="text"
                        placeholder={'Left'}
                        value={this.state.newBackgroundColorMiddle}
                        onChange={(e) => this.setState({ newBackgroundColorMiddle: e.target.value })}
                      /></div>
                      <div>Right Background Color: <input className="control" type="text"
                        placeholder={'Left'}
                        value={this.state.newBackgroundColorRight}
                        onChange={(e) => this.setState({ newBackgroundColorRight: e.target.value })}
                      /></div>
                      <div>Ball Radius: <input className="control" type="text"
                        placeholder={25}
                        value={this.state.newRadius}
                        onChange={(e) => this.setState({ newRadius: e.target.value })}
                      /></div>
                      <div>
                        <button className="control"
                          onClick={(e) => {
                            this.setState({
                              newPlayerRegex: this.state.playerRegex,
                              newPlayerRegexMessage: this.state.playerRegexMessage,
                              newButtonLeftTitle: this.state.buttonLeftTitle,
                              newButtonMiddleTitle: this.state.buttonMiddleTitle,
                              newButtonRightTitle: this.state.buttonRightTitle,
                              newBackgroundColorLeft: this.state.backgroundColorLeft,
                              newBackgroundColorMiddle: this.state.backgroundColorMiddle,
                              newBackgroundColorRight: this.state.backgroundColorRight,
                              newRadius: this.state.radius,
                            })
                          }}
                          disabled={!this.hasChangesToSave()}
                        >Cancel</button>
                        <input type="submit" value="Save" className="control"
                          disabled={!this.hasChangesToSave()}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </details>

            </div>
          </div>

          <div className="row" style={{marginBottom: '2em', paddingBottom: '2em'}}>
            <div className="col">

              <div>
                <h3>Questions</h3>
              </div>

              <div>
                <button
                  className="control"
                  onClick={(e) => this.setOpenQuestion(null)}
                  disabled={this.state.openQuestionId===null}
                >Close Question
                </button>
              </div>
              <ol style={{lineHeight: '1.8em'}}>
                {
                  (this.state.questions || []).map((q) => {
                    const isOpen = q._id === this.state.openQuestionId
                    const isEditing = this.state.editQuestionId === q._id

                    return (
                      <li key={q._id}>
                        <button
                          className='control'
                          onClick={(e) => this.setOpenQuestion(q._id)}
                          disabled={isOpen}
                          style={{marginRight: '0.4em'}}
                        >Open</button>
                        <button
                          className='control'
                          onClick={(e) => isEditing
                            ? this.setState({ editQuestionId: null, editQuestionValue: '' })
                            : this.setState({ editQuestionId: q._id, editQuestionValue: q.text })}
                          style={{marginRight: '0.4em'}}
                        >{ isEditing ? 'Cancel' : 'Edit' }</button>
                        {
                          this.state.editQuestionId === q._id ? 
                          <>
                          <input type="text"
                            className="control"
                            style={{minWidth: '400px'}}
                            onChange={(e) => this.setState({ editQuestionValue: e.target.value })}
                            value={this.state.editQuestionValue}
                          />
                          <button
                            className='control'
                            onClick={(e) => this.updateQuestion(this.state.editQuestionId, this.state.editQuestionValue)}
                          >Save</button>
                          </> 
                          :
                          <span
                          style={{
                            color: isOpen ? 'indigo' : 'inherit',
                            marginRight: '0.3em'
                          }}
                        >{isOpen && '> '}{styleText(q.text, this.state)}</span>
                        }

                        { this.state.responses[q._id] && (
                          <span>({(this.state.responses[q._id].a || []).length}-{(this.state.responses[q._id].b || []).length})</span>
                        ) }
                      </li>
                    )
                  })
                }
              </ol>
              <form onSubmit={(e) => {
                e.preventDefault()
                this.addQuestion(this.state.newQuestionValue)
              }}>
                <input
                  className='control'
                  type="search"
                  onChange={(e) => this.setState({ newQuestionValue: e.target.value })}
                  value={this.state.newQuestionValue}
                  style={{marginRight: '0.4em'}}
                />
                <input
                  className='control'
                  type="submit" value="Add Question"
                  onClick={(e) => this.addQuestion(this.state.newQuestionValue)}
                />
              </form>
            </div>

            <div className="col" style={{minWidth: '300px', maxWidth:'300px'}}>
              <h3>Players</h3>
              <ul>
                {
                  onlineList.map((p) => {
                    return (
                      <li key={p.player}
                      >{p.player} ({p.name})</li>
                    )
                  })
                }
                {
                  offlineList.map((p) => {
                    return (
                      <li key={p.player} style={{color: 'lightgray'}}
                      >{p.player} ({p.name})</li>
                    )
                  })
                }
              </ul>
            </div>
          </div>

        </div>
      </>
    )
  }
}
