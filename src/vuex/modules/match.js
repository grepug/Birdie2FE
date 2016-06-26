import _ from 'underscore'

const state = {
  // teams: [['575251faa341310063bf7e22'],['575d79e2df0eea00648bd3f6']],
  // // teams: [],
  // umpire: [],
  // discipline: null,
  // matchSettings: {
  //   scoringSys: 5,
  //   bestOf: 3,
  //   intervalScore: 2,
  //   gameIntervalDuration: 60
  // },
  // matchRoomStates: {
  //   roomId: null,
  //   invitees: [],
  //   createdAt: null
  // },
  // matchReady: false,
  matchState: 'playing', // preparing, playing, completed
  matchClock: '00:00:00',
  matchDuration: 0,
  scores: {
    "0": 0,
    "1": 0
  },
  scoresFlow: [],
  sideExchanged: false,
  matchGames: [],
  matchScores: {
    "0": 0,
    "1": 0
  },
  lastScoredTeamIndex: 1,
  gameNumber: 1,
  isGameInterval: false,
  gameIntervalTimer: 0
}

const mutations = {
  // ['CHANGE_TEAMS'] (state, teams) {
  //   state.teams = teams.t
  //   state.umpire = teams.u || []
  //   state.discipline = teams.d
  // },
  // ['ADD_MEMBER'] (state, member) {
  //   state.teams.push(member)
  // },
  // ['CHANGE_MATCH_SETTINGS'] (state, matchSettings) {
  //   state.matchSettings = matchSettings
  // },
  // ['CHANGE_MATCH_STATE'] (state, matchState) {
  //   state.matchState = matchState
  // },
  // ['CHANGE_MATCHROOM_STATE'] (state, isMatchReady) {
  //   state.matchReady = isMatchReady
  // },
  // ['SET_ROOM_ID'] (state, roomId) {
  //   state.matchRoomStates.roomId = roomId
  // },
  // ['SET_MATCHROOM_MEMBERS'] (state, members) {
  //   state.matchRoomStates.members = members
  // },
  // ['ADD_MATCHROOM_INVITEES'] (state, invitees) {
  //   state.matchRoomStates.invitees = state.matchRoomStates.invitees.concat(invitees)
  // },
  ['CHANGE_MATCH_DURATION'] (state, cl, duration) {
    state.matchClock = cl
    state.matchDuration = duration
  },
  ['CHANGE_GAME_SCORES'] (state, team) {
    state.scores[team]++
    state.scoresFlow.push({
      scoredTeam: team,
      duration: state.matchDuration
    })
    state.lastScoredTeamIndex = team
  },
  ['RESET_GAME_SCORES'] (state) {
    state.scores = {'0': 0, '1': 0}
  },
  ['EXCHANGE_SIDES'] (state) {
    state.sideExchanged = !state.sideExchanged
  },
  ['PUSH_MATCH_GAME'] (state, winnerIndex) {
    state.matchGames.push({
      scoresFlow: state.scoresFlow,
      winner: winnerIndex,
      duration: state.matchDuration,
      scores: state.scores
    })
    state.matchScores[winnerIndex]++
    state.scoresFlow = []
  },
  ['ADD_GAME_NUMBER'] (state) {
    state.gameNumber++
  },
  ['SET_GAME_INTERVAL'] (state) {
    state.isGameInterval = true
  },
  ['SET_GAME_INTERVAL_TIMER'] (state, secs) {
    state.gameIntervalTimer = secs
  },
  ['REMOVE_GAME_INTERVAL'] (state) {
    state.isGameInterval = false
    state.gameIntervalTimer = 0
  },
  ['UNDO_LAST_SCORE'] (state) {
    var len = state.scoresFlow.length
    var falseWinnerIndex = state.lastScoredTeamIndex
    var lastLastScoredTeam
    if (state.gameNumber === 1 && !state.scoresFlow.length) return
    if (len) { // 撤销本局的最后一分
      state.scores[falseWinnerIndex]--
      state.scoresFlow = cutLast(state.scoresFlow)
      if (!state.scoresFlow.length && state.matchGames.length) {
        lastLastScoredTeam = _.last(_.last(state.matchGames).scoresFlow).scoredTeam
        console.log(lastLastScoredTeam)
      }
    }
    else { // 撤销上一局的最后一分
      let scores = _.last(state.matchGames).scores
      scores[falseWinnerIndex]--
      console.log(JSON.stringify(scores))
      state.scoresFlow = cutLast(_.last(state.matchGames).scoresFlow)
      state.scores = scores
      state.matchGames = cutLast(state.matchGames)
      state.matchScores[falseWinnerIndex]--
      state.sideExchanged = !state.sideExchanged
      state.gameNumber--
      console.log(state.scoresFlow)
    }
    state.lastScoredTeamIndex = state.scoresFlow.length ? _.last(state.scoresFlow).scoredTeam : (lastLastScoredTeam !== undefined ? lastLastScoredTeam : null)
  }
}

function cutLast (arr) {
  var len = arr.length
  if (len) arr.length = len - 1
  return arr
}

export default {
  state,
  mutations
}
