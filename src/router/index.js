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
        name: "菜单管理",
        component: () => import('@/components/basicInformation/MenuManagemant.vue'),
        meta: {
          title: '菜单管理'
        }
      },
      {
        path: '/system/user',
        name: "系统账户",
        component: () => import('@/components/basicInformation/SystemAccount.vue'),
        meta: {
          title: '系统账户'
        }
      },
      // {
      //   path: '/system/UserList',
      //   name: "用户管理",
      //   component: () => import('@/components/basicInformation/UserManagemant.vue'),
      //   meta: {
      //     title: '用户管理'
      //   }
      // },
      {
        path: '/system/doctor',
        name: "医生管理",
        component: () => import('@/components/basicInformation/DoctorManagement.vue'),
        meta: {
          title: '医生管理'
        }
      },
      {
        path: '/system/hosptial',
        name: "组织管理",
        component: () => import('@/components/basicInformation/HosptialManagement.vue'),
        meta: {
          title: '组织管理'
        }
      },
      {
        path: '/system/dict',
        name: "数据字典",
        component: () => import('@/components/basicInformation/Dictionary.vue'),
        meta: {
          title: '数据字典'
        }
      },
      {
        path: '/system/patient',
        name: "患者管理",
        component: () => import('@/components/basicInformation/PatientManagement.vue'),
        meta: {
          title: '患者管理'
        }
      },
      {
        path: '/system/role',
        name: "角色管理",
        component: () => import('@/components/basicInformation/Role.vue'),
        meta: {
          title: '角色管理'
        }
      },
      {
        path: '/system/log',
        name: "日志管理",
        component: () => import('@/components/basicInformation/Logmanagemant.vue'),
        meta: {
          title: '日志管理'
        }
      },
      {
        path: '/JumpDictionaryNext',
        name: "字典数据",
        component: () => import('@/components/basicInformation/JumpDictionaryNext.vue'),
        meta: {
          title: '字典数据'
        }
      },
      {
        path: '/system/server',
        name: "服务器监控",
        component: () => import('@/components/basicInformation/ServerMonitoring.vue'),
        meta: {
          title: '服务器监控'
        }
      },
      {
        path: '/system/test',
        name: "加密管理",
        component: () => import('@/components/basicInformation/Test.vue'),
        meta: {
          title: '加密管理'
        }
      },
      {
        path: '/food/foodManagemant',
        name: "食物管理",
        component: () => import('@/components/dietaryManagement/FoodManagement.vue'),
        meta: {
          title: '食物管理'
        }
      },
      {
        path: '/food/DietPlan',
        name: "饮食方案",
        component: () => import('@/components/dietaryManagement/DietPlan.vue'),
        meta: {
          title: '饮食方案'
        }
      },
      {
        path: '/food/measure',
        name: "估量食物管理",
        component: () => import('@/components/dietaryManagement/EstimateFood.vue'),
        meta: {
          title: '估量食物管理'
        }
      },
      {
        path: '/food/measuretype',
        name: "估量食物类型管理",
        component: () => import('@/components/dietaryManagement/EstimateFoodManagemant.vue'),
        meta: {
          title: '估量食物类型管理'
        }
      },
      {
        path: '/food/foodType',
        name: "食物类型管理",
        component: () => import('@/components/dietaryManagement/FoodType.vue'),
        meta: {
          title: '食物类型管理'
        }
      },
      {
        path: '/water/WaterDrinkingDetail',
        name: "饮水指导详情",
        component: () => import('@/components/waterManagement/WaterDrinkingDetail.vue'),
        meta: {
          title: '饮水指导详情'
        }
      },
      {
        path: '/sport/MovementPlan',
        name: "运动方案",
        component: () => import('@/components/sportManagement/MovementPlan.vue'),
        meta: {
          title: '运动方案'
        }
      },
      {
        path: '/sport/MovementIntroduced',
        name: "运动介绍",
        component: () => import('@/components/sportManagement/MovementIntroduced.vue'),
        meta: {
          title: '运动介绍'
        }
      },
      {
        path: '/water/WaterSolution',
        name: "饮水方案",
        component: () => import('@/components/waterManagement/WaterSolution.vue'),
        meta: {
          title: '饮水方案'
        }
      },
      {
        path: '/water/WaterType',
        name: "饮水种类",
        component: () => import('@/components/waterManagement/WaterType.vue'),
        meta: {
          title: '饮水种类'
        }
      },{
        path: '/water/guide',
        name: "饮水指导",
        component: () => import('@/components/waterManagement/WaterDrinking.vue'),
        meta: {
          title: '饮水指导'
        }
      },
    ]
  },
]

const router = new VueRouter({
  // baseL: "/history",
  // mode: 'history',
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