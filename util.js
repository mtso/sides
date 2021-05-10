function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (key in obj) {
      acc[key] = obj[key]
    }
    return acc
  }, {})
}

function getKeyFromPlayer(player) {
  return encodeURIComponent(player).replace(/\./g, '%2E')
}

function getPlayerFromKey(key) {
  return decodeURIComponent(key.replace(/%2E/g, '.'))
}

module.exports = {
  pick,
  getKeyFromPlayer,
  getPlayerFromKey,
}
