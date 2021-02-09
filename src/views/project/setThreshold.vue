<template>
    <div class="setThreshold mainPage">
        <template v-if="showParent">
            <div class="filterBox">
                <el-button type="primary" v-btnRole="5" size="small" @click="dialogVisible=true;">新建监测标准</el-button>
                <el-input class="keywords fr" v-model="searchInfo.name" size="small" placeholder="输入名称查询">
                    <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                </el-input>
            </div>
            <div class="tableContent">
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                        label="编号"
                        type="index"
                        width="80">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="标准名称">
                    </el-table-column>
                    <el-table-column
                        prop="created_at"
                        label="创建时间">
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        label="启用状态">
                        <template slot-scope="scope">
                            <div>
                                <el-switch
                                    v-model="scope.row.status"
                                    :active-value="1"
                                    :inactive-value="0"
                                    @change="handleChangeStatus(scope.row)"
                                    active-color="#29cc85"
                                    inactive-color="#888888">
                                </el-switch>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="150">
                        <template slot-scope="scope">
                            <el-button type="text" v-btnRole="6" size="mini" @click='$router.push({name:"thresholdEdit",params:{id:scope.row.id}})'>阈值设置</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <myPagination :pageInfo="pageInfo" @current-change="pageChange"/>
            </div>
            <el-dialog 
                title="新建监测标准"
                @close="handleCloseDialog"
                :visible.sync="dialogVisible" 
                :close-on-click-modal='false'
                width="30%">
                <div class="add-threshold">
                    <div class="threshold-name">
                        <span class="required">标准名称</span>
                        <el-input size="small" type="text" style="width:280px;" v-model.trim="addThreshold.name"></el-input>
                    </div>
                    <div class="threshold-name">
                        <span class="required">标准说明</span>
                        <el-input size="small" type="textarea" rows="4" maxlength="200" resize="none" style="width:280px;" v-model.trim="addThreshold.descript"></el-input>
                    </div>
                    <div class="add-btn">
                        <el-button size="small" @click="dialogVisible = false;">取消</el-button>
                        <el-button size="small" type="primary" @click="handleDetermine">确定</el-button>
                    </div>
                </div>
            </el-dialog>
        </template>
        <router-view></router-view>
    </div>
</template>
<script>
import myPagination from '@/components/Public/myPagination';
import request from "@/utils/request";
export default {
    name:'setThreshold',
    data(){
        return{
            dialogVisible:false,
            addThreshold:{
                name:'',
                descript:''
            },
            showParent:true,
            searchInfo:{
                name:''
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
      if(this.$route.name === 'setThreshold'){   //展示父组件列表
          this.showParent = true;
          this.getThresholdsList();
      }else{                        //展示子组件路由
          this.showParent = false;
      }  
    },
    methods:{
        // 搜索
        handleSearch(){
            this.pageInfo.currentPage = 1;
            this.getThresholdsList();
        },
        // 列表
        getThresholdsList(){
            request(this.ajaxUrl.thresholdsList,{
                name:this.searchInfo.name,
                page:this.pageInfo.currentPage,
                pageSize:this.pageInfo.pageSize
            },'get').then((res)=>{
                this.tableData = res.data;
                this.pageInfo.total = res.meta.total;
            }).catch((err)=>{
                console.log(err)
            })
        },
        // 阈值设置
        handleSet(){

        },
        // 确定新增标准
        handleDetermine(){
            if(!this.addThreshold.name){
                this.$message.warning('请输入监测标准名称');
                return;
            }
            if(!this.addThreshold.descript){
                this.$message.warning('请输入监测标准说明');
                return;
            }
            request(this.ajaxUrl.addThresholds,{
                name:this.addThreshold.name,
                descript:this.addThreshold.descript
            }).then((res)=>{
                this.$message.success('监测标准新增成功');
                this.dialogVisible = false;
                this.getThresholdsList();
            }).catch((err)=>{
                console.log(err);
            })
        },
        // 修改状态
        handleChangeStatus(item){
            request(this.ajaxUrl.editThresholds + item.id,{
                status:item.status
            },'patch').then((res)=>{
                this.$message.success('状态修改成功');
                this.getThresholdsList();
            }).catch((err)=>{
                console.log(err);
            })
        },
        // 翻页
        pageChange(val){
            this.pageInfo.currentPage = val;
            this.getThresholdsList();
        },
        // 关闭dialog
        handleCloseDialog(){
            this.addThreshold.name = "";
        }
    },
    components:{
        myPagination
    }
}
</script>
<style lang="scss" scoped>
.setThreshold{
    padding: 20px;
    background-color: #fff;
    .threshold-name{
        margin-bottom: 20px;
        >span{
            margin-right: 15px;
        }
    }
    .add-btn{
        text-align: center;
        margin-top: 25px;
    }
}
</style>


