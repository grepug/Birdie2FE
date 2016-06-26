import Vue from 'vue'
import Vuex from 'vuex'
import storage from './storage'
import undoMatchScores from './middlewares/undoMatchScores'
import general from './modules/general'
import user from './modules/user'
import match from './modules/match'
import ui from './modules/ui'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    general,
    user,
    match,
    ui
  },
  middlewares: [storage, undoMatchScores]
  // state,
  // mutations
})
