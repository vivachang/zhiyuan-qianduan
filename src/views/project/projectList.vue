<template>
    <div class="projectList mainPage">
        <template v-if="showChild">
            <div class="project-header">
                <div class="project-acount">
                    <div class="acount-left">
                        <h5>项目数量</h5>
                        <p><span>{{countInfo.all_count}}</span>个</p>
                        <div class="progress" v-show="countInfo.all_count!==0">
                            <div class="not-start" :style="{ width:(countInfo.not_started_count/countInfo.all_count*100) + '%'}"></div>
                            <div class="on-going" :style="{ width: (countInfo.ongoing_count/countInfo.all_count*100) + '%' }"></div>
                            <div class="end" :style="{ width: (countInfo.over_count/countInfo.all_count*100) + '%' }"></div>
                        </div>
                    </div>
                    <div class="acount-right">
                        <radio-group size="small" :timeType="timeType" :show="[2,3,4]" @change="handleChange"/>
                        <ul class="number">
                            <li>
                                <span>未开始</span>
                                <span>{{countInfo.not_started_count}}</span>
                            </li>
                            <li>
                                <span>进行中</span>
                                <span>{{countInfo.ongoing_count}}</span>
                            </li>
                            <li>
                                <span>已结束</span>
                                <span>{{countInfo.over_count}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="project-search">
                    <div class="filterBox">
                        <div class="filterItem">
                            <span>项目状态</span>
                            <el-select v-model="searchInfo.status" size="small" placeholder="请选择项目状态">
                                <el-option v-for="item in filterStatusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <br>
                        </div>
                        <br>
                        <div class="filterItem">
                            <span></span>
                            <el-button type="primary" class="minWidth" size="small" @click="handleSearch">查询</el-button>
                            <el-button type="text" size="small" @click="searchInfo.status=''">重置查询条件</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tableContent content">
                <div class="filterBox" style="margin-bottom:0;">
                    <div class="filterItem">
                        <el-button type="primary" class="minWidth" v-btnRole="1" size="small" @click="$router.push({name:'addProject'})">新增项目</el-button>
                    </div>
                    <div class="filterItem fr">
                        <el-input class="keywords fr" style="width:280px;" v-model="searchInfo.name" size="small" placeholder="输入项目名称或客户名称查询">
                            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                        </el-input>
                    </div>
                </div>
                <el-table
                    :data="tableContent"
                    v-loading="tableDataLoading"
                    border
                    style="width: 100%">
                    <el-table-column
                        header-align="left"
                        prop="number"
                        label="项目编号"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        header-align="left"
                        min-width="200"
                        label="项目信息">
                        <template slot-scope="scope">
                            <div>名称：{{scope.row.name}}</div>
                            <div>地址：{{scope.row.address}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        header-align="left"
                        min-width="120"
                        prop="project_manage_name"
                        label="项目负责人">
                    </el-table-column>
                    <el-table-column
                        header-align="left"
                        label="所属客户"
                        v-if="userInfo.type !== 2"
                        width="180">
                        <template slot-scope="scope">
                            <div>{{scope.row.customs&& scope.row.customs[0] && scope.row.customs[0].company_name }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        header-align="left"
                        prop="position_count"
                        label="监测点数量"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        header-align="left"
                        prop="device_count"
                        label="设备数量"
                        width="80">
                    </el-table-column>
                    <el-table-column
                        header-align="left"
                        prop="created_at"
                        label="创建时间"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        header-align="left"
                        align="left"
                        prop="status"
                        label="项目状态"
                        width="180">
                        <template slot-scope="scope">
                            <div class="table-status"><span :class="'color' + scope.row.status">{{publicObj.projectStatus[scope.row.status]}}</span></div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        header-align="left"
                        label="操作"
                        width="200">
                        <template slot-scope="scope">
                            <el-button type="text" v-if="scope.row.status!=2" v-btnRole="2" @click="$router.push({name:'editProject',params:{id:scope.row.id}})">编辑</el-button>
                            <el-button type="text" v-btnRole="4" @click="$router.push({name:'checkProject',params:{id:scope.row.id}})">查看</el-button>
                            <!--  v-if="scope.row.status!=2" -->
                            <el-button type="text" v-btnRole="3" @click="$router.push({name:'monitorManager',params:{id:scope.row.id}})">监测点管理</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <myPagination :pageInfo="pageInfo" @current-change="pageChange"/>
            </div>
        </template>
        <router-view></router-view>
    </div>
</template>
<script>
import radioGroup from '@/components/Public/radioGroup'
import myPagination from '@/components/Public/myPagination'
import request from "@/utils/request";
export default {
    name:"projectList",
    data(){
        return {
            showChild:false,    //是否展示子路由
            userInfo:{},
            filterStatusList:[
                {label:'未开始',value:0},
                {label:'暂停中',value:1},
                {label:'已结束',value:2},
                {label:'项目错误',value:3},
                {label:'施工中',value:4},
                {label:'交付中',value:5},
                {label:'维护中',value:6},
                {label:'项目大阶段错误',value:7}
            ],
            tableContent:[
                
            ],
            tableDataLoading:false,
            searchInfo:{
                status:'',
                name:''
            },
            pageInfo:{
				total:0,
				pageSize:20,
				currentPage:1,
            },
            timeType:4,     //1本周 2本月 3今年  4全部
            countInfo:{},
        }
    },
    mounted(){
        this.userInfo = this.$store.getters.admin_detail;
        if(this.$route.name === 'projectList'){   //展示父组件列表
            this.showChild = true;
            this.getProjectCount();
            this.getProjectList();
        }else{                        //展示子组件路由
            this.showChild = false;
        }  
    },
    methods:{
        // 搜索
        handleSearch(){
            this.pageInfo.currentPage = 1;
            this.getProjectList();
        },
        // 头部时间切换
        handleChange(timeType){
            this.timeType = timeType;
        },
        // 获取项目数量统计
        getProjectCount(){
            request(this.ajaxUrl.projectsCount,{
                type:this.timeType
            },'get').then((res)=>{
                this.countInfo = res;
            }).catch((err)=>{
                console.log(err);
            })
        },
        // 获取列表
        getProjectList(){
            this.tableDataLoading = true;
            request(this.ajaxUrl.projectsList,{
                include:'customs',
                pageSize:this.pageInfo.pageSize,
                page:this.pageInfo.currentPage,
                status:this.searchInfo.status,
                name:this.searchInfo.name
            },'get').then((res)=>{
                this.pageInfo.total = res.meta.total;
                this.tableContent = res.data;
                this.tableDataLoading = false;
            }).catch((err)=>{
                this.tableDataLoading = false;
                console.log(err);
            })
        },
        // 翻页
        pageChange(val){
            this.pageInfo.currentPage = val;
            this.getProjectList();
        }
    },
    watch:{
        timeType(){
            this.getProjectCount();
        }
    },
    components:{
        radioGroup,
        myPagination
    }
}
</script>
<style lang="scss" scoped>
    .projectList{
        width: 100%;
        .project-header{
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            .project-acount{
                width:380px;
                height: 140px;
                background: #fff;
                border-radius: 4px;
                padding: 10px 20px 10px 20px;
                display: flex;
                justify-content: space-between;
                flex-wrap: nowrap;
                .acount-left{
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    h5{
                        margin: 0;
                    }
                    p{
                        span{
                            font-size: 36px;
                            font-weight: 600;
                        }
                    }
                    .progress{
                        width: 160px;
                        height: 18px;
                        display: flex;
                        flex-wrap: nowrap;
                        >div{
                            height: 100%;
                            &.not-start{
                                background-color: #ffc13a;
                            }
                            &.on-going{
                                background-color: #29cc85;
                            }
                            &.end{
                                background-color: #3e46ae;
                            }
                        }
                    }
                }
                .acount-right{
                    width: 142px;
                    .number{
                        width: 100%;
                        font-size: 12px;
                        margin-top: 20px;
                        >li{
                            width: 100%;
                            padding-left: 20px;
                            display: flex;
                            justify-content: space-between;
                            line-height: 24px;
                            position: relative;
                            &::before{
                                content: "";
                                width: 8px;
                                height: 8px;
                                position: absolute;
                                left: 0;
                                top: 50%;
                                transform: translateY(-50%);
                            }
                            &:nth-of-type(1){
                                &::before{
                                    background-color: #ffc13a;
                                }
                            }
                            &:nth-of-type(2){
                                &::before{
                                    background-color: #29cc85;
                                }
                            }
                            &:nth-of-type(3){
                                &::before{
                                    background-color: #3e46ae;
                                }
                            }
                        }
                    }
                }
            }
            .project-search{
                width:calc(100% - 400px);
                height: 140px;
                background: #fff;
                border-radius: 4px;
                padding: 20px;
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
                    background-color: #000;
                }
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
        }
    }
</style>