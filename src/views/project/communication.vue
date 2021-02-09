<template>
    <div class="communication mainPage">
        <template v-if="showParent">
            <div class="tableContent">
                <div class="filterBox">
                    <div class="filterItem">
                        <span>预警时间：</span>
                        <el-date-picker
                            class="day-timePicker"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            v-model="searchInfo.time"
                            size="small"
                            @change="handleSearch"
                            clearable
                            type="datetimerange"
                            range-separator="~"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间">
                        </el-date-picker>
                    </div>
                    <div class="filterItem">
                        <span>预警指标：</span>
                        <el-select v-model="searchInfo.threshold_keys" @change="handleSearch" clearable size="small" placeholder="请选择指标">
                            <el-option label="甲醛" value="formaldehyde"></el-option>
                            <el-option label="CO2" value="CO2"></el-option>
                            <el-option label="温度" value="temperature"></el-option>
                            <el-option label="湿度" value="humidity"></el-option>
                            <el-option label="TVOC" value="TVOC"></el-option>
                            <el-option label="PM2.5" value="PM25"></el-option>
                        </el-select>
                    </div>
                    <div class="filterBox fr">
                        <el-input class="keywords fr" v-model="searchInfo.reuseparam" clearable size="small" placeholder="输入项目/监测点名称查询">
                            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                        </el-input>
                    </div>
                </div>
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                        label="编号"
                        type="index"
                        :index="indexMethod"
                        width="80">
                    </el-table-column>
                    <el-table-column
                        label="监测点">
                        <template slot-scope="scope">
                            <div class="point-el">
                                <span>{{scope.row.projects_positions && scope.row.projects_positions.name}}</span>
                                <span class="is-new" v-if="scope.row.isnew===1">NEW</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="所在区域">
                        <template slot-scope="scope">
                            <div class="point-el">
                                <span>{{scope.row.projects_positions && scope.row.projects_positions.area.area_name}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="project"
                        label="所属项目">
                        <template slot-scope="scope">
                            <div>{{scope.row.project && scope.row.project.name}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="customer"
                        v-if="!isCustomer"
                        label="所属客户">
                        <template slot-scope="scope">
                            <div>{{scope.row.project && scope.row.project.customs[0] && scope.row.project.customs[0].company_name}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="waring_time"
                        label="预警时间">
                    </el-table-column>
                    <el-table-column
                        prop="threshold_keys"
                        label="预警指标">
                    </el-table-column>
                    <el-table-column
                        prop="smscount"
                        label="信息数"
                        width="80">
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="150">
                        <template slot-scope="scope">
                            <template v-if="isCustomer">
                                <el-button v-btnRole="10" type="text" size="mini" @click="$router.push({name:(isCustomer ? 'customerMsg' : 'solutionMsg'),params:{id:scope.row.id},query:{type:'check'}})">查看</el-button>
                                <el-button v-btnRole="9" type="text" size="mini" @click="$router.push({name:(isCustomer ? 'customerMsg' : 'solutionMsg'),params:{id:scope.row.id},query:{type:'send'}})">发送消息</el-button>
                            </template>
                            <template v-if="!isCustomer">
                                <el-button v-btnRole="12" type="text" size="mini" @click="$router.push({name:(isCustomer ? 'customerMsg' : 'solutionMsg'),params:{id:scope.row.id},query:{type:'check'}})">查看</el-button>
                                <el-button v-btnRole="11" type="text" size="mini" @click="$router.push({name:(isCustomer ? 'customerMsg' : 'solutionMsg'),params:{id:scope.row.id},query:{type:'send'}})">回复</el-button>
                            </template>
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
import myPagination from '@/components/Public/myPagination'
import request from "@/utils/request";
export default {
    name:'communication',
    data(){
        return {
            showParent:true,
            isCustomer:true,
            searchInfo:{
                threshold_keys:'',
                time:[],
                reuseparam:''
            },
            tableData:[],
            pageInfo:{
				total:0,
				pageSize:20,
				currentPage:1,
            }
        }
    },
    mounted(){
      if(this.$route.name === 'customerWarning' || this.$route.name === 'solution'){   //展示父组件列表
        this.showParent = true;
        if(this.$route.name === 'customerWarning'){
            this.isCustomer = true;
        }else{
            this.isCustomer = false;
        }
        this.getEarlywarningList();
      }else{                        //展示子组件路由
          this.showParent = false;
      }  
    },
    methods:{
        handleSearch(){
            this.pageInfo.currentPage = 1;
            this.getEarlywarningList();
        },
        indexMethod(index){
            return (this.pageInfo.currentPage-1)*this.pageInfo.pageSize + index + 1
        },
        getEarlywarningList(){
            let start_time = this.searchInfo.time && this.searchInfo.time[0],end_time = this.searchInfo.time && this.searchInfo.time[1];
            request(this.ajaxUrl.earlyWarningList,{
                threshold_keys:this.searchInfo.threshold_keys,
                reuseparam:this.searchInfo.reuseparam,
                start_time:start_time,
                end_time:end_time,
                page:this.pageInfo.currentPage,
                pageSize:this.pageInfo.pageSize
            },'get').then((res)=>{
                this.tableData = res.data;
                this.pageInfo.total = res.meta.total;
            }).catch((err)=>{
                console.log(err)
            })
        },
        // 翻页
        pageChange(val){
            this.pageInfo.currentPage = val;
            this.getEarlywarningList();
        },

    },
    components:{
        myPagination
    }
}
</script>
<style lang="scss" scoped>

.communication{
    .tableContent{
        font-size: 12px;
        padding: 20px;
        border-radius: 4px;
        background-color: #fff;
        .point-el{
            >span{
                display: inline-block;
                vertical-align: middle;
                &.is-new{
                    display: inline-block;
                    padding:0 4px;
                    background-color: #ff5e5e;
                    color: #fff;
                    border-radius: 4px;
                    transform: scale(0.8);
                }
            }
        }
    }
}
</style>


