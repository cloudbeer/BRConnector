import Vue from "vue"
import VueRouter from "vue-router"
Vue.use(VueRouter)
import Layout from './components/system/layout'
import i18n from "./lang/i18n"
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
import { Home, Tv, Globe, StatsChart, Timer, Person, DocumentText, Hammer, Link, Key, Menu, Reader } from 'kui-icons'

const router = new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/login',
      meta: { title: 'Login', icon: '' },
      component: () => import(/*webpackChunkName:'login'*/'./pages/login'),
      hidden: true,
    },
    {
      path: '/',
      component: Layout,
      meta: { title: 'Home', icon: '' },
      children: [
        {
          path: '/',
          name: 'Home',
          meta: { title: i18n.t("menu.dashboard"), icon: Home },
          component: () => import(/*webpackChunkName:'Home'*/'./pages/home')
        }
      ]
    },
    {
      path: '/user',
      component: Layout,
      meta: { title: '我的话题', icon: Person },
      children: [
        {
          path: '/user/sessions',
          name: 'userSessions',
          meta: { title: '话题列表', icon: Menu },
          component: () => import(/*webpackChunkName:'Home'*/'./pages/sessions'),
        },
        {
          path: '/user/sessions/:session_id/threads',
          name: 'userThreads',
          meta: { title: '对话列表', icon: Reader },
          component: () => import(/*webpackChunkName:'Home'*/'./pages/threads'),
          hidden: true
        }
      ]
    },
    {
      path: '/admin',
      component: Layout,
      meta: { title: 'Admin', icon: Hammer },
      hidden: localStorage.getItem('role') != 'admin',
      // hidden: (localStorage.getItem('role') == 'admin'),
      children: [
        {
          path: '/admin/keys',
          name: 'AdminKeys',
          meta: { title: i18n.t("menu.key"), icon: Key },
          component: () => import(/*webpackChunkName:'Home'*/'./pages/keys'),
          // hidden: localStorage.getItem('role') != 'admin'
        },
        {
          path: '/admin/sessions',
          name: 'adminSessions',
          meta: { title: '话题列表', icon: Menu },
          component: () => import(/*webpackChunkName:'Home'*/'./pages/sessions'),
          // hidden: localStorage.getItem('role') != 'admin',
          hidden: true,
        },
        {
          path: '/admin/sessions/:session_id/threads',
          name: 'adminThreads',
          meta: { title: '对话列表', icon: Reader },
          component: () => import(/*webpackChunkName:'Home'*/'./pages/threads'),
          hidden: true
        }
      ]
    },
  ]
})


export default router