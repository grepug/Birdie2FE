import AV from '../../js/AV'
import api from '../../js/wilddogApi'
import _ from 'underscore'

export const create = ({dispatch, state}) => {
  return AV.Cloud.run('match', {
    method: 'create',
    teams: state.match.teams,
    umpire: state.match.umpire,
    discipline: state.match.discipline,
    scoringSys: state.match.matchSettings.scoringSys,
    bestOf: state.match.matchSettings.bestOf
  }).then(ret => {
    dispatch('CHANGE_MATCH_STATE', 'playing')
  })
}

export const addMember = ({dispatch, state}, member) => {
  dispatch('ADD_MEMBER', member)
}

export const changeTeams = ({dispatch, state}, teams) => {
  var _t = teams.filter(el => el)
  var _tLen = _t.length
  var t, u, d
  var sort
  if (_tLen <= 1) {
    t = _t
  } else if (_tLen === 2) {
    t = [[_t[0]], [_t[1]]]
  } else if (_tLen === 3) {
    t = [[_t[0]], [_t[1]]]
    u = [_t[2]]
  } else if (_tLen === 4) {
    t = [[_t[0], _t[1]], [_t[2], _t[3]]]
  } else if (_tLen === 5) {
    t = [[_t[0], _t[1]], [_t[2], _t[3]]]
    u = [_t[4]]
  }
  console.log('CHANGE_TEAMS', {t,u,d})
  dispatch('CHANGE_TEAMS', {t, u, d})
  if (_tLen >= 2 && _tLen <= 5) {
    dispatch('CHANGE_MATCHROOM_STATE', true)
  } else {
    dispatch('CHANGE_MATCHROOM_STATE', false)
  }
  return
}

export const changeMatchSettings = ({dispatch}, matchSettings) => {
  return dispatch('CHANGE_MATCH_SETTINGS', matchSettings)
}

export const addMatchRoomInvitees = ({dispatch, state}, invitees) => {
  invitees = _.isArray(invitees) ? invitees : [invitees]
  var unAddedMembers = invitees.map(el => {
    var r = state.match.matchRoomStates.invitees.indexOf(el) === -1
    if (r) {
      return el
    }
    return null
  }).filter(x => x)
  dispatch('ADD_MATCHROOM_INVITEES', unAddedMembers)
}

export const createMatch = ({dispatch, state}) => {
  var {match, user} = state
  return AV.Cloud.run('match', {
    method: 'create',
    teams: match.teams,
    umpire: match.umpire,
    scoringSys: match.matchSettings.scoringSys,
    discipline: match.discipline,
    bestOf: match.matchSettings.bestOf
  }).then(ret => {
    return api.setMatchState(match.matchRoomStates.roomId, 'playing')
  })
}
