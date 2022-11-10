import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  resetRouter
} from '@/router'
import {
  login,
  getInfo,
  logout
} from "@/api/acl/user.js"
//超级管理员的异步路由
import {
  constantRoutes,
  asyncRoutes,
  anyRoutes
} from "@/router"

import router from "@/router"
//定义一个函数：两个数组进行对比constantRoutes-routes，对比出当前用户到底显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
  //过滤出当前用户需要展示的
  let asy = asyncRoutes.filter(item => {
    let bool
    if (item.children && item.children.length) {
      bool = item.children.some(items => {
        return routes.indexOf(items.name)
      })
    }
    if (routes.indexOf(item.name) != -1 || bool) {
      console.log(1)
      if (item.children && item.children.length) {
        console.log(2)
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }

  })
  console.log(asy)

  return asy

}
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    role: [],
    routes: [],
    buttons: [],
    resultAsyncRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  },
  SET_BUTTONS: (state, buttons) => {
    state.buttons = buttons
  },
  //最终计算出的异步路由
  SET_RESULTASYNCROUTES: (state, resultAsyncRoutes) => {
    console.log(resultAsyncRoutes)
    //constantRoutes在前，首页会在前
    state.resultAsyncRoutes = constantRoutes.concat(resultAsyncRoutes, anyRoutes)
    router.addRoutes(state.resultAsyncRoutes)
  },
}

const actions = {
  // user login
  async login({
    commit
  }, userInfo) {
    const {
      username,
      password
    } = userInfo
    let result = await login({
      username: username.trim(),
      password: password
    })
    console.log(result)
    if (result.code === 200 || result.code === 20000) {
      console.log(result)
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return "ok"
    } else {
      return Promise.reject(new Error('fail'))
    }

    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const {
          data
        } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const {
          name,
          avatar,
          roles,
          routes,
          buttons
        } = data
        // asyncRoutes.forEach(item=>{
        //   //说明没有一级路由的name，但是有其子组件
        //   if (routes.indexOf(item.name) == -1&&item.children && item.children.length) {
        //     routes.push(item.name)
        //   }

        // })

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLE', roles)
        commit('SET_ROUTES', routes)
        commit('SET_BUTTONS', buttons)
        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
