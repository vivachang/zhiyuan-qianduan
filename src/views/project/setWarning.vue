<template>
    <div class="setWarning">
        <div class="project-name">
            <span>项目名称</span>
            <el-input style="width:200px;" v-model="projectName" size="small" disabled></el-input>
        </div>
        <div class="tableContent">
            <el-table
                class="header-border td-input"
                :data="tableData"
                style="width: 100%">
                <el-table-column
                    prop="name"
                    align="left"
                    label="项目阶段">
                </el-table-column>
                <el-table-column
                    prop="standard"
                    align="left"
                    label="监测标准">
                </el-table-column>
                <el-table-column align="left" label="甲醛">
                    <el-table-column
                        align="left"
                        label="合格"
                        width="120">
                        <template slot-scope="scope">
                            <el-input maxlength="5" size="small" @change="(val)=>{handleChange('formaldehyde',val,scope.row.formaldehyde,'pass')}" :disabled="scope.row.formaldehyde.pass==null" v-model.trim="scope.row.formaldehyde.pass"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="left"
                        label="污染"
                        width="120">
                        <template slot-scope="scope">
                            <el-input maxlength="5" size="small" @change="(val)=>{handleChange('formaldehyde',val,scope.row.formaldehyde,'fail')}" :disabled="scope.row.formaldehyde.fail==null" v-model.trim="scope.row.formaldehyde.fail"></el-input>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="left" label="TVOC">
                    <el-table-column
                        align="left"
                        label="合格"
                        width="120">
                        <template slot-scope="scope">
                            <el-input maxlength="5" size="small" @change="(val)=>{handleChange('TVOC',val,scope.row.TVOC,'pass')}" :disabled="scope.row.TVOC.pass==null" v-model.trim="scope.row.TVOC.pass"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="left"
                        label="污染"
                        width="120">
                        <template slot-scope="scope">
                            <el-input maxlength="5" size="small" @change="(val)=>{handleChange('TVOC',val,scope.row.TVOC,'fail')}" :disabled="scope.row.TVOC.fail==null" v-model.trim="scope.row.TVOC.fail"></el-input>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="left" label="pm2.5">
                    <el-table-column
                        align="left"
                        label="合格"
                        width="120">
                        <template slot-scope="scope">
                            <el-input maxlength="7" size="small" @change="(val)=>{handleChange('PM25',val,scope.row.PM25,'pass')}" :disabled="scope.row.PM25.pass==null" v-model.trim="scope.row.PM25.pass"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="left"
                        label="污染"
                        width="120">
                        <template slot-scope="scope">
                            <el-input maxlength="7" size="small" @change="(val)=>{handleChange('PM25',val,scope.row.PM25,'fail')}" :disabled="scope.row.PM25.fail==null" v-model.trim="scope.row.PM25.fail"></el-input>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="left" label="co2">
                    <el-table-column
                        align="left"
                        label="合格"
                        width="120">
                        <template slot-scope="scope">
                            <el-input maxlength="7" size="small" @change="(val)=>{handleChange('CO2',val,scope.row.CO2,'pass')}" :disabled="scope.row.CO2.pass==null" v-model.trim="scope.row.CO2.pass"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="left"
                        label="污染"
                        width="120">
                        <template slot-scope="scope">
                            <el-input maxlength="7" size="small" @change="(val)=>{handleChange('CO2',val,scope.row.CO2,'fail')}" :disabled="scope.row.CO2.fail==null" v-model.trim="scope.row.CO2.fail"></el-input>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="left" label="温度">
                    <el-table-column
                        align="left"
                        label="合格"
                        width="120">
                        <template slot-scope="scope">
                            <el-input maxlength="5" size="small" @change="(val)=>{handleChange('temperature',val,scope.row.temperature,'pass')}" :disabled="scope.row.temperature.pass==null" v-model.trim="scope.row.temperature.pass"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="left"
                        label="污染"
                        width="120">
                        <template slot-scope="scope">
                            <el-input maxlength="5" size="small" @change="(val)=>{handleChange('temperature',val,scope.row.temperature,'fail')}" :disabled="scope.row.temperature.fail==null" v-model.trim="scope.row.temperature.fail"></el-input>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="left" label="湿度">
                    <el-table-column
                        align="left"
                        label="合格"
                        width="120">
                        <template slot-scope="scope">
                            <el-input maxlength="3" size="small" @change="(val)=>{handleChange('humidity',val,scope.row.humidity,'pass')}" :disabled="scope.row.humidity.pass==null" v-model.trim="scope.row.humidity.pass"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="left"
                        label="污染"
                        width="120">
                        <template slot-scope="scope">
                            <el-input maxlength="3" size="small" @change="(val)=>{handleChange('humidity',val,scope.row.humidity,'fail')}" :disabled="scope.row.humidity.fail==null" v-model.trim="scope.row.humidity.fail"></el-input>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>

            
        </div>
        <div class="setWarning-btn">
            <el-button size="small" @click="handleSave" type="primary">保存</el-button>
            <el-button size="small" @click="handleCancel">取消</el-button>
        </div>
    </div>
</template>
<script>
import regExp from "@/utils/regExp";
import request from "@/utils/request";
export default {
    name:'setWarning',
    data(){
        return {
            projectName:'',
            projectInfo:{},
            projectId:'',
            tableData: [],
            isSubmit:true,
        }
    },
    created(){
        this.projectId = this.$route.params.id;
        this.getProjectInfo();
    },
    methods:{
        handleChange(type,val,obj,key){ //验证
            const {checkNumber,_checkFormaldehyde,_checkTVOC,checkPM25,checkCO2,checkTemperature,checkHumidity} = regExp;
            if(val==''){
                return
            }
            let isNumber = checkNumber('',val,()=>{});
            if(!isNumber){
                this.$message.warning('只能输入数字');
                obj[key] = '';
                return;
            }
            // console.log(type,val,checkFormaldehyde)
            switch(type){
                case 'formaldehyde':        //甲醛
                    _checkFormaldehyde('',val,(err)=>{
                        if(err){
                            this.$message.warning('输入的值只能在0-0.3之间');
                            obj[key] = '';
                            return;
                        }
                        let str = String(val).split('.')[1] || '';
                        if(str.length>3){
                            obj[key] = (String(val).split('.')[0] || '0') + '.' + str.slice(0,3);
                        }
                    })
                    break;
                case 'TVOC':        //TVOC
                    _checkTVOC('',val,(err)=>{
                        if(err){
                            this.$message.warning('输入的值只能在0-1之间');
                            obj[key] = '';
                            return;
                        }
                        let str = String(val).split('.')[1] || '';
                        if(str.length>3){
                            obj[key] = (String(val).split('.')[0] || '0') + '.' + str.slice(0,3);
                        }
                    })
                    break;
                
                case 'PM25':        //PM25
                    checkPM25('',val,(err)=>{
                        if(err){
                            this.$message.warning('输入的值只能在0-100之间');
                            obj[key] = '';
                            return;
                        }
                        let str = String(val).split('.')[1] || '';
                        if(str.length>3){
                            obj[key] = (String(val).split('.')[0] || '0') + '.' + str.slice(0,3);
                        }
                    })
                    break;
                
                case 'CO2':        //CO2
                    checkCO2('',val,(err)=>{
                        if(err){
                            this.$message.warning('输入的值只能在0-1500之间');
                            obj[key] = '';
                            return;
                        }
                        let str = String(val).split('.')[1] || '';
                        if(str.length>2){
                            obj[key] = (String(val).split('.')[0] || '0') + '.' + str.slice(0,2);
                        }
                    })
                    break;
                
                case 'temperature':        //温度
                    checkTemperature('',val,(err)=>{
                        if(err){
                            this.$message.warning('输入的值只能在-50-50之间');
                            obj[key] = '';
                            return;
                        }
                        let str = obj[key].split('.')[1] || '';
                        if(str.length>1){
                            obj[key] =(String(val).split('.')[0] || '0') + '.' + str.slice(0,1);
                        }
                    })
                    break;
                
                case 'humidity':        //湿度
                    checkHumidity('',val,(err)=>{
                        if(err){
                            this.$message.warning('输入的值只能在0-100之间且只能为整数');
                            obj[key] = '';
                            return;
                        }
                    })
                    break;
                
            }

            if(key=='pass'){
                if(obj['fail']!="" && val >= obj['fail']){
                    this.$message.warning('合格值必须小于污染值');
                    obj[key] = '';
                }
            }else{
                if(obj['pass']!="" && val <= obj['pass']){
                    this.$message.warning('污染值必须大于合格值');
                    obj[key] = '';
                }
            }
        },
        getProjectInfo(){
            request(this.ajaxUrl.projectsInfo + this.projectId,{

            },'get').then((res)=>{
                this.resizeDataLeading(res.stages);
                this.projectInfo = res;
                this.projectName = res.name;
            }).catch((err)=>{
                console.log(err)
            })
        },
        //数据整理 -- 将后台返回的数据 转换成页面渲染需要的数据格式
        resizeDataLeading(data){
            let list = data.map((item)=>{
                let itemData = {},thresholds = item.thresholds,thresholdinfo = item.pro_thresholdinfo ? JSON.parse(item.pro_thresholdinfo) : JSON.parse(thresholds.thresholdinfo);
                itemData.name = item.stage_name;
                itemData.standard = thresholds.name;
                itemData.id = item.id;
                this.publicObj.defaultThreshold.map((publicItem)=>{
                    itemData[publicItem.type] = {
                        pass:thresholdinfo[publicItem.type] ? thresholdinfo[publicItem.type].split('~')[0] : null,
                        fail:thresholdinfo[publicItem.type] ? thresholdinfo[publicItem.type].split('~')[1] : null
                    }
                });
                return itemData
            });
            this.tableData = list;
        },
        // 取消
        handleCancel(){
            this.$router.replace({name:'earlyWarning'});
        },
        initPromiseArr(stages,sendData){
            let promiseArr = [];
            for(let i=0,len=stages.length;i<len;i++){
                let url='',method='',data={},thresholdinfo='',thresholds_id = stages[i].pro_thresholds_id;
                let mockData = {};
                Object.keys(sendData[i]).map((key)=>{
                    let _value = sendData[i][key];
                    if(typeof(_value) === 'object'){
                        if(_value.pass!=null && _value.fail!=null){
                            mockData[key] = _value.pass + '~' + _value.fail;
                        }
                    }
                })
                thresholdinfo = JSON.stringify(mockData);
                if(!thresholds_id){
                    url = this.ajaxUrl.addProjectsWarning + this.projectId + '/thresholds';
                    method = 'post';
                    data.thresholdinfo = thresholdinfo;
                    data.stage_id = stages[i].id;
                }else{
                    url = this.ajaxUrl.addProjectsWarning + this.projectId + '/thresholds/' + thresholds_id;
                    method = 'patch';
                    data.thresholdinfo = thresholdinfo;
                }
                promiseArr.push(
                    request(url,{
                        ...data
                    },method)
                )
            }
            return promiseArr
        },
        // 保存
        handleSave(){
            if(JSON.stringify(this.tableData).includes('""')){
                this.$message.warning('阈值不能为空');
                return
            }
            Promise.all(this.initPromiseArr(this.projectInfo.stages,this.tableData))
                .then((resList)=>{
                    this.$message.success('设置成功');
                    setTimeout(()=>{
                        this.$router.replace({name:'earlyWarning'});
                    },500)
                }).catch((err)=>{
                    console.log(err)
                })
        }
    }
}
</script>
<style lang="scss" scoped>
.setWarning{
    .project-name{
        margin-bottom: 20px;
        >span{
            display: inline-block;
            margin-right: 15px;
            font-size: 12px;
            color: #8a8a8a;
        }
    }
    .tableContent{
        padding-bottom: 30px;
        border-bottom: 1px solid #ddd;
    }
}
</style>

