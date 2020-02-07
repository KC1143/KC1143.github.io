import Vue from 'vue'
import Router from 'vue-router'
import BootstrapVue from 'bootstrap-vue'

//import bootstap css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

//import components 
import usersAdmin from '@/components/usersAdmin'
import index from '@/components/index'
import home from '@/components/home'
import about from '@/components/about'
import contact from '@/components/contact'
import courses from '@/components/courses'
import coursesAdmin from '@/components/coursesAdmin'
import register from '@/components/register'
import login from '@/components/login'

Vue.use(BootstrapVue)
Vue.use(Router)

//definition of routes and component paths
export default new Router({
  routes: [
    {
      path: '/usersAdmin',
      name: 'usersAdmin',
      component: usersAdmin
    },
    {
      path: '/index',
      name: '/',
      component: index
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },    
    {
      path: '/about',
      name: 'About',
      component: about
    },
    {
      path: '/contact',
      name: 'contact',
      component: contact
    },
    {
      path: '/courses',
      name: 'courses',
      component: courses
    },
    {
      path: '/coursesAdmin',
      name: 'coursesAdmin',
      component: coursesAdmin
    },       
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: "/login",
      name: "login",
      component: login
    },      
  ]
})