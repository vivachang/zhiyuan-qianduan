<template>
    <div class="warehouse mainPage">
        <div class="filterBox">
            <el-button type="primary" v-btnRole="22" size="small" @click="handleCreate">新增仓库</el-button>
            <el-input class="keywords fr" v-model="keywords" size="small" placeholder="请输入仓库名称">
                <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
            </el-input>
        </div>
        <div class="tableContent">
             <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                    type="index"
                    label="编号"
                    width="50">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="仓库名称"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="仓库地址">
                </el-table-column>
                <el-table-column
                    prop="desc"
                    label="描述">
                </el-table-column>
                <el-table-column
                    prop="store_count"
                    width="120"
                    label="在库设备数">
                </el-table-column>
                <el-table-column
                    align="left"
                    prop="status"
                    width="120"
                    label="仓库状态">
                    <template slot-scope="scope">
                        <div>
                            <el-switch
                                v-model="scope.row.status"
                                :active-value="1"
                                :inactive-value="2"
                                @change="handleStatusChange(scope.row)"
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
                        <el-button size="mini" v-btnRole="23" type="text" @click='handleEdit(scope.row)'>编辑</el-button>
                        <el-button size="mini" type="text" @click='handleDelete(scope.row)'>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <myPagination :pageInfo="pageInfo" @current-change="pageChange"/>
        </div>
        <el-dialog
            :title="(isEdit ? '编辑' : '新增') + '仓库信息'"
            :visible.sync="dialogShow"
            :before-close="handleClose"
            :close-on-click-modal='false'
            width="500px">
            <el-form :model="formData" :rules="rules" ref="warehouseForm" label-position="top" label-width="100px" class="warehouseForm">
                <el-form-item label="仓库名称" prop="name">
                    <el-input v-model="formData.name" placeholder="请填写仓库名称"></el-input>
                </el-form-item>
                <el-form-item label="仓库地址" prop="address">
                    <el-input v-model="formData.address" placeholder="请填写仓库地址"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="desc">
                    <el-input 
                        v-model="formData.desc" 
                        type="textarea" 
                        :show-word-limit="true"
                        maxlength="100"
                        rows="4"
                        resize="none"
                        placeholder="不超过100个字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" @click="handleCancel">取消</el-button>
                    <el-button size="small" @click="handleSubmit" type="primary">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import myPagination from '@/components/Public/myPagination';
import request from "@/utils/request";
export default {
    name:"warehouse",
    data(){
        return {
            keywords:'',
            tableData: [],
            isEdit:false,
            dialogShow:false,
            formData:{
                name:'',
                address:'',
                desc:''
            },
            rules:{
                name:[
                    { required: true, message: '请填写仓库名称', trigger: 'blur' },
                ]
            },
            pageInfo:{
                total:0,
                pageSize:20,
                currentPage:1,
            }
        }
    },
    created(){
       this.getStoreHouses(); 
    },
    methods:{
        // 搜索
        handleSearch(){
            this.pageInfo.currentPage = 1;
            this.getStoreHouses();
        },
        // 仓库列表
        getStoreHouses(){
            request(this.ajaxUrl.storeHouses,{
                page:this.pageInfo.currentPage,
                pageSize:this.pageInfo.pageSize,
                name:this.keywords
            },'get').then((res)=>{
                this.tableData = res.data;
                this.pageInfo.total = res.total;
            }).catch((err)=>{
                console.log(err);
            })
        },
        // 翻页
        pageChange(val){
            this.pageInfo.currentPage = val;
            this.getStoreHouses();
        },
        // 新增
        handleCreate(){
            this.isEdit = false;
            this.dialogShow = true;
        },
        // 状态改变 -- 本地状态更新后触发
        handleStatusChange(item){
            request(this.ajaxUrl.updateStoreStatus + item.id + '/status',{
                status:item.status
            },'put').then((res)=>{

            }).catch((err)=>{
                console.log(err);
            })
        },
        // 编辑
        handleEdit(detail){
            this.isEdit = true;
            this.dialogShow = true;
			this.$nextTick(()=>{
                this.formData = {...detail};
			})
        },
        // 关闭弹框
        handleClose(done){
            this.$refs['warehouseForm'].resetFields();
            done();
        },
        // 取消
        handleCancel(){
            this.$refs['warehouseForm'].resetFields();
            this.dialogShow = false;
        },
        // 提交
        handleSubmit(){
            this.$refs['warehouseForm'].validate((valid) => {
                if (valid) {
                    if(this.isEdit){
                        request(this.ajaxUrl.editStoreHouse + this.formData.id,{
                            ...this.formData
                        },'put').then((res)=>{
                            this.$message.success('仓库编辑成功');
                            this.dialogShow = false;
                            this.getStoreHouses();
                        }).catch((err)=>{
                            console.log(err);
                        })
                    }else{
                        request(this.ajaxUrl.addStoreHouse,{
                            ...this.formData
                        }).then((res)=>{
                            this.$message.success('仓库新增成功');
                            this.$refs['warehouseForm'].resetFields();
                            this.dialogShow = false;
                            this.getStoreHouses();
                        }).catch((err)=>{

                        })
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 删除
        handleDelete(detail){
            this.$confirm('确定删除该仓库', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                request(this.ajaxUrl.delStoreHouse + detail.id,{
                    
                },'delete').then((res)=>{
                    this.$message.success('仓库删除成功');
                    this.getStoreHouses();
                }).catch((err)=>{
                    console.log(err);
                })
            }).catch(() => {});
        },
        // 翻页
        handleCurrentChange(val){
            this.pageInfo.currentPage = val;
        },
    },
    components:{
        myPagination
    }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.warehouse{
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
}
</style>