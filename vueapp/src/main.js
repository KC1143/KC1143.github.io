import Vue from 'vue'
import App from './App.vue'
import router from './router' // used to route pages to respective components 

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')