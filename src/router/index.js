import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
import GoodsList from '@/components/goodslist.vue'
import GoodsAdd from '@/components/goodsadd.vue'
import Params from '@/components/params.vue'
import Goodscate from '@/components/goodscate.vue'

import { Message } from 'element-ui'
Vue.use(Router)

const router = new Router({
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

// if (!localStorage.getItem("token")) {
//   this.$message.warning("请登录");
//   this.$router.push({
//     name: "login"
//   });
// }

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
