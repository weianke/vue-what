import Vue from 'vue'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io'

import './assets/chat.css'


Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:9000'
}))

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
