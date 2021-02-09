<template>
    <div class="msgCenter mainPage">
        <div class="msg-search">
            <div class="filterBox">
                <div class="filterItem">
                    <span>消息类型</span>
                    <el-select v-model="searchInfo.type" clearable @change="handleChange" size="small" placeholder="请选择消息类型">
                        <el-option v-for="item in filterTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
            </div>
        </div>
        <div class="tableContent content">
            <el-table
                :data="tableContent"
                border
                style="width: 100%">
                <el-table-column
                    header-align="left"
                    prop="id"
                    width="80"
                    label="编号">
                </el-table-column>
                <el-table-column
                    header-align="left"
                    prop="type"
                    width="200"
                    label="消息类型">
                </el-table-column>
                <el-table-column
                    header-align="left"
                    prop="content"
                    label="消息内容">
                    <template slot-scope="scope">
                        <div :class="scope.row.is_read===1 ? '' : 'noRead'" @click="handleToRoute(scope.row)">{{scope.row.content}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    header-align="left"
                    label="操作"
                    width="120">
                    <template slot-scope="scope">
                        <el-button type="text" v-btnRole="2" @click="handleDelMsg(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <myPagination :pageInfo="pageInfo" @current-change="pageChange"/>
        </div>
    </div>
</template>
<script>
import myPagination from '@/components/Public/myPagination';
import request from "@/utils/request";
export default {
    name:'msgCenter',
    components:{
        myPagination
    },
    data(){
        return {
            searchInfo:{
                type:''
            },
            pageInfo:{
				total:0,
				pageSize:20,
				currentPage:1,
            },
            filterTypeList:[
                {
                    label:'系统消息',
                    value:1
                },
                {
                    label:'预警消息',
                    value:2
                }
            ],
            tableContent:[]
        }
    },
    created(){
        this.getMessageList();
    },
    methods:{
        handleChange(value){
            this.pageInfo.currentPage = 1;
            this.getMessageList();
        },
        getMessageList(){
            request(this.ajaxUrl.messageList,{
                type:this.searchInfo.type,
                page:this.pageInfo.currentPage,
                pageSize:this.pageInfo.pageSize
            },'get').then((res)=>{
                this.tableContent = res.data;
                this.pageInfo.total = res.meta.total;
            }).catch((err)=>{
                console.log(err);
            })
        },
        // 跳转
        handleToRoute(item){
            // ActId=2&warnig_id=117
            let query = this.splitUrl(item.url);
            let ActId = query.ActId;
            switch(ActId){
                case '1':       //跳转设备详情页
                    this.$router.push({name:'analysisDetail',params:{id:query.monitor_id},query:{projectId:query.project_id}});
                    break;
                case '2':       //跳转预警回复页
                    this.$router.push({name:'solutionMsg',params:{id:query.warnig_id},query:{type:'send'}});
                    break;
                case '3':       //跳转预警警报（发送消息）
                    this.$router.push({name:'customerMsg',params:{id:query.warnig_id},query:{type:'send'}});
                    break;
                default:
                    
                    return;
            }
        },
        splitUrl(url){
            let obj = {};
            if(url){
                url.split('&').map((item)=>{
                    let key=item.split('=')[0],value=item.split('=')[1];
                    obj[key] = value
                });
                return obj
            }else{
                return null
            }
        },
        handleDelMsg(msgItem){
            this.$confirm('确定删除此消息，删除后不可恢复','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                request(this.ajaxUrl.delMessage + msgItem.id,{

                },'DELETE').then((res)=>{
                    this.$message.success('删除成功');
                    this.getMessageList();
                }).catch((err)=>{
                    console.log(err);
                })
            }).catch(()=>{})
        },
        pageChange(val){
            this.pageInfo.currentPage = val;
            this.getMessageList();
        }
    }
}
</script>
<style lang="scss" scoped>
.msgCenter{
    width: 100%;
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
    .filterBox{
        margin-bottom: 0;
    }
    .noRead{
        color: #5a66ff;
    }
}

</style>