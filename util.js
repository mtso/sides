function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (key in obj) {
      acc[key] = obj[key]
    }
    return acc
  }, {})
}

/* params: (array, (value) => key) */
function toMap(list, getKey, updateValues) {
  updateValues = updateValues || ((v) => v)
  return list.reduce((acc, value) => {
    acc[getKey(value)] = updateValues(value)
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
  toMap,
  getKeyFromPlayer,
  getPlayerFromKey,
}
