const { pick } = require('./util')

const GAME_JSON_KEYS = [
  'gameId',
  'createdAt',
  'updatedAt',

  'playerRegexMessage',
  'playerRegex',
  // style
  'buttonLeftTitle',
  'buttonMiddleTitle',
  'buttonRightTitle',
  'backgroundColorLeft',
  'backgroundColorMiddle',
  'backgroundColorRight',
  'radius',

  'questions',
  'openQuestionId',
  'players',
  'playerInfo',
  'responses',
]

const renderGameJson = (game) => pick(game, GAME_JSON_KEYS)

module.exports = {
  renderGameJson
}
