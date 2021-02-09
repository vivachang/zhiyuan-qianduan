<template>
    <div class="assessmentSet">
        <div class="title">项目名称：{{project_name}}</div>
        <div class="btn-box">
            <uploadFileBtn btn="导入预评估设置" @afterUpload="afterUpload" :url="ajaxUrl.importAssessment + id + '/import' "/>
            <!-- <a :href="'http://47.93.41.147' + '/预评估导入模板.xlsx'" download="预评估导入模板"><el-button size="small">下载导入模板</el-button></a> -->
            <a :href="'http://47.93.41.147' + '/storage/设备导入模板.xlsx'" download="预评估导入模板"><el-button size="small">下载导入模板</el-button></a>
        </div>
        <div class="tableContent">
            <el-table
                :data="tableContent"
                border
                style="width: 100%">
                <el-table-column
                    prop="date"
                    label="日期"
                    width="180">
                </el-table-column>
                <el-table-column
                    align="left"
                    prop="hcho"
                    label="甲醛">
                </el-table-column>
                <el-table-column
                    align="left"
                    prop="tvoc"
                    label="TOVC">
                </el-table-column>
            </el-table>
            <myPagination :pageInfo="pageInfo" @current-change="pageChange"/>
        </div>
    </div>
</template>
<script>
import myPagination from '@/components/Public/myPagination';
import uploadFileBtn from '@/components/Public/uploadFileBtn';
import request from "@/utils/request";
export default {
    name:'assessmentSet',
    data(){
        return {
            tableContent:[],
            pageInfo:{
				total:0,
				pageSize:20,
				currentPage:1,
            },
            id:'',
            project_name:''
        }
    },
    created(){
        this.id = this.$route.params.id;
        this.project_name = this.$route.query.name;
        this.getDetail();
    },
    methods:{
        afterUpload(res){
            this.$message.success('导入成功');
            this.pageInfo.currentPage = 1;
            this.getDetail();
        },
        getDetail(){
            request(this.ajaxUrl.assessmentDetail + this.id,{
                pageSize:this.pageInfo.pageSize,
                page:this.pageInfo.currentPage
            },'get').then((res)=>{
                this.tableContent = res.data;
                this.pageInfo.total = res.total;
            }).catch((err)=>{console.log(err)})
        },
        // 翻页
        pageChange(val){
            this.pageInfo.currentPage = val;
            this.getDetail();
        }
    },
    components:{
        myPagination,
        uploadFileBtn
    }
}
</script>
<style lang="scss" scoped>
.assessmentSet{
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
    .title{
        font-size: 14px;
        color: #000;
        font-weight: 600;
    }
    .btn-box{
        margin: 20px 0;
    }
}
</style>


