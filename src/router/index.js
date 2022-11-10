import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: '首页',
        icon: 'dashboard'
      }
    }]
  }]
  export const asyncRoutes=[
    {
      path: '/product',
      component: Layout,
      name: "Product",
      meta: {
        title: '商品管理',
        icon: 'el-icon-goods'
      },
      children: [{
          path: 'trademark',
          component: () => import('@/views/product/brand'),
          meta: {
            title: "品牌管理"
          },
          name: "Trademark",
        },
        {
          path: 'attr',
          component: () => import('@/views/product/attrs'),
          meta: {
            title: "平台属性管理"
          },
          name: "Attr",
        },
  
        {
          path: 'spu',
          component: () => import('@/views/product/spu'),
          meta: {
            title: "Spu管理"
          },
          name: "Spu",
        },
        {
          path: 'sku',
          component: () => import('@/views/product/sku'),
          meta: {
            title: "Sku管理"
          },
          name: "Sku",
        },
      ]
    },
    /**
     * 权限管理
     */
    {
      path: '/acl',
      component: Layout,
      name: "Acl",
      meta: {
        title: '权限管理',
        icon: 'el-icon-user-solid'
      },
      children: [{
          path: 'permission',
          component: () => import('@/views/acl/permission'),
          meta: {
            title: "菜单管理"
          },
          name: "Permission",
        },
        {
          path: 'user',
          component: () => import('@/views/acl/user'),
          meta: {
            title: "用户管理"
          },
          name: "User",
        },
  
        {
          name: 'Role',
          path: 'role/list',
          component: () => import('@/views/acl/role'),
          meta: {
            title: '角色管理',
          },
        },
        {
          name: 'RoleAuth',
          path: 'role/auth/:id',
          component: () => import('@/views/acl/role/roleAuth'),
          meta: {
            activeMenu: '/acl/role/list',
            title: '角色授权',
          },
          hidden: true,
        },
  
      ]
    },  
    {
      path: '/test',
      component: Layout,
      name: "Test",
      meta: {
        title: '测试管理',
        icon: 'el-icon-user-solid'
      },
      children: [{
          path: 'test1',
          component: () => import('@/views/test/test1'),
          meta: {
            title: "测试1管理"
          },
          name: "Test1",
        },
        {
          path: 'test2',
          component: () => import('@/views/test/test2'),
          meta: {
            title: "测试2管理"
          },
          name: "Test2",
        },
        ]
    },
  ]
  // 404 page must be placed at the end !!!
  export const anyRoutes=[
    {
      path: '*',
      redirect: '/404',
      hidden: true
    }
    ]


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  //必须写，否则在更改本账号角色权限后，会是空白因为一开始是constantRoutes不行
  routes: [...constantRoutes,...asyncRoutes,...anyRoutes]
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
