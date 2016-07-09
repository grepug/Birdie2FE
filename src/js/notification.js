import Wilddog from '../../node_modules/wilddog/lib/wilddog-node'
import AV from './AV'
import _ from 'underscore'
import store from '../vuex/store'
import {addOthersUserObj} from '../vuex/actions/user'

const ref = new Wilddog(`https://birdie2.wilddogio.com/notification/${AV.User.current().id}`)

ref.on('value', (snapshot, err) => {
  var userObjIds = []
  snapshot.forEach(data => {
    var key = data.key()
    var val = data.val()
    val.ID = key
    store.dispatch('ADD_NOTIFICATIONS', val)
    userObjIds = userObjIds.concat(_.map(val, (v, k) => {
      if (typeof v === 'string' && v.length === 24)
        return v
    }).filter(x => x))
  })
  addOthersUserObj(store, userObjIds)
})