import _ from 'underscore'

export const toArray = function (obj) {
  return _.map(obj, x => x)
}

export const find = function (obj, objectId) {
  return _.findWhere(obj, {objectId})
}

export const exchange = function (index) {
  return index === 0 ? 1 : 0
}

export const int = parseInt

export const trim = function (str) {
  return str.trim()
}

export const beArray = function (param) {
  if (_.isArray(param)) return param
  return [param]
}