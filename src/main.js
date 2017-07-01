import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'

import store from './store'

import '../node_modules/vuetify/src/stylus/main.styl'

Vue.use(Vuetify)

new Vue({
  el: '#app',
  store,
  render: h => h(App),
})

if (module.hot) {
  module.hot.accept(['./store'], () => {
    store.hotUpdate({
      mutations: require('./store').mutations,
      actions: require('./store').actions,
    })
  })
}
