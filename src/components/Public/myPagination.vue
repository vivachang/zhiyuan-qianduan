<template>
    <div class="myPagination">
        <div class="total">
            共{{pageInfo.total}}条数据，{{Math.ceil(pageInfo.total/pageInfo.pageSize)}}页
        </div>
        <el-pagination
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :page-size="pageInfo.pageSize"
            :current-page="pageInfo.currentPage"
            :total="pageInfo.total">
        </el-pagination>
    </div>  
</template>
<script>
export default {
    name:'myPagination',
    props:['pageInfo'],
    data(){
        return {
           
        }
    },
    created(){
        
    },
    methods:{
        // 翻页
        handleCurrentChange(val){
            this.$emit('current-change',val);
		},
    }
}
</script>

<style lang="scss" scoped>
.myPagination{
    margin-top: 22px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    .total{
        font-size: 12px;
        color: #969696;
    }
}
</style>
