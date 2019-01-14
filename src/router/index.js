import Vue from 'vue'
import VueRouter from 'vue-router'

// const Foo = () => import('./Foo.vue')

import { Message } from 'element-ui'
const Login = () => import('@/components/login.vue')
const Home = () => import('@/components/home.vue')
const Users = () => import('@/components/users.vue')
const Rights = () => import('@/components/rights.vue')
const Roles = () => import('@/components/roles.vue')
const GoodsList = () => import('@/components/goodslist.vue')
const GoodsAdd = () => import('@/components/goodsadd.vue')
const Params = () => import('@/components/params.vue')
const Goodscate = () => import('@/components/goodscate.vue')
const Order = () => import('@/components/order.vue')
const Reports = () => import('@/components/reports.vue')
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [{
        name: 'users',
        path: '/users',
        component: Users
      },
      {
        name: 'rights',
        path: '/rights',
        component: Rights
      },
      {
        name: 'roles',
        path: '/roles',
        component: Roles
      }, {
        name: 'goods',
        path: '/goods',
        component: GoodsList
      }, {
        name: 'goodsadd',
        path: '/goodsadd',
        component: GoodsAdd
      },
      {
        name: 'goodsadd',
        path: '/goodsadd',
        component: GoodsAdd
      },
      {
        name: 'params',
        path: '/params',
        component: Params
      },
      {
        name: 'categories',
        path: '/categories',
        component: Goodscate
      },
      {
        name: 'orders',
        path: '/orders',
        component: Order
      },
      {
        name: 'reports',
        path: '/reports',
        component: Reports
      }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    next()
  } else {
    if (!localStorage.getItem("token")) {
      Message.warning('请先登录')
      router.push({
        name: "login"

      })
    } else {
      next()
    }
  }
})

export default router
