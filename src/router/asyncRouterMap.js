import Layout from '@/layout'
const asyncRouter = [
    {
        path: '/project',
        component: Layout,
        name:"project",
        meta: {
            title: '项目管理',
            icon: 'project'
        },
        redirect:'noRedirect',
        children: [
            {
                path: 'projectList',
                component: () => import('@/views/project/projectList'),
                name: 'projectList',
                hidden: false,
                meta: { title: '项目列表', noCache: true ,role:[1,2,3,4]},
                children:[
                    {
                        path:'addProject',
                        component: () => import('@/views/project/projectForm'),
                        name: 'addProject',
                        hidden: true,
                        meta: { title: '新增项目', noCache: true },
                    },
                    {
                        path:'editProject/:id',
                        component: () => import('@/views/project/projectForm'),
                        name: 'editProject',
                        hidden: true,
                        meta: { title: '编辑项目', noCache: true },
                    },
                    {
                        path:'checkProject/:id',
                        component: () => import('@/views/project/projectCheck'),
                        name: 'checkProject',
                        hidden: true,
                        meta: { title: '查看项目', noCache: true },
                    },
                    {
                        path:'monitorManager/:id',
                        component: () => import('@/views/project/monitorManager'),
                        name: 'monitorManager',
                        hidden: true,
                        meta: { title: '监测点管理', noCache: true },
                    }
                ]
            },
            {
                path: 'setThreshold',
                component: () => import('@/views/project/setThreshold'),
                name: 'setThreshold',
                hidden: false,
                meta: { title: '标准阈值设置', noCache: true ,role:[5,6]},
                children:[
                    {
                        path:'thresholdEdit/:id',
                        component: () => import('@/views/project/thresholdEdit'),
                        name: 'thresholdEdit',
                        hidden: true,
                        meta: { title: '阈值设置', noCache: true },
                    }
                ]
            },
            {
                path: 'earlyWarning',
                component: () => import('@/views/project/earlyWarning'),
                name: 'earlyWarning',
                hidden: false,
                meta: { title: '项目预警设置', noCache: true ,role:[7,8]},
                children:[
                    {
                        path:'setWarning/:id',
                        component: () => import('@/views/project/setWarning'),
                        name: 'setWarning',
                        hidden: true,
                        meta: { title: '预警设置', noCache: true },
                    }
                ]
            },
            {
                path: 'customerWarning',
                component: () => import('@/views/project/communication'),
                name: 'customerWarning',
                hidden: false,
                meta: { title: '预警警报', noCache: true ,role:[9,10]},
                children:[
                    {
                        path:'customerMsg/:id',
                        component: () => import('@/views/project/msgDetail'),
                        name: 'customerMsg',
                        hidden: true,
                        meta: { title: '消息', noCache: true },
                    }
                ]
            },
            {
                path: 'solution',
                component: () => import('@/views/project/communication'),
                name: 'solution',
                hidden: false,
                meta: { title: '解决方案', noCache: true ,role:[11,12]},
                children:[
                    {
                        path:'solutionMsg/:id',
                        component: () => import('@/views/project/msgDetail'),
                        name: 'solutionMsg',
                        hidden: true,
                        meta: { title: '消息', noCache: true },
                    }
                ]
            }
        ]
    },
    {
        path: '/assessment',
        component: Layout,
        name:"assessment",
        meta: {
            title: '预评估管理',
            icon: 'assessment'
        },
        redirect:'noRedirect',
        children: [
            {
                path: 'assessmentManager',
                component: () => import('@/views/assessment/assessmentManager'),
                name: 'assessmentManager',
                hidden: false,
                meta: { title: '预评估管理', noCache: true ,role:[13]},
                children: [
                    {
                        path: 'assessmentSet/:id',
                        component: () => import('@/views/assessment/assessmentSet'),
                        name: 'assessmentSet',
                        hidden: true,
                        meta: { title: '预评估设置', noCache: true },
                    }
                ]
            }
        ]
    },
    {
        path: '/memberManager',
        component: Layout,
        name:"memberManager",
        meta: {
            title: '客户管理',
            icon: 'member'
        },
        redirect:'noRedirect',
        children: [
            {
                path: 'memberList',
                component: () => import('@/views/memberManager/memberList'),
                name: 'memberList',
                hidden: false,
                meta: { title: '客户列表', noCache: true ,role:[14,15,16]},
                children: [
                    {
                        path: 'memberDetail/:id',
                        props: true,
                        component: () => import('@/views/memberManager/memberDetail'),
                        name: 'memberDetail',
                        hidden: true,
                        meta: { title: '客户详情', noCache: true }
                    }
                ]
            }
        ]
    },
    {
        path: '/order',
        component: Layout,
        name:"order",
        meta: {
            title: '订单管理',
            icon: 'member'
        },
        redirect:'noRedirect',
        children: [
            {
                path: 'orderManager',
                component: () => import('@/views/order/orderManager'),
                name: 'orderManager',
                hidden: false,
                meta: { title: '订单管理',noCache: true ,role:[17,18,19,20,21]},
                children: [
                    {
                        path: 'orderDetail/:id',
                        component: () => import('@/views/order/orderDetail'),
                        name: 'orderDetail',
                        hidden: true,
                        meta: { title: '订单详情', noCache: true },
                    }
                ]
            }
        ]
    },
    {
        path: '/inventoryManager',
        component:Layout,
        name:'inventoryManager',
        redirect:'noRedirect',
        meta:{
            title:'库存管理',
            icon: 'inventory'
        },
        children: [
            {
                path: 'warehouse',
                component: () => import('@/views/inventoryManager/warehouse'),
                name: 'warehouse',
                hidden: false,
                meta: { title: '仓库管理', noCache: true ,role:[22,23]},
            },
            {
                path: 'equipment',
                component: () => import('@/views/inventoryManager/equipment'),
                name: 'equipment',
                hidden: false,
                meta: { title: '设备管理', noCache: true ,role:[24,25,26,27]},
            }
        ]
    },
    {
        path: '/financialManagement',
        component:Layout,
        name:'financialManagement',
        redirect:'noRedirect',
        meta:{
            title:'财务管理',
            icon: 'financial'
        },
        children: [
            {
                path: 'financialList',
                component: () => import('@/views/financialManagement/financialList'),
                name: 'financialList',
                hidden: false,
                meta: { title: '财务管理', noCache: true ,role:[28,29,30]},
                children:[
                    {
                        path:'financialDetail/:id',
                        component: () => import('@/views/financialManagement/financialDetail'),
                        name: 'financialDetail',
                        hidden: true,
                        meta: { title: '财务详情', noCache: true },
                    }
                ]
            }
        ]
    },
    {
        path: '/dataAnalysis',
        component:Layout,
        name:'dataAnalysis',
        redirect:'/dataAnalysis/inquire',
        meta:{
            title:'数据报表',
            icon: 'data'
        },
        children: [
            {
                path: 'inquire',
                component: () => import('@/views/dataAnalysis/inquire'),
                name: 'inquire',
                hidden: false,
                meta: { title: '数据查询', noCache: true ,role:[31]},
                children:[
                    {
                        path:'inquireDetail/:id',
                        component: () => import('@/views/dataAnalysis/inquireDetail'),
                        name: 'inquireDetail',
                        hidden: true,
                        meta: { title: '数据详情', noCache: true },
                    }
                ]
            },
            {
                path: 'analysis',
                component: () => import('@/views/dataAnalysis/analysis'),
                name: 'analysis',
                hidden: false,
                meta: { title: '数据分析', noCache: true ,role:[32,33]},
                children:[
                    {
                        path:'areaChart/:idlist',
                        component: () => import('@/views/dataAnalysis/areaChart'),
                        name: 'areaChart',
                        hidden: true,
                        meta: { title: '数据对比', noCache: true },
                    },
                    {
                        path:'analysisDetail/:id',
                        component: () => import('@/views/dataAnalysis/analysisDetail'),
                        name: 'analysisDetail',
                        hidden: true,
                        meta: { title: '数据详情', noCache: true },
                    }
                ]
            }
        ]
    },
    {
        path: '/sysManagement',
        component:Layout,
        name:'sysManagement',
        redirect:'noRedirect',
        meta:{
            title:'系统管理',
            icon: 'sys'
        },
        children: [
            {
                path: 'userManagement',
                component: () => import('@/views/sysManagement/userManagement'),
                name: 'userManagement',
                hidden: false,
                meta: { title: '账号管理', noCache: true ,role:[34,35,36]}
            },
            {
                path: 'roleManagement',
                component: () => import('@/views/sysManagement/roleManagement'),
                name: 'roleManagement',
                hidden: false,
                meta: { title: '角色管理', noCache: true ,role:[37,38]},
                children:[
                    {
                        path:'editRole/:id',
                        component: () => import('@/views/sysManagement/editRole'),
                        name: 'editRole',
                        hidden: true,
                        meta: { title: '编辑角色', noCache: true },
                    }
                ]
            },
            {
                path: 'Troubleshooting',
                component: () => import('@/views/sysManagement/Troubleshooting'),
                name: 'Troubleshooting',
                hidden: false,
                meta: { title: '故障排查', noCache: true ,role:[39]}
            },
            {
                path: 'dictionary',
                component: () => import('@/views/sysManagement/dictionary'),
                name: 'dictionary',
                hidden: false,
                meta: { title: '字典管理', noCache: true ,role:[40]}
            },
            {
                path: 'loginLog',
                component: () => import('@/views/sysManagement/loginLog'),
                name: 'loginLog',
                hidden: false,
                meta: { title: '登录日志', noCache: true ,role:[41]}
            }
        ]
    },
    // {
    //     path: '/large',
    //     // component:Layout,
    //     component: () => import('@/views/largeSize/largeLayout'),
    //     name:'large',
    //     redirect:'noRedirect',
    //     hidden:true,
    //     meta:{
    //         title:'大屏',
    //         icon: 'financial'
    //     },
    //     children: [
    //         {
    //             path: 'index',
    //             component: () => import('@/views/largeSize/index'),
    //             name: 'largeIndex',
    //             hidden: false,
    //             meta: { title: '大屏首页', noCache: true, hideNav:true }
    //         },
    //         {
    //             path: 'largeWarningDetail',
    //             component: () => import('@/views/largeSize/largeWarningDetail'),
    //             name: 'largeWarningDetail',
    //             hidden: false,
    //             meta: { title: '预警警报详情', noCache: true, hideNav:true }
    //         },
    //         {
    //             path: 'estimatedDetail/:id',
    //             component: () => import('@/views/largeSize/estimatedDetail'),
    //             name: 'estimatedDetail',
    //             hidden: false,
    //             meta: { title: '预估值详情', noCache: true, hideNav:true }
    //         },
    //         {
    //             path: 'areaDetail/:id',
    //             component: () => import('@/views/largeSize/areaDetail'),
    //             name: 'areaDetail',
    //             hidden: false,
    //             meta: { title: '监测点详情', noCache: true, hideNav:true }
    //         },
    //         {
    //             path: 'dataComparison/:id',
    //             component: () => import('@/views/largeSize/dataComparison'),
    //             name: 'dataComparison',
    //             hidden: false,
    //             meta: { title: '监测点数据对比', noCache: true, hideNav:true }
    //         }
    //     ]
    // },
    { path: '*', redirect: '/404', hidden: true }
]


export default asyncRouter