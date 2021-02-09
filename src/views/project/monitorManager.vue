<template>
    <div class="monitorManager">
        <div class="project-item">
            <div class="item-title">项目信息</div>
            <ul class="info-list">
                <li>
                    <span>项目编号</span>
                    <span>{{monitorInfo.number}}</span>
                </li>
                <li>
                    <span>项目名称</span>
                    <span>{{monitorInfo.name}}</span>
                </li>
                <li>
                    <span>所属客户</span>
                    <span>{{monitorInfo.customs[0] && monitorInfo.customs[0].company_name}}</span>
                </li>
                <li>
                    <span>项目地址</span>
                    <span>{{monitorInfo.address}}</span>
                </li>
                <li>
                    <span>项目状态</span>
                    <span class="monitor-status text-dot" :class="'color' + monitorInfo.status">{{publicObj.projectStatus[monitorInfo.status]}}</span>
                </li>
                <li>
                    <span>创建时间</span>
                    <span>2020-05-30 13:03:56</span>
                </li>
            </ul>
        </div>
        <div class="project-item">
            <div class="item-title">
                <span>点位信息</span>
                <el-button size="small" @click="handleAddMoitor">+新增点位</el-button>
            </div>
            <ul class="monitor-list">
                <li class="monitor-item" v-for="(item,idx) in monitorList" :key="item.id + '' + idx">
                    <div class="monitor-id">
                        <span>
                            <span>{{item.number}}</span>
                            <span v-if="item.status!==0" class="text-dot" :class="item.status===1 ? 'start' : 'stop'">{{item.status===1 ? '已启用' : '已停用'}}</span>
                        </span>
                        <el-button type="text" v-if="item.status===0" @click="handleDelMonitor(idx)"><i class="el-icon-delete"></i>删除</el-button>
                        <el-button type="text" v-if="item.status===1" @click="handleChangeStatus(idx,item,2)"><i class="el-icon-video-pause"></i>停用</el-button>
                        <el-button type="text" v-if="item.status===2" @click="handleChangeStatus(idx,item,1)"><i class="el-icon-video-play"></i>启用</el-button>
                    </div>
                    <div class="detail-list">
                        <div class="detail-item">
                            <span class="detail-tit required">点位名称</span>
                            <el-input :disabled="item.status===2" v-model.trim="item.name" type="text" placeholder="请输入点位名称" size="small" style="width:320px;"></el-input>
                        </div>
                        <div class="detail-item">
                            <span class="detail-tit required">所在区域</span>
                            <el-select :disabled="item.status===2" v-model="item.area_id" placeholder="请选择" size="small">
                                <el-option v-for="item in areasList" :key="item.id" :label="item.area_name" :value="item.id"></el-option>
                            </el-select>
                            <el-button size="small" v-if="item.status!==2" @click="handleEditPosition(item,idx)">编辑点位</el-button>
                        </div>
                        <div class="detail-item">
                            <span class="detail-tit required">绑定产品</span>
                            <el-select disabled value="1" placeholder="请选择" size="small">
                                <el-option label="全能空气检测器" value="1"></el-option>
                                <el-option label="不全能的检测器" value="2"></el-option>
                            </el-select>
                        </div>
                        <div class="detail-item">
                            <span class="detail-tit required">绑定设备</span>
                            <el-input disabled size="small" style="width:200px;" v-if="item.status===2" :value="item.device.device_number"></el-input>
                            <el-select v-if="item.status!==2" v-model="item.device_id" placeholder="请选择" size="small">
                                    <!-- :disabled="deviceItem.position_flg===1 && deviceItem.run_status===1"   -->
                                <el-option v-for="deviceItem in devicesList" 
                                    v-show="!(deviceItem.position_flg===1 && deviceItem.run_status===1)"
                                    :key="deviceItem.id" 
                                    :label="deviceItem.device_number" 
                                    :value="deviceItem.id"></el-option>
                            </el-select>
                        </div>
                        <div class="detail-btn" v-if="item.status!==2">
                            <el-button type="primary" size="small" @click="handleSavePosition(idx,item)">保存</el-button>
                            <!-- <el-button size="small" @click="handleCanclePosition(idx,item)">取消</el-button> -->
                        </div>
                    </div>
                </li>
            </ul>
            <div class="monitor-btn">
                <el-button size="small" @click="$router.replace({name:'projectList'})">返回</el-button>
            </div>
        </div>
        <el-dialog 
            :visible.sync="dialogVisible" 
            :close-on-click-modal='false'
            width="40%">
            <div class="monitor-position">
                <div class="position-title">
                    <strong>编辑点位</strong>
                    请拖动<span class="blue">蓝色坐标</span>确定设备位置(<span class="red">红色</span>为其他设备)
                </div>
                <monitor-position :options="options" @determine="handleDetermine"/>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import monitorPosition from '@/components/Public/monitorPosition'
import request from "@/utils/request";
export default {
    name:'monitorManager',
    data(){
        return {
            monitorList:[],      //status  0 新增的点位  1 已启用  -1 已停用
            areasList:[],       //区域列表
            devicesList:[],     //可选设备列表
            monitorIdx:0,
            dialogVisible:false,
            options:{
                img:'',
                others:[],
                position:{
                    left:'',
                    top:''
                }
            },
            project_id:'',
            monitorInfo:{
                customs:[],
            },
            defaultMonitorList:[],     //页面初始化时的点位信息(取消设置点位信息时  将点位信息 还原)
            lastNumber:0,
            customer_id:''
        }
    },
    created(){
        this.project_id = this.$route.params.id;
        this.getMonitorInfo();
        this.getAreasList();
    },
    methods:{
        // 获取该项目区域列表
        getAreasList(){
            request(this.ajaxUrl.areasList,{
                project_id:this.project_id
            },'get').then((res)=>{
                this.areasList = res;
            }).catch((err)=>{
                console.log(err);
            })
        },
        // 获取用户可选设备列表
        getDevicesList(){
            request(this.ajaxUrl.devicesList,{
                customer_id:this.customer_id
            },'get').then((res)=>{
                this.devicesList = res;
            }).catch((err)=>{
                console.log(err);
            })
        },
        // 获取监测点信息
        getMonitorInfo(){
            request(this.ajaxUrl.positionsInfo + this.project_id + '/positions',{

            },'get').then((res)=>{
                let numberList = [];
                this.monitorInfo = res;
                this.monitorList = res.position.map((item)=>{
                    numberList.push(item.number.slice(-5));
                    item.position = {};
                    return item
                });
                this.lastNumber =numberList.length===0 ? 0 : Math.max(...numberList);      //获取当前 点位中 编号最大的一个的值
                this.defaultMonitorList = JSON.parse(JSON.stringify(this.monitorList));
                this.customer_id = res.customs[0].id;
                this.getDevicesList();
            }).catch((err)=>{
                console.log(err);
            })
        },
        // 保存单个监测点信息
        handleSavePosition(idx,item){
            if(item.id){        //编辑时的保存
                if(JSON.stringify(item) === JSON.stringify(this.defaultMonitorList[idx])){
                    this.$message.warning('未做任何更改');
                }else{
                    if(!this.checkPosition(item)){return;}
                    request(this.ajaxUrl.editPosition + item.id,{
                        project_id:item.project_id,
                        number:item.number,
                        name:item.name,
                        device_id:item.device_id,
                        area_id:item.area_id,
                        left:item.position.left,
                        top:item.position.top,
                        status:item.status
                    },'put').then((res)=>{
                        this.$message.success('点位信息修改成功');
                        this.defaultMonitorList[idx] = res;
                        this.getDevicesList();      //更新可选设备
                    }).catch((err)=>{
                        console.log(err);
                    })
                }
            }else{          //新增时的保存
                if(!this.checkPosition(item)){return;}
                request(this.ajaxUrl.addPosition,{
                    project_id:item.project_id,
                    number:item.number,
                    name:item.name,
                    device_id:item.device_id,
                    area_id:item.area_id,
                    left:item.position.left,
                    top:item.position.top
                }).then((res)=>{
                    item.status = 1;
                    item.id = res.id;
                    this.getDevicesList();      //更新可选设备
                    this.$message.success('点位信息保存成功');
                }).catch((err)=>{
                    console.log(err);
                })
            }
        },
        // 检测点位必填项
        checkPosition(positionItem){
            if(!positionItem.name){
                this.$message.warning('请输入点位名称');
                return false
            }
            if(!positionItem.area_id){
                this.$message.warning('请选择所在区域');
                return false
            }
            if(!positionItem.device_id){
                this.$message.warning('请选择绑定设备');
                return false
            }
            if(positionItem.position.left === '' || positionItem.position.top === ''){
                this.$message.warning('请设置点位位置');
                return false
            }
            return true
        },
        // 取消保存单个监测点信息
        // handleCanclePosition(idx,item){
        //     console.log(idx,item);
        // },
        //新增点位
        handleAddMoitor(){
            let positionNum = this.monitorInfo.number + ('0000' + (++this.lastNumber)).slice(-5);
            this.monitorList.unshift({
                id:'',
                number:positionNum,
                name:'',
                area_id:'',
                project_id:this.project_id,
                device_id:'',   //绑定的设备
                status:0,
                position:{
                    left:'',
                    top:''
                }
            })
        },
        // 删除点位
        handleDelMonitor(idx){
            this.$confirm('删除后数据无法恢复，请谨慎操作', '确定删除点位', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.monitorList.splice(idx,1);
            }).catch(() => {});
        },
        // 停用/启用点位
        handleChangeStatus(idx,item,changeStatus){
            let txt = changeStatus === 1 ? '确定启用该点位？' : '确定停用该点位？';
            this.$confirm(txt,(changeStatus===1 ? '启用' : '停用') + '点位', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                request(this.ajaxUrl.positionStatusChange + item.id + '/status',{
                    status:changeStatus
                },'put').then((res)=>{
                    this.monitorList[idx].status = changeStatus;
                    this.getDevicesList();
                }).catch((err)=>{
                    console.log(err);
                })
            }).catch(() => {});
        },
        // 编辑点位
        handleEditPosition(item,idx){
            if(!item.area_id){
                this.$message.warning('请先选择区域');
                return;
            }
            request(this.ajaxUrl.areaLocation + item.project_id + '/area/' + item.area_id + '/location',{

            },'get').then((res)=>{
                this.monitorIdx = idx;
                this.options.img = res.area.file.path;
                this.dialogVisible = true;
                if(item.id){
                    console.log(item);
                    let localPosition = {},otherPosition = [];
                    res.all_device.map((childItem)=>{
                        if(item.id == childItem.position_id){
                            localPosition = childItem;
                        }else{
                            otherPosition.push(childItem);
                        }
                    });
                    this.options.position.left = localPosition.left;
                    this.options.position.top = localPosition.top;
                    this.options.others = JSON.parse(JSON.stringify(otherPosition));
                }else{
                    console.log('新增点位');
                    this.options.others = res.all_device;
                }
            }).catch((err)=>{
                console.log(err);
            })
        },
        // 确定/取消设置点位
        handleDetermine(position){
            this.dialogVisible = false;
            if(position){
                this.monitorList[this.monitorIdx].position.left = position.left;
                this.monitorList[this.monitorIdx].position.top = position.top;
            }
        },
    },
    components:{
        monitorPosition
    }
}
</script>
<style lang="scss" scoped>
.monitorManager{
    .project-item{
        width: 100%;
        padding: 24px 22px;
        background-color: #fff;
        border-radius: 4px;
        margin-bottom: 20px;
        .item-title{
            font-size: 14px;
            margin-bottom: 20px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .monitor-status{
            &.color0,&.color1{
                color: #ffc13a;
                &::before{
                    background-color: #ffc13a;
                }
            }
            &.color4,&.color5,&.color6{
                color: #29cc85;
                &::before{
                    background-color: #29cc85;
                }
            }
            &.color2{
                color: #3e46ae;
                &::before{
                    background-color: #3e46ae;
                }
            }
            &.color3,&.color7{
                color: #DC143C;
                &::before{
                    background-color: #DC143C;
                }
            }
        }
        .info-list{
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            height: 120px;
            >li{
                font-size: 12px;
                color: #000;
                width: 50%;
                display: flex;
                line-height: 30px;
                margin-right: 20px;
                border-right: 1px solid #ddd;
                >span{
                    display: inline-block;
                    text-align: left;
                    &:nth-of-type(1){
                        width: 85px;
                        color: #979797;
                    }
                    &:nth-of-type(2){
                        flex: 1;
                    }
                }
                &:nth-of-type(5){
                    border-right: none;
                }
                &:nth-of-type(6){
                    border-right: none;
                }
            }
        }
        .monitor-list{
            width: 100%;
            padding-bottom: 32px;
            border-bottom: 1px solid #ddd;
            li{
                width: 100%;
                border: 1px solid #ddd;
                border-radius: 4px;
                margin-bottom: 20px;
                .monitor-id{
                    height: 40px;
                    line-height: 40px;
                    background-color: #f5f5f5;
                    padding: 0 20px;
                    display: flex;
                    justify-content: space-between;
                    >span{
                        font-size: 12px;
                        color: #000;
                        >span{
                            &:nth-of-type(1){
                                font-weight: 600;
                            }
                            &:nth-of-type(2){
                                margin-left: 15px;
                                padding-left: 15px;
                                position: relative;
                                &.stop{
                                    color: #3e46ae;
                                    &::before{
                                        background-color: #3e46ae;
                                    }
                                }
                                &.start{
                                    color: #29cc85;
                                    &::before{
                                        background-color: #29cc85;
                                    }
                                }
                            }
                        }
                    }
                    i{
                        margin-right: 5px;
                    }
                }
                .detail-list{
                    padding: 10px 20px 20px 20px;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    .detail-item{
                        width: 50%;
                        font-size: 12px;
                        margin-bottom: 18px;
                        .detail-tit{
                            width: 85px;
                            color: #959595;
                        }
                        &:nth-of-type(3),&:nth-of-type(4){
                            margin-bottom: 0;
                        }
                    }
                    .detail-btn{
                        width: 100%;
                        padding-left: 85px;
                        margin-top: 18px;
                    }
                }
            }
        }
        .monitor-btn{
            margin-top: 20px;
        }
    }
    .monitor-position{
        width: 100%;
        .position-title{
            font-size: 12px;
            color: #b6b6b6;
            strong{
                font-size: 14px;
                font-weight: 600;
                color: #000;
                margin-right: 10px;
            }
            .blue{
                color: #6570ff;
            }
            .red{
                color: #ff6e6e;
            }
        }
        .drawing-box{
            width: 100%;
            position: relative;
            >img{
                width: 100%;
            }
        }
    }
}
</style>


