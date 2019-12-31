import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/components/Login.vue')
  },
  {
    path: '/home',
    component: () => import('@/components/Home.vue'),
    redirect: '/index',
    children: [{
        path: '/index',
        name: "首页",
        component: () => import('@/components/Index.vue'),
        meta: {
          title: '首页'
        }
      },
      {
        path: '/system/menu',
        name: '菜单管理',
        component: () => import('@/components/SystemMana/MenuManag.vue'),
        meta: {
          title: '菜单管理'
        }
      },
      {
        path: '/system/user',
        name: '系统帐户',
        component: () => import('@/components/SystemMana/SystemAccount.vue'),
        meta: {
          title: '系统帐户'
        }
      },
      {
        path: '/system/hosptial',
        name: '部门管理',
        component: () => import('@/components/SystemMana/DepartmentMana.vue'),
        meta: {
          title: '部门管理'
        }
      },
      {
        path: '/system/dict',
        name: '数据字典',
        component: () => import('@/components/SystemMana/DataDic.vue'),
        meta: {
          title: '数据字典'
        }
      },
      {
        path: '/JumpDictionaryNext',
        name: '新增字典数据',
        component: () => import('@/components/SystemMana/JumpDictionaryNext.vue'),
        meta: {
          title: '新增字典数据'
        }
      },
      {
        path: '/system/role',
        name: '角色管理',
        component: () => import('@/components/SystemMana/RoleMana.vue'),
        meta: {
          title: '角色管理'
        }
      },
      {
        path: '/system/log',
        name: '日志管理',
        component: () => import('@/components/SystemMana/LogMana.vue'),
        meta: {
          title: '日志管理'
        }
      },
      {
        path: '/system/server',
        name: '服务监控',
        component: () => import('@/components/SystemMana/ServeMonitoring.vue'),
        meta: {
          title: '服务监控'
        }
      },
      {
        path: '/system/test',
        name: '加密管理',
        component: () => import('@/components/SystemMana/EncryptionMana.vue'),
        meta: {
          title: '加密管理'
        }
      },
    ]
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //如果用户访问的路由是/login直接放行
  if (to.path == '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  //如果没有买票，让他去/login买票去
  if (!tokenStr) return next('/login');
  next();
})
export default router