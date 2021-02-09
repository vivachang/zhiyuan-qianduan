<template>
    <div class="assessmentManager mainPage">
        <template v-if="showParent">
            <div class="assessment-header">
                <div class="assessment-search">
                    <div class="filterBox">
                        <div class="filterItem">
                            <span>预评估状态</span>
                            <el-select v-model="searchInfo.setting_flg" size="small" placeholder="请选择项目预评估状态">
                                <el-option label="未设置" value="1"></el-option>
                                <el-option label="已设置" value="2"></el-option>
                            </el-select>
                            <br>
                        </div>
                        <br>
                        <div class="filterItem">
                            <span></span>
                            <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                            <el-button type="text" size="small" @click="handleReset">重置查询条件</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tableContent">
                <div class="filterBox">
                    <div class="filterItem fr">
                        <el-input class="keywords fr" clearable v-model="searchInfo.name" size="small" placeholder="输入项目名称查询">
                            <el-button slot="append" icon="el-icon-search" @click="handleSearchKeyword"></el-button>
                        </el-input>
                    </div>
                </div>
                <el-table
                    :data="tableContent"
                    border
                    style="width: 100%">
                    <el-table-column
                        prop="number"
                        label="项目编号"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="项目名称">
                    </el-table-column>
                    <el-table-column
                        prop="custormer"
                        label="所属客户">
                        <template slot-scope="scope">
                            {{scope.row.customs[0] && scope.row.customs[0].company_name}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="left"
                        prop="equipment"
                        label="项目状态"
                        width="120">
                        <template slot-scope="scope">
                            <div>
                                <span v-if="scope.row.status===0" class="text-dot color1">未开始</span>
                                <span v-if="scope.row.status===1" class="text-dot color2">暂停中</span>
                                <span v-if="scope.row.status===2" class="text-dot color3">已结束</span>
                                <span v-if="scope.row.status===3" class="text-dot color2">项目错误</span>
                                <span v-if="scope.row.status===4" class="text-dot color2">施工中</span>
                                <span v-if="scope.row.status===5" class="text-dot color1">交付中</span>
                                <span v-if="scope.row.status===6" class="text-dot color1">维护中</span>
                                <span v-if="scope.row.status===7" class="text-dot color1">项目大阶段错误</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="left"
                        label="预评估状态"
                        width="100">
                        <template slot-scope="scope">
                            <div>{{scope.row.setting_flg===1 ? '未设置' : '已设置'}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="left"
                        label="操作"
                        width="200">
                        <template slot-scope="scope">
                            <el-button type="text" v-btnRole="13" @click="$router.push({name:'assessmentSet',params:{id:scope.row.id},query:{name:scope.row.name}})">设置</el-button>
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
import myPagination from '@/components/Public/myPagination';
import request from "@/utils/request";
export default {
    name:'assessmentManager',
    data(){
        return {
            showParent:true,
            searchInfo:{
                setting_flg:'',
                name:''
            },
            tableContent:[],
            pageInfo:{
				total:0,
				pageSize:20,
				currentPage:1,
            }
        }
    },
    mounted(){
      if(this.$route.name === 'assessmentManager'){   //展示父组件列表
          this.showParent = true;
          this.getAssessmentList();
      }else{                        //展示子组件路由
          this.showParent = false;
      }  
    },
    methods:{
        handleReset(){
            this.searchInfo.setting_flg = '';
        },
        handleSearch(){
            this.pageInfo.currentPage = 1;
            this.searchInfo.name="";
            this.getAssessmentList();
        },
        handleSearchKeyword(){
            this.pageInfo.currentPage = 1;
            this.searchInfo.setting_flg="";
            this.getAssessmentList();
        },
        getAssessmentList(){
            request(this.ajaxUrl.assessmentList,{
                pageSize:this.pageInfo.pageSize,
                page:this.pageInfo.currentPage,
                setting_flg:this.searchInfo.setting_flg,
                name:this.searchInfo.name
            },'get').then((res)=>{
                this.tableContent = res.data;
                this.pageInfo.total = res.meta.total;
            }).catch((err)=>{})
        },
        // 翻页
        pageChange(val){
            this.pageInfo.currentPage = val;
            this.getAssessmentList();
        }
    },
    components:{
        myPagination
    }
}
</script>
<style lang="scss" scoped>
.assessmentManager{
    .assessment-search{
        padding: 20px;
        background-color: #fff;
        margin-bottom: 20px;
        border-radius: 4px;
        .filterBox{
            margin-bottom: 0;
            .filterItem{
                &:nth-last-of-type(1){
                    margin-bottom: 0;
                }
            }
        }
    }
    .tableContent{
        background-color: #fff;
        border-radius: 4px;
        padding: 20px;
        .filterBox{
            margin-bottom: 0;
        }
        .color1{
            color: #ffc13a;
            &::before{
                background-color: #ffc13a;
            }
        }
        .color2{
            color: #29cc85;
            &::before{
                background-color: #29cc85;
            }
        }
        .color3{
            color: #3e46ae;
            &::before{
                background-color: #3e46ae;
            }
        }
    }
}
</style>

