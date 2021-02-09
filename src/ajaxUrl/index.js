
const ajaxUrl = {
    userInfo:'/api/v1/user',        //获取用户信息
    authority:'/api/v1/userpermissions/',        //获取当前用户权限列表
    allAuthority:'/api/v1/permissions',        //获取所有权限列表
    updateToken:'/api/v1/authorizations/current',       //刷新token
    login:'/api/v1/authorizations',         //用户登录
    logOut:'/api/v1/authorizations/current',    //退出登录
    uploadFile:'/api/v1/public/file',           //上传文件
    checkPassword:'/api/v1/user/checkpassword',     //检测当前用户密码是否正确
    indexCount:'/api/v1/public/getIndexCount',      //首页数据统计
    getIndexNewProjectCount:'/api/v1/public/getIndexNewProjectCount',   //首页新增项目数据
    getIndexOrderSale:'/api/v1/public/getIndexOrderSale',   //首页订单数/销售额 数据

    projectsCount:'/api/v1/projects/count',     //项目列表 - 统计
    projectsList:'/api/v1/projects',        //项目列表 - 列表
    projectsInfo:'/api/v1/projects/',       //查看项目 - 详情
    areaList:'/api/v1/projects/',   //查看项目 - 监测点列表
    projectThresholdsList:'/api/v1/public/thresholds',     //监测标准列表
    updateProjects:'/api/v1/projects/',             //编辑项目
    addPorjects:'/api/v1/projects',         //新增项目
    positionsInfo:'/api/v1/projects/',      //监测点详情
    positionStatusChange:'/api/v1/position/',   //启用/停用 监测点
    addPosition:'/api/v1/position',         //新增点位
    editPosition:'/api/v1/position/',       //修改点位信息
    areasList:'/api/v1/public/areas',    //获取项目区域列表
    devicesList:'/api/v1/public/devices',       //项目设备列表
    areaLocation:'/api/v1/projects/',           //区域点位信息

    thresholdsList:'/api/v1/thresholds',        //监测标准列表
    thresholdsInfo:'/api/v1/thresholds/',       //监测标准阈值详情
    addThresholds:'/api/v1/thresholds',     //新增监测标准
    editThresholds:'/api/v1/thresholds/',       //编辑监测标准(修改状态)

    projectsWarning:'/api/v1/projects',        //项目预警列表
    warningSet:'/api/v1/projects/',             //预警条件设置
    addProjectsWarning:'/api/v1/projects/',                 //新增项目预警阈值
    editProjectsWarning:'/api/v1/projects/',        //修改项目预警阈值
    earlyWarningList:'/api/v1/warnigs',             //预警警报列表
    warningDetail:'/api/v1/warnigs/',               //预警警报详情
    warningMsgist:'/api/v1/warnigssms',              //预警消息/解决方案 消息列表
    sendWarningMsg:'/api/v1/warnigs/',           //发送消息
    editWarningMsg:'/api/v1/warnigs/',          //编辑消息

    assessmentList:'/api/v1/preinstall',     //预评估列表
    assessmentDetail:'/api/v1/preinstall/',     //预评估详情
    importAssessment:'/api/v1/preinstall/',       //导入预评估设置

    storeHouses:'/api/v1/storehouses',      //仓库列表
    addStoreHouse:'/api/v1/storehouses',         //新增仓库
    updateStoreStatus:'/api/v1/storehouses/',   //改变仓库状态
    editStoreHouse:'/api/v1/storehouses/',       //编辑仓库
    delStoreHouse:'/api/v1/storehouses/',       //删除仓库
    deviceList:'/api/v1/device',            //设备列表
    addDevice:'/api/v1/device',         //添加设备
    editDevice:'/api/v1/device/',           //编辑设备
    recycleDevice:'/api/v1/device/',        //回收设备
    deviceCount:'/api/v1/device/count',                 //设备统计
    importDevice:'/api/v1/device/import',       //批量导入设备
    noUserDevice:'/api/v1/public/getAllNoCustomerDevicesList',      //获取所有未绑定客户的设备
    stateChange:'/api/v1/device',  //设备开关机

    financialCount:'/api/v1/finance/count',     //财务管理-统计
    financialList:'/api/v1/finance',        //财务管理-列表
    financialInfo:'/api/v1/finance/',       //财务管理-详情
    financialMethods:'/api/v1/finance/',       //财务管理-收款/退款
    financialLog:'/api/v1/finance/',     //财务详情 - 收退款列表

    orderCount:'/api/v1/orders/count',      //订单管理--统计
    orderList:'/api/v1/orders',         //订单管理 -- 列表
    addOrder:'/api/v1/orders',          //新增订单
    editOrder:'/api/v1/orders/',        //订单编辑
    orderInfo:'/api/v1/orders/',       //订单查看
    cancelOrder:'/api/v1/orders/',      //取消订单
    orderSend:'/api/v1/orders/',        //订单管理 - 发货

    positionsList:'/api/v1/data',       //所有监测点列表
    positionDatas:'/api/v1/positiondatas',           //监测点数据详情
    exportDatas:'/api/v1/positiondatas/export',     //导出数据

    roleList:'/api/v1/role',            //系统管理 - 角色列表
    addRole:'/api/v1/role/',            //系统管理 - 新增角色
    editRole:'/api/v1/role/',           //系统管理 - 编辑角色
    usersList:'/api/v1/users',          //系统管理 - 用户列表
    rolePermissions:'/api/v1/role/',      //单个角色的权限
    addUsers:'/api/v1/users',           //新增用户
    editUsers:'/api/v1/users/',         //编辑用户
    checkUsername:'/api/v1/user/check',     //检查用户名是否重复
    customsList:'/api/v1/customers',        //获取客户列表
    customsDetail: "/api/v1/customers",     // 客户详情
    addCustoms:'/api/v1/customers',         //新增客户
    editCustoms:'/api/v1/customers/',       //编辑客户
    loginLog:'/api/v1/usersloginlog',        //登录日志
    dictionaryList:'/api/v1/dictories',     //字典管理列表
    editDictionary:'/api/v1/dictories/',    //编辑字典项目值
    breakDownList:'/api/v1/breakdown',      //故障排查

    messageList:'/api/v1/message',      //消息中心列表
    delMessage:'/api/v1/message/',      //删除消息
    noReadCount:'/api/v1/message/noreadcount',      //未读消息条数

    largeIndexProject:'/api/v1/public/getIndexProjectList',       //大屏首页 项目列表
    largeIndexArea:'/api/v1/public/getIndexProjectAreaList',         //大屏右侧 区域列表
    positionLastMsg:'/api/v1/warnigs/',         //大屏 预警警报-改善建议
    getNewPositionData:'/api/v1/public/getNewPositionData',     //获取点位最新数据
    getNewPosition:'/api/v1/public/getNewPosition',      //获取用户最新的监测点信息
    getPositionDatasHead:'/api/v1/positiondatashead',
    getNewSmallPositionDatas :'api/v1/public/getNewPositionDatas',

    downloadTemlpate:'/device.xlsx',            //下载设备导入模板
    downloadAssessmengt:'/preinstall.xlsx',     //下载预评估导入模板
}
export default ajaxUrl
