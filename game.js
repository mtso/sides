function renderGameJson(game) {
  return {
    gameId: game.gameId,
    createdAt: game.createdAt,
    updatedAt: game.updatedAt,

    questions: game.questions,
    playerRegexMessage: game.playerRegexMessage,
    playerRegex: game.playerRegex,
    // style
    buttonLeftTitle: game.buttonLeftTitle,
    buttonMiddleTitle: game.buttonMiddleTitle,
    buttonRightTitle: game.buttonRightTitle,
    backgroundColorLeft: game.backgroundColorLeft,
    backgroundColorMiddle: game.backgroundColorMiddle,
    backgroundColorRight: game.backgroundColorRight,
    radius: game.radius,

    openQuestionId: game.openQuestionId,
    players: game.players,
    playerInfo: game.playerInfo,
    responses: game.responses,
  }
}

module.exports = {
  renderGameJson,
}
