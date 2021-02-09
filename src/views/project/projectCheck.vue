<template>
    <div class="projectCheck mainPage">
        <div class="project-item">
            <div class="item-title">项目信息</div>
            <ul class="info-list">
                <li>
                    <span>项目编号</span>
                    <span>{{projectInfo.number}}</span>
                </li>
                <li>
                    <span>项目名称</span>
                    <span>{{projectInfo.name}}</span>
                </li>
                <li>
                    <span>所属客户</span>
                    <span>{{projectInfo.customs[0] && projectInfo.customs[0].company_name}}</span>
                </li>
                <li>
                    <span>项目地址</span>
                    <span>{{projectInfo.address}}</span>
                </li>
                <li>
                    <span>项目负责人</span>
                    <span>{{projectInfo.project_manage_name}}</span>
                </li>
                <li>
                    <span>负责人电话</span>
                    <span>{{projectInfo.project_manage_tel}}</span>
                </li>
                <li>
                    <span>设备管理人</span>
                    <span>{{projectInfo.device_manage_name}}</span>
                </li>
                <li>
                    <span>管理人电话</span>
                    <span>{{projectInfo.device_manage_tel}}</span>
                </li>
                <li>
                    <span>项目备注</span>
                    <span>{{projectInfo.memo}}</span>
                </li>
                <li>
                    <span>创建时间</span>
                    <span>{{projectInfo.created_at}}</span>
                </li>
                <li>
                    <span>开始时间</span>
                    <span>{{projectInfo.start_time}}</span>
                </li>
                <li>
                    <span>结束时间</span>
                    <span>{{projectInfo.end_time}}</span>
                </li>
            </ul>
        </div>
        <div class="project-item">
            <div class="item-title">项目状态</div>
            <el-steps :active="nowStage" align-center>
                <el-step v-for="(item,idx) in projectInfo.stages" :key="idx" :title="item.stage_name" :description="item.start_date"></el-step>
            </el-steps>
        </div>
        <div class="project-item">
            <div class="item-title">监测点详情</div>
            <el-table
                :data="tableContent"
                border
                style="width: 100%">
                <el-table-column
                    align="left"
                    prop="name"
                    label="监测点名称">
                </el-table-column>
                <el-table-column
                    prop="address"
                    align="left"
                    label="所处区域">
                    <template slot-scope="scope">
                        {{scope.row.area && scope.row.area.area_name}}
                    </template>
                </el-table-column>
                <el-table-column
                    align="left"
                    label="设备ID">
                    <template slot-scope="scope">
                        {{scope.row.device && scope.row.device.device_number}}
                    </template>
                </el-table-column>
                <el-table-column
                    align="left"
                    label="监测点状态"
                    width="180">
                    <template slot-scope="scope">
                        <div class="table-status"><span :class="'color' + scope.row.status">{{scope.row.status == 1 ? '使用中' : '已停止'}}</span></div>
                    </template>
                </el-table-column>
                <el-table-column
                    align="left"
                    label="设备电量"
                    width="120">
                    <template slot-scope="scope">
                        <div class="device-soc" v-if="scope.row.device">
                            <span v-if="scope.row.status == 1" :class="scope.row.device.soc&&scope.row.device.soc<=20 ? 'warning' : ''">{{scope.row.device.soc ? scope.row.device.soc + '%' : '--'}}</span>
                            <span v-else>--</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    align="left"
                    label="信号强度"
                    width="120">
                    <template slot-scope="scope">
                        <div class="device-soc" v-if="scope.row.device">
                            <span>{{scope.row.device.rssi || '--'}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    align="left"
                    label="操作"
                    width="120">
                    <template slot-scope="scope">
                        <el-button type="text" @click="$router.push({name:'inquireDetail',params:{id:scope.row.id}})">查看数据</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <myPagination :pageInfo="pageInfo" @current-change="pageChange"/>
        </div>
    </div>
</template>
<script>
import myPagination from '@/components/Public/myPagination'
import request from "@/utils/request";
export default {
    name:"projectCheck",
    data(){
        return {
            id:this.$route.params.id,
            projectInfo:{
                stages:[],
                customs:[]
            },
            tableContent:[],
            pageInfo:{
				total:0,
				pageSize:20,
				currentPage:1,
            },
            nowStage:1
        }
    },
    created(){
        this.getProjectInfo();
        this.getPositionList();
    },
    methods:{
        // 获取 项目详情
        getProjectInfo(){
            request(this.ajaxUrl.projectsInfo + this.id,{

            },'get').then((res)=>{
                this.projectInfo = res;
                this.projectInfo.stages.push({
                    stage_name:'项目结束',
                    start_date:res.stages[res.stages.length-1].end_date
                })
                if(res.status === 2){
                    this.nowStage = res.stages.length
                }else{
                    res.stages.map((item,idx)=>{
                        if(item.id === res.stage_id){
                            this.nowStage = idx+1
                        }
                    })
                }
            }).catch((err)=>{
                console.log(err);
            })
        },
        // 获取监测点列表
        getPositionList(){
            request(this.ajaxUrl.areaList + this.id + '/area',{
                page:this.pageInfo.currentPage,
                pageSize:this.pageInfo.pageSize
            },'get').then((res)=>{
                this.pageInfo.total = res.total;
                this.tableContent = res.data;
            }).catch((err)=>{
                console.log(err);
            })
        },
        // 翻页
        pageChange(val){
            this.pageInfo.currentPage = val;
            this.getPositionList();
        }
    },
    components:{
        myPagination
    }
}
</script>
<style rel="stylesheet/scss" lang="scss">
    .projectCheck{
        font-size: 14px;
        .project-item{
            width: 100%;
            padding: 24px 22px;
            background-color: #fff;
            border-radius: 4px;
            margin-bottom: 20px;
            .item-title{
                margin-bottom: 20px;
                font-weight: 600;
            }
            .info-list{
                display: flex;
                flex-wrap: wrap;
                flex-direction: column;
                height: 200px;
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
                    &:nth-of-type(7){
                        border-right: none;
                    }
                    &:nth-of-type(8){
                        border-right: none;
                    }
                    &:nth-of-type(9){
                        border-right: none;
                    }
                    &:nth-of-type(10){
                        border-right: none;
                    }
                    &:nth-of-type(11){
                        border-right: none;
                    }
                    &:nth-of-type(12){
                        border-right: none;
                    }
                }
            }
            .table-status{
                >span{
                    padding-left: 15px;
                    position: relative;
                    &::before{
                        content: "";
                        width:6px;
                        height: 6px;
                        border-radius: 50%;
                        position: absolute;
                        left: 3px;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                    &.color2{
                        color: #3e46ae;
                        &::before{
                            background-color: #3e46ae;
                        }
                    }
                    &.color1{
                        color: #29cc85;
                        &::before{
                            background-color: #29cc85;
                        }
                    }
                }
            }
            .device-soc{
                text-align: center;
                .warning{
                    color: red;
                }
            }
        }
    }
</style>