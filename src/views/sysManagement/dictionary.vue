<template>
    <div class="dictionary mainPage">
        <div class="content">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="name" label="配置项目"></el-table-column>
                <el-table-column prop="value" label="项目值">
                    <template slot-scope="scope">
                        {{scope.row.value.map((item)=>{return item.name}).join('，')}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="left" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <myPagination :pageInfo="pageInfo" @current-change="pageChange" />
        </div>
        <el-dialog
            title="编辑配置"
            :visible.sync="dialogShow"
            :before-close="handleClose"
            :close-on-click-modal='false'
            width="400px">
            <div class="dictionaryEdit">
                <div class="allocation">
                    <span>配置项目：</span><span>{{editDictionary.name}}</span>
                    <el-button class="add-btn" type="text" size="small" @click="handleAddItem">新增项目值</el-button>
                </div>
                <ul class="dictionaryList">
                    <li v-for="(item,idx) in editDictionary.value" :key="item.idx">
                        <el-input style="width:85%;" size="small" type="text" v-model.trim="item.name"></el-input>
                        <el-button type="text" v-if="idx >= defaultLength" @click="handleDelItem(idx)">删除</el-button>
                        <!-- <el-button type="text" @click="handleDelItem(idx)">删除</el-button> -->
                    </li>
                </ul>
                <el-button class="save-btn" type="primary" @click="handleSave">保存</el-button>
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
            dialogShow:false,
            allocation:1,
            defaultLength:0,
            tableData: [],
            editDictionary:{
                name:'',
                value:[]
            },
            editId:0,
            pageInfo: {
                total: 0,
                pageSize: 10,
                currentPage: 1,
            },
        };
    },
    created(){
        this.getDictionaryList();
    },
    methods: {
        getDictionaryList(){
            request(this.ajaxUrl.dictionaryList,{
                page:this.pageInfo.currentPage,
                pageSize:this.pageInfo.pageSize
            },'get').then((res)=>{
                this.tableData = res.data;
                this.pageInfo.total = res.meta.total;
                // this.$store.commit('user/SET_DICTIONART',res.data);
            }).catch((err)=>{
                console.log(err)
            })
        },
        // 编辑配置项目
        handleEdit(item){
            item = JSON.parse(JSON.stringify(item));
            this.defaultLength = item.value.length;
            this.editDictionary = item;
            this.dialogShow = true;
        },
        // 新增项目值
        handleAddItem(){
            this.editDictionary.value.push({
                name:''
            })
        },
        // 删除新增的项目值
        handleDelItem(idx){
            this.editDictionary.value.splice(idx,1);
        },
        // 保存修改后的配置项目
        handleSave(){
            let hasEmpty = JSON.stringify(this.editDictionary).includes('""');
            if(hasEmpty){
                this.$message.warning('项目值不能为空');
                return;
            }else{
                request(this.ajaxUrl.editDictionary + this.editDictionary.id,{
                    value:JSON.stringify(this.editDictionary.value)
                },'patch').then((res)=>{
                    this.$message.success('保存成功');
                    this.editDictionary={
                        name:'',
                        value:[]
                    };
                    this.dialogShow = false;
                    this.getDictionaryList();
                    this.$store.dispatch('user/getDictionary');
                }).catch((err)=>{
                    console.log(err)
                })
            }
        },
        // 关闭编辑弹框
        handleClose(done){
            this.editDictionary={
                name:'',
                value:[]
            };
            done();
        },
        pageChange(val) {
            this.pageInfo.currentPage = val;
            this.getDictionaryList();
        },
    },
};
</script>

<style lang="less" scoped>
.dictionary {
    .dictionaryEdit{
        width: 100%;
        text-align: center;
        .allocation{
            width: 300px;
            height: 40px;
            border: 1px solid #eee;
            margin: 0 auto;
            text-align: center;
            line-height: 40px;
            position: relative;
            padding-right: 70px;
            .add-btn{
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 5px;
            }

        }
        .dictionaryList{
            width: 100%;
            margin-top: 20px;
            max-height: 300px;
            overflow-y: auto;
            >li{
                width: 300px;
                height: 36px;
                margin: 0 auto;
                margin-bottom: 15px;
                text-align: left;
            }
        }
        .allocation-value{
            width: 300px;
            margin-top: 20px;
        }
        .save-btn{
            margin-top: 30px;
            width: 300px;
        }
    }
}
</style>