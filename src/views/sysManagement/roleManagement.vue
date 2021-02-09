<template>
    <div class="roleManagement mainPage">
        <div class="btns">
            <el-button size="small" type="primary" v-btnRole="37" icon="el-icon-plus" @click="handleCreate">新增角色</el-button>
        </div>
        <div class="content">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="name" label="角色名称"></el-table-column>
                <!-- <el-table-column label="角色类型">
                    <template slot-scope="scope">
                        {{scope.row.type === 0 ? '数据中心' : '业务中心'}}
                    </template>
                </el-table-column> -->
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" v-btnRole="38" @click="edit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <myPagination :pageInfo="pageInfo" @current-change="pageChange" />
        </div>

        <el-dialog
            :title="curTitle"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose"
            :close-on-click-modal="false">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="角色名称">
                    <el-input style="width:200px;" size="small" v-model.trim="form.name"></el-input>
                    <span class="item-hint">最多只能输入10个字</span>
                </el-form-item>
                <!-- <el-form-item label="角色类型">
                    <el-input style="width:200px;" size="small" v-model="form.type"></el-input>
                    <span class="item-hint">最多只能输入10个字</span>
                </el-form-item> -->
                <el-form-item label="权限设置">
                    <div class="settingBox">
                        <el-tree
                            ref="roleTree"
                            node-key='id'
                            :data="roleData"
                            show-checkbox
                            :default-expand-all="true"
                            :default-checked-keys="checkRole"
                            :props="defaultProps"
                        ></el-tree>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" style="text-align:center;">
                <el-button size="small" @click="handleCancle">取 消</el-button>
                <el-button size="small" type="primary" @click="handleSaveRole">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import myPagination from "@/components/Public/myPagination";
import request from "@/utils/request";
export default {
    components: {
        myPagination,
    },
    data() {
        return {
            formInline: {
                user: "",
                region: "",
            },
            tableData: [],
            curTitle: "",
            dialogVisible: false,
            form: {
                name: "",
                // type: "",
            },
            checkRole:[],
            editRole:null,
            roleData: [
                {
                    id:10000,
                    label:'项目管理',
                    children:[
                        {
                            id:11000,
                            label:'项目列表',
                            children:[
                                {
                                    id:1,
                                    label:'新增'
                                },
                                {
                                    id:2,
                                    label:'编辑'
                                },
                                {
                                    id:3,
                                    label:'监测点管理'
                                },
                                {
                                    id:4,
                                    label:'查看'
                                }
                            ]
                        },
                        {
                            id:12000,
                            label:'标准阈值设置',
                            children:[
                                {
                                    id:5,
                                    label:'新增'
                                },
                                {
                                    id:6,
                                    label:'阈值设置'
                                }
                            ]
                        },
                        {
                            id:13000,
                            label:'项目预警设置',
                            children:[
                                {
                                    id:7,
                                    label:'阈值设置'
                                },
                                {
                                    id:8,
                                    label:'预警条件'
                                }
                            ]
                        },
                        {
                            id:14000,
                            label:'预警警报',
                            children:[
                                {
                                    id:9,
                                    label:'发送消息'
                                },
                                {
                                    id:10,
                                    label:'查看'
                                }
                            ]
                        },
                        {
                            id:15000,
                            label:'解决方案',
                            children:[
                                {
                                    id:11,
                                    label:'回复'
                                },
                                {
                                    id:12,
                                    label:'查看'
                                }
                            ]
                        }
                    ]
                },
                {
                    id:20000,
                    label:'预评估管理',
                    children:[
                        {
                            id:13,
                            label:'预评估设置'
                        }
                    ]
                },
                {
                    id:30000,
                    label:'客户管理',
                    children:[
                        {
                            id:31000,
                            label:'客户列表',
                            children:[
                                {
                                    id:14,
                                    label:'新增'
                                },
                                {
                                    id:15,
                                    label:'编辑'
                                },
                                {
                                    id:16,
                                    label:'查看'
                                }
                            ]
                        },
                        {
                            id:32000,
                            label:'订单管理',
                            children:[
                                {
                                    id:17,
                                    label:'新增'
                                },
                                {
                                    id:18,
                                    label:'编辑'
                                },
                                {
                                    id:19,
                                    label:'查看'
                                },
                                {
                                    id:20,
                                    label:'取消'
                                },
                                {
                                    id:21,
                                    label:'发货'
                                }
                            ]
                        }
                    ]
                },
                {
                    id:40000,
                    label:'库存管理',
                    children:[
                        {
                            id:41000,
                            label:'仓库管理',
                            children:[
                                {
                                    id:22,
                                    label:'新增'
                                },
                                {
                                    id:23,
                                    label:'编辑'
                                }
                            ]
                        },
                        {
                            id:42000,
                            label:'设备管理',
                            children:[
                                {
                                    id:24,
                                    label:'新增'
                                },
                                {
                                    id:25,
                                    label:'批量导入/下载模板'
                                },
                                {
                                    id:26,
                                    label:'编辑'
                                },
                                {
                                    id:27,
                                    label:'收回'
                                }
                            ]
                        }
                    ]
                },
                {
                    id:50000,
                    label:'财务管理',
                    children:[
                        {
                            id:28,
                            label:'查看'
                        },
                        {
                            id:29,
                            label:'收款'
                        },
                        {
                            id:30,
                            label:'退款'
                        }
                    ]
                },
                {
                    id:60000,
                    label:'数据报表',
                    children:[
                        {
                            id:61000,
                            label:'数据查询',
                            children:[
                                {
                                    id:31,
                                    label:'查看'
                                }
                            ]
                        },
                        {
                            id:62000,
                            label:'数据分析',
                            children:[
                                {
                                    id:32,
                                    label:'数据对比'
                                },
                                {
                                    id:33,
                                    label:'查看'
                                }
                            ]
                        }
                    ]
                },
                {
                    id:70000,
                    label:'系统管理',
                    children:[
                        {
                            id:71000,
                            label:'用户管理',
                            children:[
                                {
                                    id:34,
                                    label:'新增'
                                },
                                {
                                    id:35,
                                    label:'编辑'
                                },
                                {
                                    id:36,
                                    label:'启用/停用'
                                }
                            ]
                        },
                        {
                            id:72000,
                            label:'角色管理',
                            children:[
                                {
                                    id:37,
                                    label:'新增'
                                },
                                {
                                    id:38,
                                    label:'编辑'
                                }
                            ]
                        },
                        {
                            id:73000,
                            label:'故障排查',
                            children:[
                                {
                                    id:39,
                                    label:'列表'
                                }
                            ]
                        },
                        {
                            id:74000,
                            label:'数据字典',
                            children:[
                                {
                                    id:40,
                                    label:'编辑'
                                }
                            ]
                        },
                        {
                            id:75000,
                            label:'登录日志',
                            children:[
                                {
                                    id:41,
                                    label:'列表'
                                }
                            ]
                        }
                    ]
                }
            ],
            defaultProps: {
                
            },
            pageInfo: {
                total: 0,
                pageSize: 20,
                currentPage: 1,
            },
        };
    },
    created(){
        this.getRoleList();
    },
    methods: {
        getRoleList(){
            request(this.ajaxUrl.roleList,{
                pageSize:this.pageInfo.pageSize,
                page:this.pageInfo.currentPage
            },'get').then((res)=>{
                this.tableData = res.data;
                this.pageInfo.total = res.meta && res.meta.total || 0;
            }).catch((err)=>{
                console.log(err);
            })
        },
        // 翻页
        pageChange(val) {
            this.pageInfo.currentPage = val;
            this.getRoleList();
        },
        handleCreate() {
            this.curTitle = "新增角色";
            this.form.name="";
            this.checkRole = [];
            this.dialogVisible = true;
            this.editRole = null;
        },
        // 清空树形图选中状态
        resetChecked() {
            this.$refs['roleTree'].setCheckedKeys([]);
        },
        //保存角色信息
        handleSaveRole(){
            let roleList = this.$refs['roleTree'].getCheckedKeys(true);
            if(this.form.name===""){
                this.$message.warning('请输入角色名称');
                return;
            }
            if(this.editRole){
                request(this.ajaxUrl.editRole + this.editRole.id,{
                    name:this.form.name,
                    type:1,
                    permissions:roleList.join(',')
                },'patch').then((res)=>{
                    this.$message.success('角色编辑成功');
                    this.dialogVisible = false;
                    this.getRoleList();
                    this.resetChecked();
                }).catch((err)=>{
                    console.log(err)
                })
            }else{
                request(this.ajaxUrl.addRole,{
                    name:this.form.name,
                    type:1,
                    permissions:roleList.join(',')
                }).then((res)=>{
                    this.dialogVisible = false;
                    this.$message.success('角色新增成功');
                    this.getRoleList();
                    this.resetChecked();
                }).catch((err)=>{
                    console.log(err)
                })
            }
        },
        // 编辑角色
        edit(scope) {
            this.curTitle = "编辑角色";
            this.editRole = scope;
            request(this.ajaxUrl.rolePermissions + scope.id + '/permissions',{

            },'get').then((res)=>{
                this.dialogVisible = true;
                this.checkRole = res.data.map((item)=>{return item.id});
                this.form.name=scope.name;
            }).catch((err)=>{
                console.log(err)
            })
        },
        // 取消
        handleCancle() {
            this.dialogVisible = false;
            this.curTitle = "";
            this.resetChecked();
        },
        handleClose(done){
            this.resetChecked();
            done();
        }
    },
};
</script>

<style lang="less" scoped>
.roleManagement {
   padding: 20px;
   background-color: #fff;
   border-radius: 4px;
   .item-hint{
       font-size: 12px;
       color: #999;
       margin-left: 10px;
   }
}
.settingBox{
    max-height: 300px;
    overflow-y: auto;
}
</style>