<template>
    <div class="earlyWarning mainPage">
        <template v-if="showParent">
            <div class="filterBox">
                <el-input class="keywords fr" size="small" v-model="searchInfo.name" placeholder="输入项目名称查询">
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
                        label="项目名称">
                    </el-table-column>
                    <el-table-column
                        prop="customer"
                        label="所属客户">
                        <template slot-scope="scope">
                            <div>{{scope.row.customs[0] && scope.row.customs[0].company_name}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="预警提醒时间">
                        <template slot-scope="scope">
                            <div>{{scope.row.waringsetting.length===0 ? '--' : (scope.row.waringsetting[0].remind_time!=0 ? scope.row.waringsetting[0].remind_time/60 + '小时' : '每次预警都提醒')}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="预警提醒百分比">
                        <template slot-scope="scope">
                            <div>{{scope.row.waringsetting.length===0 ? '--' : (scope.row.waringsetting[0].percentage*100).toFixed(0) + '%'}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="预警通知时间段">
                        <template slot-scope="scope">
                            <span v-if="scope.row.waringsetting.length===0">--</span>
                            <span v-else>
                                {{initTimeSolt(scope.row.waringsetting[0].notice_start_time,scope.row.waringsetting[0].notice_end_time)}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="150">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" v-btnRole="7" @click="$router.push({name:'setWarning',params:{id:scope.row.id}})">阈值设置</el-button>
                            <el-button type="text" size="mini" v-btnRole="8" @click="handleSet(scope.row)">预警条件</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <myPagination :pageInfo="pageInfo" @current-change="pageChange"/>
            </div>
            <el-dialog 
                title="预警条件"
                :visible.sync="dialogVisible" 
                :close-on-click-modal='false'
                width="600px">
                <el-form :model="formData" :rules="rules" ref="earlyWarningForm" label-position="top" label-width="100px" class="warehouseForm form-inline">
                    <el-form-item class="form-item-inline" label="预警提醒时间设置" prop="remind_time">
                        <el-select size="small" v-model="formData.remind_time" placeholder="请选择预警提醒时间">
                            <el-option label="每次预警都提示" :value="0"></el-option>
                            <el-option v-for="i in 24" :key="i" :label="i + '小时'" :value="i"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="form-item-inline" label="预警提醒百分比设置" prop="percentage">
                        <el-select size="small" v-model="formData.percentage" placeholder="请选择预警提醒百分比">
                            <el-option v-for="(item,idx) in percentages" :key="idx" :label="(item*100).toFixed(0) + '%'" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="form-item-inline" label="预警通知时间段" prop="time_slot">
                        <el-time-picker
                            size="small"
                            is-range
                            v-model="formData.time_slot"
                            format="HH:mm"
                            value-format="HH:mm"
                            range-separator=""
                            start-placeholder=""
                            end-placeholder=""
                            placeholder="选择时间段">
                        </el-time-picker>
                    </el-form-item>
                    <el-form-item label="预警消息接收人" prop="phones">
                        <el-input size="small" v-model.trim="formData.phones" placeholder="请填入电话号码，多个号码以逗号隔开"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click="handleCancel">取消</el-button>
                        <el-button size="small" @click="handleSubmit" type="primary">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </template>
        <router-view></router-view>
    </div>
</template>
<script>
import myPagination from '@/components/Public/myPagination';
import request from "@/utils/request";
export default {
    name:'earlyWarning',
    data(){
        return {
            showParent:true,
            dialogVisible:false,
            searchInfo:{
                name:''
            },
            percentages:[0.6,0.7,0.8,0.9,1.0,1.1,1.2,1.3,1.4,1.5],
            formData:{
                remind_time:2,
                percentage:1,
                time_slot:['00:00','23:59'],
                phones:''
            },
            warningSetInfo:{

            },
            rules:{
                remind_time:[
                    { required: true, message: '请选择预警提醒时间', trigger: 'blur' },
				],
				percentage:[
					{ required: true, message: '请选择预警提醒百分比', trigger: 'blur' }
				],
				time_slot:[
					{ required: true, message: '请选择预警通知时间段', trigger: 'blur' }
				],
				phones:[
					{ required: true, message: '请输入预警消息接收人', trigger: 'blur' }
				],
            },
            tableData:[],
            setMethod:'post',
            pageInfo:{
				total:0,
				pageSize:20,
				currentPage:1,
            }
        }
    },
    mounted(){
      if(this.$route.name === 'earlyWarning'){   //展示父组件列表
          this.showParent = true;
          this.getProjectsWarningList();
      }else{                        //展示子组件路由
          this.showParent = false;
      }  
    },
    methods:{
        resetForm(){
            this.formData = {
                remind_time:2,
                percentage:1,
                time_slot:['00:00','23:59'],
                phones:''
            }
        },
        handleSet(projectItem){
            this.dialogVisible = true;
            this.warningSetInfo = projectItem;
            let warningInfo = projectItem.waringsetting[0];
            if(projectItem.waringsetting.length===0){
                this.setMethod = 'post';
                this.resetForm();
            }else{
                this.setMethod = 'patch';
                this.formData.remind_time = warningInfo.remind_time/60;
                this.formData.percentage = warningInfo.percentage/1;
                this.formData.time_slot = this.initTimeSolt(warningInfo.notice_start_time,warningInfo.notice_end_time).split('--');
                this.formData.phones = warningInfo.notice_phone;
            }

        },
        // 格式化预警通知时间段
        initTimeSolt(start,end){
            let result_start = ('000' + start).slice(-4).split(''),
                result_end = ('000' + end).slice(-4).split('');
            result_start.splice(2,0,":");
            result_end.splice(2,0,":");
            return result_start.join('') + '--' + result_end.join('');
        },
        handleSearch(){
            this.pageInfo.currentPage = 1;
            this.getProjectsWarningList();
        },
        // 获取项目预警设置列表
        getProjectsWarningList(){
            request(this.ajaxUrl.projectsWarning,{
                include:'customs,thresholds,waringsetting',
                page:this.pageInfo.currentPage,
                pageSize:this.pageInfo.pageSize,
                name:this.searchInfo.name
            },'get').then((res)=>{
                this.tableData = res.data;
                this.pageInfo.total = res.meta.total;
            }).catch((err)=>{
                console.log(err);
            })
        },
        // 翻页
        pageChange(val){
            this.pageInfo.currentPage = val;
            this.getProjectsWarningList();
        },
        // 提交预警条件
        handleSubmit(){
            this.$refs['earlyWarningForm'].validate((valid) => {
                if (valid) {
                    console.log('验证通过,提交');
                    let wariningInfo = this.warningSetInfo.waringsetting;
                    let url = wariningInfo.length === 0 ? this.ajaxUrl.warningSet + this.warningSetInfo.id + '/waringsetting' : this.ajaxUrl.warningSet + this.warningSetInfo.id + '/waringsetting/' + wariningInfo[0].id
                    request(url,{
                        remind_time:this.formData.remind_time*60,
                        percentage:this.formData.percentage,
                        notice_start_time:Number(this.formData.time_slot[0].replace(':',"")),
                        notice_end_time:Number(this.formData.time_slot[1].replace(':',"")),
                        notice_phone:this.formData.phones
                    },this.setMethod).then((res)=>{
                        this.$message.success('预警条件设置成功');
                        this.dialogVisible = false;
                        this.getProjectsWarningList();
                    }).catch((err)=>{
                        console.log(err);
                    })
                } else {
                    return false;
                }
            });
        },
        // 取消设置预警条件
        handleCancel(){
            this.dialogVisible = false;
        },

    },
    components:{
        myPagination
    }
}
</script>

<style lang="scss" scoped>
.earlyWarning{
    padding: 20px;
    border-radius: 4px;
    background-color: #fff;

}
</style>
