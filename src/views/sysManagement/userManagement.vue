<template>
    <div class="userManagement mainPage">
        <div class="filterBox">
            <div class="filterItem">
                <el-button type="primary" v-btnRole="34" size="small" @click="handleAddUser">新增账户</el-button>
            </div>
            <div class="filterItem fr">
                <el-input class="keywords fr" v-model="searchInfo.keyword" size="small" placeholder="输入关键字查询">
                    <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                </el-input>
            </div>
        </div>
        <el-table :data="userList" style="width: 100%; margin-top:20px" border fit>
            <el-table-column prop="id" label="ID" align="left"></el-table-column>
            <el-table-column prop="name" label="用户名" align="left"></el-table-column>
            <el-table-column prop="truename" label="姓名" align="left"></el-table-column>
            <el-table-column prop="phone" label="电话" align="left"></el-table-column>
            <el-table-column label="账号类型" align="left" width="150">
                <template slot-scope="scope">
                    <p v-if="scope.row.type == 1">数据中心</p>
                    <p v-if="scope.row.type == 2">客户平台</p>
                </template>
            </el-table-column>
            <el-table-column prop="customs" label="账号归属" align="left">
                <template slot-scope="scope">
                    {{scope.row.customer && scope.row.customer.company_name}}
                </template>
            </el-table-column>
            <el-table-column prop="role" label="角色" align="left" width="150">
                <template slot-scope="scope">
                    {{scope.row.roles && scope.row.roles.map((item)=>{return item.name}).join(',')}}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="启用状态" align="left" width="100">
                <template slot-scope="scope">
                    <div v-btnRole="36">
                        <el-switch
                            v-model="scope.row.status"
                            :active-value="1"
                            :inactive-value="0"
                            @change="handleStatusChange(scope.row)"
                            active-color="#29cc85"
                            inactive-color="#888888">
                        </el-switch>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="left">
                <template slot-scope="scope">
                    <el-button type="text" v-btnRole="35" @click="handleEdit(scope.row, 1)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <myPagination :pageInfo="pageInfo" @current-change="pageChange" />
        </div>
        
        <el-dialog
            title="新增账户"
            :visible.sync="addDialogShow"
            :before-close="handleClose"
            :close-on-click-modal='false'
            width="500px">
            <el-form :model="addFormData" :rules="addRules" ref="addUserForm" label-width="100px" class="warehouseForm">
                <el-form-item label="用户名" prop="username">
                    <el-input size="small" clearable v-model="addFormData.username" maxlength="20" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input size="small" clearable v-model="addFormData.phone" maxlength="11" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="truename">
                    <el-input size="small" v-model="addFormData.truename" maxlength="6" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input show-password clearable size="small" maxlength="20" v-model="addFormData.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input show-password clearable size="small" maxlength="20" v-model="addFormData.checkPass" placeholder="确认密码"></el-input>
                </el-form-item>
                <el-form-item label="账户类型" prop="userType">
                    <el-select size="small" v-model="addFormData.userType" placeholder="请选择账户类型">
                        <el-option value="1" label="数据中心"></el-option>
                        <el-option value="2" label="客户平台"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账号归属" v-if="showCustoms" prop="customs">
                    <el-select size="small" v-model="addFormData.customs" placeholder="请选择账号归属">
                        <el-option
                        v-for="item in customsList"
                        :key="item.id"
                        :label="item.company_name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-select size="small" v-model="addFormData.role" multiple placeholder="请选择角色">
                        <el-option
                        v-for="item in roleList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div style="text-align:center;">
                    <el-button size="small" @click="handleCancel(1)">取消</el-button>
                    <el-button size="small" @click="handleSubmit(1)" type="primary">确定</el-button>
                </div>
            </el-form>
        </el-dialog>

        
        <el-dialog
            title="账号编辑"
            :visible.sync="editDialogShow"
            :before-close="handleClose"
            :close-on-click-modal='false'
            width="500px">
            <el-form :model="editFormData" :rules="editRules" ref="editUserForm" label-width="100px" class="warehouseForm">
                <el-form-item label="用户名" prop="username">
                    <el-input size="small" disabled v-model="editFormData.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input size="small" maxlength="11" v-model="editFormData.phone" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="truename">
                    <el-input size="small" maxlength="6" v-model="editFormData.truename" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="账号归属" prop="customs" v-if="editFormData.type!=1">
                    <el-select size="small" disabled v-model="editFormData.customs" placeholder="请选择账号归属">
                        <el-option
                        v-for="item in customsList"
                        :key="item.id"
                        :label="item.company_name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-select size="small" v-model="editFormData.role" multiple placeholder="请选择角色">
                        <el-option
                        v-for="item in roleList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input show-password size="small" maxlength="20" v-model="editFormData.password" placeholder="请输入6-20位登录密码"></el-input>
                    <p class="form-item-hint">如需重置密码请直接填写新密码，保留原密码请留空</p>
                </el-form-item>
                <div style="text-align:center;">
                    <el-button size="small" @click="handleCancel(2)">取消</el-button>
                    <el-button size="small" @click="handleSubmit(2)" type="primary">确定</el-button>
                </div>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
import myPagination from "@/components/Public/myPagination";
import request from "@/utils/request";
import regExp from "@/utils/regExp.js";
export default {
    name: "memberList",
    components: {
        myPagination,
    },
    data() {
        // 验证用户名是否重复
        var checkUsername = (rule,value,callback)=>{
            request(this.ajaxUrl.checkUsername,{
                name:value
            },'get').then((res)=>{
                callback();
            }).catch((err)=>{
                callback(new Error(err.data.errors.name.join(',')))
            });
        };
        // 验证两次密码是否相同
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.addFormData.checkPass !== '') {
                    this.$refs.addUserForm.validateField('checkPass');
                }
            callback();
            }
        };
        // 验证两次密码是否相同
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.addFormData.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            searchInfo:{
                keyword:''
            },
            showCustoms:true,
            addDialogShow:false,
            editDialogShow:false,
            addFormData:{
                username:'',
                phone:'',
                truename:'',
                password:'',
                checkPass:'',
                userType:'',
                customs:'',
                role:''
            },
            editFormData:{
                username:'',
                phone:'',
                truename:'',
                customs:'',
                role:'',
                password:'',
                type:'',
                id:''
            },
            addRules:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { validator: regExp.checkUsername, trigger: 'blur' },
                    { validator: checkUsername, trigger: 'blur' }
                ],
                phone:[
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { validator: regExp.checkPhone, trigger: 'blur' },
                ],
                truename:[
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { validator: regExp.checkPassword, trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' },
                ],
                checkPass:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { validator: regExp.checkPassword, trigger: 'blur' },
                    { validator: validatePass2, trigger: 'blur' },
                ],
                userType:[
                    { required: true, message: '请选择账户类型', trigger: 'blur' },
                ],
                customs:[
                    { required: true, message: '请选择账号归属', trigger: 'blur' },
                ],
                role:[
                    { required: true, message: '请选择账户角色', trigger: 'blur' },
                ]
            },
            editRules:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ],
                phone:[
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { validator: regExp.checkPhone, trigger: 'blur' },
                ],
                truename:[
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                ],
                customs:[
                    { required: true, message: '请选择账号归属', trigger: 'blur' },
                ],
                role:[
                    { required: true, message: '请选择账户角色', trigger: 'blur' },
                ]

            },
            userList: [],
            roleList:[],
            customsList:[],
            pageInfo: {
                total: 0,
                pageSize: 20,
                currentPage: 1,
            },
        };
    },
    created() {
        this.getRoleList();
        this.getCustomsList();
        this.getUsersList();
    },
    methods: {
        // 用户列表
        getUsersList(){
            request(this.ajaxUrl.usersList,{
                page:this.pageInfo.currentPage,
                pageSize:this.pageInfo.pageSize,
                reuse_param:this.searchInfo.keyword,
                include:'customer,roles'
            },'get').then((res)=>{
                this.userList = res.data;
                this.pageInfo.total = res.meta.total;
            }).catch((err)=>{
                console.log(err)
            })
        },
        // 获取客户列表
        getCustomsList() {
            request(this.ajaxUrl.customsList,{
                pageSize:99999,
                page:1
            },'get').then((res)=>{
                this.customsList = res.data;
            }).catch((err)=>{
                console.log(err);
            })
        },
        // 角色列表
        getRoleList(){
            request(this.ajaxUrl.roleList,{

            },'get').then((res)=>{
                this.roleList = res.data;
            }).catch((err)=>{
                console.log(err);
            })
        },
        // 新增用户
        handleAddUser(){
            this.addDialogShow=true;
        },
        // 搜索用户
        handleSearch(){
            this.pageInfo.currentPage = 1;
            this.getUsersList();
        },
        // 关闭新增/编辑用户弹框
        handleClose(done){
            this.$refs['addUserForm'] && this.$refs['addUserForm'].resetFields();
            this.$refs['editUserForm'] && this.$refs['editUserForm'].resetFields();
            done();
        },
        // 确定新增/编辑用户
        handleSubmit(type){
            if(type==1){    //新增用户
                this.$refs['addUserForm'].validate((valid)=>{
                    if(valid){
                        // console.log(this.addFormData)
                        request(this.ajaxUrl.addUsers,{
                            name:this.addFormData.username,
                            phone:this.addFormData.phone,
                            password:this.addFormData.password,
                            roles:this.addFormData.role.join(','),
                            truename:this.addFormData.truename,
                            type:this.addFormData.userType,
                            customer_id:this.addFormData.customs
                        }).then((res)=>{
                            this.$message.success('用户新增成功');
                            this.$refs['addUserForm'].resetFields();
                            this.addDialogShow = false;
                            this.getUsersList();
                        }).catch((err)=>{
                            console.log(err)
                        })
                    }else{
                        console.log('error submit!');
                        return false
                    }
                })
            }else{      //编辑用户
                this.$refs['editUserForm'].validate((valid)=>{
                    if(valid){
                        let data = {};
                        if(this.editFormData.password){
                            data = {
                                truename:this.editFormData.truename,
                                roles:this.editFormData.role.join(','),
                                password:this.editFormData.password
                            }
                        }else{
                            data = {
                                truename:this.editFormData.truename,
                                roles:this.editFormData.role.join(',')
                            }
                        }
                        request(this.ajaxUrl.editUsers + this.editFormData.id,{
                            ...data
                        },'patch').then((res)=>{
                            this.$message.success('用户编辑成功');
                            this.$refs['editUserForm'].resetFields();
                            this.editDialogShow = false;
                            this.getUsersList();
                        })
                    }else{
                        console.log('error submit');
                        return false;
                    }
                })
            }
        },
        // 取消新增/编辑用户弹框
        handleCancel(type){
            if(type==1){
                this.$refs['addUserForm'].resetFields();
                this.addDialogShow = false;
            }else{
                this.$refs['editUserForm'].resetFields();
                this.editDialogShow = false;
            }
        },
        // 翻页
        pageChange(val) {
            this.pageInfo.currentPage = val;
            this.getUsersList();
            console.log(val);
        },
        handleEdit(detail){
            this.editFormData.username = detail.name;
            this.editFormData.phone = detail.phone;
            this.editFormData.truename = detail.truename;
            this.editFormData.customs = detail.customer_id;
            this.editFormData.role = detail.roles.map((item)=>{return item.id});
            this.editFormData.type = detail.type;
            this.editFormData.id = detail.id;
            this.editDialogShow=true;

        },
        // 用户 启用/停用
        handleStatusChange(userItem){
            request(this.ajaxUrl.editUsers + userItem.id,{
                status:userItem.status
            },'patch').then((res)=>{
                this.getUsersList();
            }).catch((err)=>{
                console.log(err)
            })
        }
    },
    watch:{
        'addFormData.userType':function(newVal,oldVal){
            if(newVal == 1){
                this.showCustoms = false;
                this.addFormData.customs = '';
                console.log('数据中心',this.addFormData);
            }else{
                this.showCustoms = true;
            }
            console.log(newVal)
        }
    }
};
</script>

<style lang="scss" scoped>
.userManagement{
    width: 100%;
    padding: 20px;
    background-color: #fff;
    border: 4px;
    // /deep/.el-form-item{
    //     margin-bottom: 20px;
    // }
    .form-item-hint{
        font-size: 12px;
        color: #999999;
    }
}
</style>