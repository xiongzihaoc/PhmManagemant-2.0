import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
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
          title: '首页',
        }
      },
      {
        path: '/system/menu',
        name: '菜单管理',
        component: () => import('@/components/SystemMana/MenuManag.vue'),
        meta: {
          title: '菜单管理',
        }
      },
      {
        path: '/system/user',
        name: '系统帐户',
        component: () => import('@/components/SystemMana/SystemAccount.vue'),
        meta: {
          title: '系统帐户',
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
          title: '新增字典数据',
          guidePath: true,
          jumpPath: '/system/dict',
        }
      },
      {
        path: '/system/role',
        name: '权限管理',
        component: () => import('@/components/SystemMana/RoleMana.vue'),
        meta: {
          title: '权限管理',
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
        component: () => import('@/components/SysMonitoring/ServeMonitoring.vue'),
        meta: {
          title: '服务监控'
        }
      },
      {
        path: '/control/data',
        name: '数据监控',
        component: () => import('@/components/SysMonitoring/DataMonitoring.vue'),
        meta: {
          title: '数据监控'
        }
      },
      {
        path: '/system/test',
        name: '加密管理',
        component: () => import('@/components/SystemMana/EncryptionMana.vue'),
        meta: {
          title: '加密管理',
        }
      },
      {
        path: '/system/config',
        name: '参数配置',
        component: () => import('@/components/SystemMana/paramConfig.vue'),
        meta: {
          title: '参数配置',
        }
      },
      {
        path: '/doctor/info',
        name: '医生信息',
        component: () => import('@/components/BasicInformation/DoctorInfo.vue'),
        meta: {
          title: '医生信息'
        }
      },
      {
        path: '/patient/info',
        name: '患者信息',
        component: () => import('@/components/BasicInformation/PatientInfo.vue'),
        meta: {
          title: '患者信息'
        }
      },
      {
        path: '/hosptial/info',
        name: '医院信息',
        component: () => import('@/components/BasicInformation/HospitalInfo.vue'),
        meta: {
          title: '医院信息'
        }
      },
      {
        path: '/medical/info',
        name: '体检卡信息',
        component: () => import('@/components/BasicInformation/MedicalCard.vue'),
        meta: {
          title: '体检卡信息',
        }
      },
      {
        path: '/packageTemplate/info',
        name: '套餐模板信息',
        component: () => import('@/components/BasicInformation/PackageTemplate.vue'),
        meta: {
          title: '套餐模板信息'
        }
      },
      {
        path: '/sheet/list',
        name: '量表列表',
        component: () => import('@/components/InventoryMana/InventoryList.vue'),
        meta: {
          title: '量表列表',
        }
      },
      {
        path: '/addsheet',
        name: '题目列表',
        component: () => import('@/components/InventoryMana/AddInventory.vue'),
        meta: {
          title: '题目列表',
          guidePath: true,
          jumpPath: '/sheet/list',
        }
      },
      {
        path: '/InvenSet',
        name: '量表设置',
        component: () => import('@/components/InventoryMana/InvenSet/InvenSet.vue'),
        meta: {
          title: '量表设置',
          guidePath: true,
          jumpPath: '/sheet/list',
        }
      },
      {
        path: '/addAdvice',
        name: '新增建议评语',
        component: () => import('@/components/InventoryMana/InvenSet/AddAdivice.vue'),
        meta: {
          title: '新增建议评语',
          guidePath: true,
          jumpPath: '/sheet/list',
        }
      },
      {
        path: '/editAdvice',
        name: '修改建议评语',
        component: () => import('@/components/InventoryMana/InvenSet/EditAdive.vue'),
        meta: {
          title: '修改建议评语'
        }
      },
      {
        path: '/InvenAnalyze',
        name: '量表分析',
        component: () => import('@/components/InventoryMana/InvenAnalyze.vue'),
        meta: {
          title: '量表分析'
        }
      },
      {
        path: '/sheet/suggestion',
        name: '建议库',
        component: () => import('@/components/InventoryMana/Suggestion.vue'),
        meta: {
          title: '建议库'
        }
      },
      {
        path: '/sheet/lable',
        name: '标签库',
        component: () => import('@/components/InventoryMana/LableBank.vue'),
        meta: {
          title: '标签库'
        }
      },
      {
        path: '/sheet/DivisorSetSugg',
        name: '关联因子建议',
        component: () => import('@/components/InventoryMana/InvenSet/DivisorSetSugg.vue'),
        meta: {
          title: '关联因子建议',
          guidePath: true,
          jumpPath: '/sheet/list',
        }
      },
    ]
  },
]

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
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