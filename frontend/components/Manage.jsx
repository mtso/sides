import React, { Component } from 'react'
import superagent from 'superagent'

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
      responses: {},
      newQuestionValue: '',
    }
  }

  async componentDidMount() {
    const resp = await superagent.get('/api/games/' + this.props.gameId)
    const { questions, openQuestionId, playerRegex, playerRegexMessage, players, responses } = resp.body
    this.setState({
      questions, openQuestionId, players, responses,
      playerRegex, newPlayerRegex:playerRegex, playerRegexMessage, newPlayerRegexMessage:playerRegexMessage })
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

  render() {
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

              <details>
                <summary>Options</summary>
                <div className="container" style={{backgroundColor:"#eee"}}>
                  <div>
                    Bookmark the admin link <a href={"/" + this.props.gameId + "/manage-" + this.props.adminCode}>{location.host}{"/" + this.props.gameId + "/manage-" + this.props.adminCode}</a>
                  </div>
                  <div>
                    <a href={"/" + this.props.gameId + `/data-v${(this.state || {}).version}.json`} download>Download the JSON data for questions and responses.</a>
                  </div>
                  <div>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      this.updatePlayerRegex(this.state.newPlayerRegex, this.state.newPlayerRegexMessage)
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
                      <div>
                        <button className="control"
                          onClick={(e) => {
                            this.setState({
                              newPlayerRegex: this.state.playerRegex,
                              newPlayerRegexMessage: this.state.playerRegexMessage,
                            })
                          }}
                          disabled={(this.state.newPlayerRegex===this.state.playerRegex && this.state.newPlayerRegexMessage===this.state.playerRegexMessage)}
                        >Cancel</button>
                        <input type="submit" value="Save" className="control"
                          disabled={(this.state.newPlayerRegex===this.state.playerRegex && this.state.newPlayerRegexMessage===this.state.playerRegexMessage)}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </details>

            </div>
          </div>

          <div className="row">
            <div className="col">

              <div>
                <h3>Questions</h3>
              </div>

              <div>
                <button
                  className="control"
                  onClick={(e) => false && this.clearActiveQuestion()}
                  disabled={true || this.state.gameState.activeQuestionId===null}
                >Close Question
                </button>
              </div>
              <ol style={{lineHeight: '1.8em'}}>
                {
                  (this.state.questions || []).map((q) => {
                    const isActive = q._id === this.state.openQuestionId
                    return (
                      <li key={q._id}>
                        <button
                          onClick={(e) => this.setActiveQuestion(q._id)}
                          disabled={isActive}
                          style={{marginRight: '0.4em'}}
                        >Open</button>
                        <span
                          style={{
                            color: isActive ? 'indigo' : 'inherit',
                            marginRight: '0.3em'
                          }}
                        >{isActive && '> '}{q.text}</span>
                        { this.state.gameState && this.state.gameState.responses[q._id] && (
                          <span>({(this.state.gameState.responses[q._id].a || []).length}-{(this.state.gameState.responses[q._id].b || []).length})</span>
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
              {/*<ul>
                {
                  (this.state.gameState.players || []).map((player) => {
                    const isOffline = !!offlineMap[player]
                    return (
                      <li key={player}
                        style={{color: isOffline ? 'gray' : 'black'}}
                      >{player}</li>
                    )
                  })
                }
              </ul>*/}
            </div>
          </div>

        </div>
      </>
    )
  }
}
