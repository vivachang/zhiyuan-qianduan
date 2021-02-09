<template>
    <div class="projectForm mainPage">
        <div class="project-item">
            <div class="form-title">基本信息</div>
            <el-form :model="informationForm" :inline="true" :rules="informationRules" size="small" ref="informationForm" label-width="100px">
                <el-form-item label="项目名称" prop="name" style="width:300px;">
                    <el-input v-model="informationForm.name" placeholder="请输入项目名称" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="所属客户" prop="customer_id" style="width:300px;">
                    <el-select v-model="informationForm.customer_id" filterable placeholder="请输入客户名称">
                        <el-option
                            v-for="item in customsList"
                            :key="item.id"
                            :label="item.company_name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="项目负责人" prop="project_manage_name" style="width:300px;">
                    <el-input v-model="informationForm.project_manage_name" placeholder="请输入项目负责人" maxlength="20"></el-input>
                </el-form-item>
                <br/>
                <el-form-item label="负责人电话" prop="project_manage_tel" style="width:300px;">
                    <el-input v-model="informationForm.project_manage_tel" placeholder="请输入负责人电话" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="设备管理人" style="width:300px;">
                    <el-input v-model="informationForm.device_manage_name" placeholder="请输入设备管理人" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="管理人电话" style="width:300px;">
                    <el-input v-model="informationForm.device_manage_tel" placeholder="请输入管理人电话" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item class="block-form-item" label="项目地址" style="width:620px;">
                    <el-input v-model="informationForm.address" placeholder="请输入项目地址" maxlength="100"></el-input>
                </el-form-item>
                <el-form-item class="block-form-item" label="项目备注" style="width:620px;">
                    <el-input v-model="informationForm.memo" placeholder="请输入项目备注" maxlength="100"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="project-item">
            <div class="form-title">项目指标参考标准</div>
            <el-form :model="standardForm" :rules="standardRules" size="small" ref="standardForm" label-width="100px">
                <el-form-item label="甲醛" prop="hcho" style="width:420px;">
                    <el-input v-model="standardForm.hcho" placeholder="请填入甲醛参考标准值"></el-input>
                    <span class="hint">根据GB18883-2002甲醛标准为0.08</span>
                </el-form-item>
                <el-form-item label="TOVC" prop="tvoc" style="width:420px;">
                    <el-input v-model="standardForm.tvoc" placeholder="请填入TOVC参考标准值"></el-input>
                    <span class="hint">根据GB18883-2020TVOC标准为0.6</span>
                </el-form-item>
            </el-form>
        </div>
        <div class="project-item">
            <div class="form-title">项目阶段</div>
            <div class="stage-box">
                <div class="project-stage">
                    <div class="stage-title">施工阶段</div>
                    <ul class="stage-list">
                        <li class="stage-item" v-for="(item,idx) in stageInfo.construction" :key="idx">
                            <span>阶段{{idx+1}}</span>
                            <el-input size="small" style="width:320px" placeholder="请输入阶段名称" v-model.trim="item.stage_name"></el-input>
                            <el-date-picker
                                class="dayPicker"
                                value-format="yyyy-MM-dd"
                                @change="handleChangeTime('construction',idx)"
                                v-model="item.time"
                                size="small"
                                type="daterange"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                            <el-select v-model="item.threshold_id" size="small" placeholder="请选择监测标准">
                                <el-option
                                    v-for="item in thresholdsList"
                                    :key="item.id"
                                    :label="item.name"
                                    v-show="item.status===1"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                            <el-button v-if="idx!=0" type="text" size="small" @click="handleDelStage('construction',idx)">删除</el-button>
                        </li>
                    </ul>
                    <div class="stage-btn">
                        <el-button size="small" @click="handleAddStage('construction')">+添加新阶段</el-button>
                    </div>
                </div>
                <div class="project-stage">
                    <div class="stage-title">交付阶段</div>
                    <ul class="stage-list">
                        <li class="stage-item" v-for="(item,idx) in stageInfo.deliver" :key="idx">
                            <span>阶段{{idx+1}}</span>
                            <el-input size="small" style="width:320px" placeholder="请输入阶段名称" v-model="item.stage_name"></el-input>
                            <el-date-picker
                                class="dayPicker"
                                value-format="yyyy-MM-dd"
                                @change="handleChangeTime('deliver',idx)"
                                v-model="item.time"
                                size="small"
                                type="daterange"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                            <el-select v-model="item.threshold_id" size="small" placeholder="请选择监测标准">
                                <el-option
                                    v-for="item in thresholdsList"
                                    :key="item.id"
                                    :label="item.name"
                                    v-show="item.status===1"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                            <el-button v-if="idx!=0" type="text" size="small" @click="handleDelStage('deliver',idx)">删除</el-button>
                        </li>
                    </ul>
                    <div class="stage-btn">
                        <el-button size="small" @click="handleAddStage('deliver')">+添加新阶段</el-button>
                    </div>
                </div>
                <div class="project-stage">
                    <div class="stage-title">运维阶段</div>
                    <ul class="stage-list">
                        <li class="stage-item" v-for="(item,idx) in stageInfo.maintain" :key="idx">
                            <span>阶段{{idx+1}}</span>
                            <el-input size="small" style="width:320px" placeholder="请输入阶段名称" v-model="item.stage_name"></el-input>
                            <el-date-picker
                                class="dayPicker"
                                value-format="yyyy-MM-dd"
                                @change="handleChangeTime('maintain',idx)"
                                v-model="item.time"
                                size="small"
                                type="daterange"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                            <el-select v-model="item.threshold_id" size="small" placeholder="请选择监测标准">
                                <el-option
                                    v-for="item in thresholdsList"
                                    :key="item.id"
                                    :label="item.name"
                                    v-show="item.status===1"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                            <el-button v-if="idx!=0" type="text" size="small" @click="handleDelStage('maintain',idx)">删除</el-button>
                        </li>
                    </ul>
                    <div class="stage-btn">
                        <el-button size="small" @click="handleAddStage('maintain')">+添加新阶段</el-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="project-item">
            <div class="form-title">平面图信息</div>
            <div class="region-box">
                <div class="project-region">
                    <ul class="region-list">
                        <li class="region-item" v-for="(regionItem,idx) in regionList" :key="regionItem.id || idx">
                            <div class="region-name">
                                <span class="item-tit">区域{{idx+1}}</span>
                                <el-input placeholder="请输入区域名称" maxlength="10" v-model.trim="regionItem.area_name" size="small" style="width:320px;"></el-input>
                                <el-button type="text" @click="handleDelRegion(idx,regionItem)">删除</el-button>
                            </div>
                            <div class="region-img">
                                <span class="item-tit">图纸</span>
                                <div class="region-upload-img">
                                    <uploadImg :idx="idx" :removeBtn="regionItem.edit_flg" :imgUrl="regionItem.img" @afterUpload="afterUpload" @afterRemove="afterRemove"/>
                                </div>
                                <div class="region-hint">
                                    <p>建议尺寸像素</p>
                                    <p>图片大小最大1MB</p>
                                    <p>图片支持png,jpeg,jpg</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="region-btn">
                        <el-button size="small" @click="handleAddRegion">+添加新平面图</el-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="project-btn">
            <el-button type="primary" size="small" @click="handleSave">保存</el-button>
            <el-button size="small" @click="handleCancle">取消</el-button>
        </div>
    </div>
</template>
<script>
import uploadImg from '@/components/Public/uploadImg';
import regExp from '@/utils/regExp.js';
import request from "@/utils/request";
export default {
    name:'projectForm',
    data(){
        return{
            thresholdsList:[      //监测标准
            ],
            // 所属客户列表
            customsList: [],
            // 基本信息
            informationForm:{
                name:'',
                address:'',
                customer_id:'',
                project_manage_name:'',
                project_manage_tel:'',
                device_manage_name:'',
                device_manage_tel:'',
                memo:''
            },
            // 参考标准
            standardForm:{
                hcho:'',
                tvoc:''
            },
            // 基本信息-验证规则
            informationRules:{
                name: [
                    { required: true, message: '请输入项目名称', trigger: 'blur' }
                ],
                customer_id:[
                    { required: true, message: '请选择所属客户', trigger: 'blur' }
                ],
                project_manage_name:[
                    { required: true, message: '请输入项目负责人', trigger: 'blur' }
                ],
                project_manage_tel:[
                    { required: true, message: '请输入项目负责人电话', trigger: 'blur' }
                ]
            },
            // 参考标准-验证规则
            standardRules:{
                hcho: [
                    { required: true, message: '请输入参考标准', trigger: 'blur' },
                    { validator: regExp.checkNumber, trigger: 'blur' },
                    { validator: regExp.checkFormaldehyde, trigger:'blur'}
                ],
                tvoc:[
                    { required: true, message: '请输入参考标准', trigger: 'blur' },
                    { validator: regExp.checkNumber, trigger: 'blur' },
                    { validator: regExp.checkTVOC, trigger:'blur'}
                ]
            },
            // 项目阶段
            stageInfo:{
                construction:[
                    {
                        stage_name:'',
                        time:[],
                        threshold_id:'',
                        default:1,
                        stage:1
                    }
                ],
                deliver:[
                    {
                        stage_name:'',
                        time:[],
                        threshold_id:'',
                        default:1,
                        stage:2
                    }
                ],
                maintain:[
                    {
                        stage_name:'',
                        time:[],
                        threshold_id:'',
                        default:1,
                        stage:3
                    }
                ]
            },
            // 区域信息相关
            regionList:[    
                {
                    id:'',
                    area_name:'',
                    img:'',
                    edit_flg:true
                }
            ],
            delStageIds:[],
            delAreaIds:[],
            dialogVisible: false,
            bigImgUrl:'',
            projectId:''
        }
    },
    created(){
        this.getCustomsList();
        this.getThresholdsList();
        if(this.$route.params.id){
            this.projectId = this.$route.params.id;
            // console.log('编辑-获取详情');
            this.getProjectInfo();
        }else{
            
        }
    },
    methods:{
        // 获取监测标准列表
        getThresholdsList(){
            // request(this.ajaxUrl.projectThresholdsList,{
            request(this.ajaxUrl.thresholdsList,{
                page:1,
                pageSize:999999
            },'get').then((res)=>{
                this.thresholdsList = res.data;
            }).catch((err)=>{
                console.log(err);
            })
        },
        // 获取客户列表
        getCustomsList(){
            request(this.ajaxUrl.customsList,{
                page:1,
                pageSize:999999
            },'get').then((res)=>{
                this.customsList = res.data;
            }).catch((err)=>{
                console.log(err);
            })
        },
        // 获取项目详细数据
        getProjectInfo(){
            request(this.ajaxUrl.projectsInfo + this.projectId,{

            },'get').then((res)=>{
                this.resizeDataLeading(res);
            }).catch((err)=>{
                console.log(err)
            })
        },
        resizeDataLeading(data){       //数据整理 -- 将后台返回的数据 转换成页面渲染需要的数据格式
            //基本信息
            this.informationForm.name = data.name;
            this.informationForm.address = data.address;
            this.informationForm.customer_id = data.customs[0] && data.customs[0].id;
            this.informationForm.project_manage_name = data.project_manage_name;
            this.informationForm.project_manage_tel = data.project_manage_tel;
            this.informationForm.device_manage_name = data.device_manage_name;
            this.informationForm.device_manage_tel = data.device_manage_tel;
            this.informationForm.memo = data.memo;
            // 项目指标参考标准
            this.standardForm.hcho = data.hcho;
            this.standardForm.tvoc = data.tvoc;
            // 项目阶段
            data.stages.map((item)=>{
                let itemObj = {};
                itemObj.time = [item.start_date,item.end_date];
                itemObj.stage_name = item.stage_name;
                itemObj.threshold_id = item.threshold_id;
                itemObj.default = item.default;
                itemObj.stage = item.stage;
                itemObj.id = item.id;
                switch(item.stage){
                    case 1:
                        this.stageInfo.construction.push(itemObj);
                        break;
                    case 2:
                        this.stageInfo.deliver.push(itemObj);
                        break;
                    case 3:
                        this.stageInfo.maintain.push(itemObj);
                        break;
                }
            });
            this.stageInfo.construction.shift();
            this.stageInfo.deliver.shift();
            this.stageInfo.maintain.shift();
            // 区域信息
            if(data.areas){
                this.regionList = data.areas.map((item)=>{
                    return {
                        id:item.id,
                        area_name:item.area_name,
                        img:item.file && item.file.path,
                        img_id:item.file && item.file.id,
                        edit_flg:item.edit_flg
                    }
                });
            }
            
        },
        resizeDataServer(){         //数据整理 -- 将页面渲染的数据  转换成 接口需要的数据格式
            let data = {};
            let stageInfo = JSON.parse(JSON.stringify(this.stageInfo))
            // 基本信息、项目指标参考标准
            data = {...this.informationForm,...this.standardForm};
            // 项目阶段
            data.stages = [];
            console.log(data,11111);
            Object.keys(stageInfo).map((key)=>{
                let item = {};
                data.stages = [...data.stages,...stageInfo[key]];
            });
            data.stages = data.stages.map((item)=>{
                item.start_date = item.time[0];
                item.end_date = item.time[1];
                delete item.time;
                return item;
            });
            data.stages = JSON.stringify(data.stages);
            // 区域信息
            data.areas = [];
            data.areas = this.regionList.map((item)=>{
                return {
                    area_name:item.area_name,
                    file:item.img_id,
                    id:item.id
                }
            });
            data.areas = JSON.stringify(data.areas);
            return data;
        },
        afterUpload(response,idx){  //图纸上传完成后
            this.regionList[idx].img = response.path;
            this.regionList[idx].img_id = response.id;
        },
        afterRemove(idx){  //移除已上传的图纸
            this.regionList[idx].img = "";
        },
        handleCancle(){     //取消
            this.$router.push({name:'projectList'});
        },
        handleSave(){   //保存项目信息
            if(this.checkForm()){
                if(this.projectId){ //编辑
                    const data = this.resizeDataServer();
                    request(this.ajaxUrl.updateProjects + this.projectId,{
                        ...data,
                        stages_del:this.delStageIds.join(','),
                        areas_del:this.delAreaIds.join(',')
                    },'PUT').then((res)=>{
                        this.$message.success('编辑成功');
                        this.delAreaIds = [];
                        this.delStageIds = [];
                        this.$router.replace({name:'projectList'});
                    }).catch((err)=>{
                        console.log(err);
                    })
                }else{      //新增
                    const data = this.resizeDataServer();
                    request(this.ajaxUrl.addPorjects,{
                        ...data
                    },'post').then((res)=>{
                        this.$message.success('新增项目成功');
                        this.$router.replace({name:'projectList'});
                    }).catch((err)=>{
                        console.log(err);
                    })
                }
            }
        },
        checkForm(){        //检测内容是否填写完整
            let infoComplete = false,standComplete = false;
            // 验证基本信息
            this.$refs['informationForm'].validate((valid) => {
                if (valid) {
                    infoComplete = true;
                } else {
                    infoComplete = false;
                    return false;
                }
            });
            // 验证项目指标参考标准
            this.$refs['standardForm'].validate((valid) => {
                if (valid) {
                    standComplete = true;
                } else {
                    standComplete = false;
                    return false;
                }
            });
            if(!infoComplete){
                this.$message({
                    message: '项目基本信息错误',
                    type: 'warning'
                });
                return false;
            }
            if(!standComplete){
                this.$message({
                    message: '项目指标参考标准错误',
                    type: 'warning'
                });
                return false;
            }
            // 验证项目阶段
            if(JSON.stringify(this.stageInfo).indexOf('""') !== -1){
                this.$message({
                    message: '项目阶段信息错误',
                    type: 'warning'
                });
                return false;
            }
            // 验证区域信息
            let regionComplete = this.regionList.every((item)=>{
                return item.area_name
            });
            if(!regionComplete){
                this.$message({
                    message: '区域信息错误',
                    type: 'warning'
                });
                return false;
            }
            
            return true
        },
        handleDelRegion(idx,item){       //删除区域信息
            if(item.edit_flg){
                this.$confirm('确定要删除该区域？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if(!item.isAdd){
                        this.delAreaIds.push(item.id)
                    }
                    this.regionList.splice(idx,1);
                }).catch(() => {})
            }else{
                this.$message.warning('不能删除存在监测点的区域');
            }
        },  
        handleAddRegion(){      //添加新区域
            this.regionList.push({
                name:'',
                img:'',
                id:'',
                edit_flg:true,
                isAdd:true
            })
        },
        // 项目阶段设置起止时间
        handleChangeTime(activeKey,idx){
            let begin = [],over = [];
            for(let key in this.stageInfo){
                this.stageInfo[key].map((item)=>{
                    if(item.time.length!=0){
                        begin.push(item.time[0]);
                        over.push(item.time[1]);
                    }
                })
            };
            if(!this.checkTime(begin,over)){
                this.stageInfo[activeKey][idx].time=[];
            }
        },  
        // 检测时间段是否存在交叉
        checkTime(begin,over){
            let beginSort = [...begin].sort(),overSort = [...over].sort();
            for(let i=1;i<beginSort.length;i++){
                if(beginSort[i] <= overSort[i-1]){
                    this.$message({
                        message: '时间段与其他阶段重复，请选择正确的时间段',
                        type: 'warning'
                    });
                    return false
                }
            }
            if(JSON.stringify(begin) !== JSON.stringify(beginSort) || JSON.stringify(over) !== JSON.stringify(overSort)){     //开始时间/结束时间 顺序正确(后一个阶段的  开始时间/结束时间 必须在前一个阶段之后)
                this.$message({
                    message: '后一个阶段的时间必须在前一个阶段之后',
                    type: 'warning'
                });
                return false
            }       
            return true
        },
        // 添加项目阶段
        handleAddStage(key){
            let isFillInTime = false,stage=1;
            switch(key){
                case 'construction':
                    stage = 1;
                    break;
                case 'deliver':
                    stage = 2;
                    break;
                case 'maintain':
                    stage = 3;
                    break;
            };
            isFillInTime = this.stageInfo[key].every((item)=>{
                return item.time.length>0
            });
            if(isFillInTime){
                this.stageInfo[key].push({
                    stage_name:'',
                    time:[],
                    threshold_id:'',
                    default:0,
                    stage:stage
                })
            }else{
                this.$message({
                    message: '项目阶段时间未填写完整',
                    type: 'warning'
                });
            }
        },
        //删除项目阶段
        handleDelStage(key,idx){
            this.$confirm('确定要删除该阶段？','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res)=>{
                if(this.stageInfo[key][idx].id){
                    this.delStageIds.push(this.stageInfo[key][idx].id);
                }
                this.stageInfo[key].splice(idx,1);
            }).catch(()=>{})
        } 
    },
    components:{
        uploadImg
    }
}
</script>
<style lang="scss" scoped>
.projectForm{
    width: 100%;
    min-height: 100vh;
    background-color: #fff;
    border-radius: 4px;
    padding: 24px;
    .form-title{
        font-size: 14px;
        color: #000;
        margin-bottom: 20px;
    }
    .project-item{
        width: 100%;
        border-bottom: 1px solid #eaeaea;
        padding-bottom: 20px;
        margin-top: 20px;
        .block-form-item{
            display: block;
            .el-input{
                width: 515px !important;
            }
        }
        &:nth-of-type(1){
            margin-top: 0;
        }
        .hint{
            font-size: 12px;
            color: #5a66ff;
        }
        .stage-box{
            padding-left: 21px;
            .project-stage{
                width: 100%;
                border: 1px solid #ddd;
                border-radius: 4px;
                overflow: hidden;
                font-size: 12px;
                margin-bottom: 22px;
                .stage-title{
                    height: 40px;
                    line-height: 40px;
                    padding-left: 20px;
                    color: #000;
                    background-color: #f5f5f5;
                    border-bottom: 1px solid #ddd;
                }
                .stage-list{
                    .stage-item{
                        padding-left: 20px;
                        min-height: 54px;
                        line-height: 54px;
                        border-bottom: 1px solid #ddd;
                        >span{
                            margin-right: 30px;
                            color: #b0b0b0;
                        }
                    }
                }
                .stage-btn{
                    padding-left: 20px;
                    height: 54px;
                    line-height: 54px;
                }
            }
        }
        .region-box{
            padding-left: 21px;
            .project-region{
                width: 100%;
                border: 1px solid #ddd;
                border-radius: 4px;
                overflow: hidden;
                font-size: 12px;
                margin-bottom: 22px;
                .region-list{
                    .region-item{
                        padding-left: 20px;
                        padding-top: 12px;
                        height: 127px;
                        border-bottom: 1px solid #ddd;
                        >div{
                            .item-tit{
                                display: inline-block;
                                width: 68px;
                                color: #b0b0b0;
                            }
                            &.region-img{
                                margin-top: 6px;
                                .item-tit{
                                    vertical-align: top;
                                }
                                .region-upload-img{
                                    width: 60px;
                                    height: 60px;
                                    line-height: 60px;
                                    display: inline-block;
                                    border: 1px dashed #ddd;
                                    border-radius: 4px;
                                    position: relative;
                                }
                                .region-hint{
                                    display: inline-flex;
                                    height: 60px;
                                    font-size: 12px;
                                    color: #9b9b9b;
                                    flex-direction: column;
                                    justify-content: space-around;
                                    vertical-align: top;
                                    margin-left:12px;
                                }
                            }
                        }
                    }
                }
                .region-btn{
                    padding-left: 20px;
                    height: 54px;
                    line-height: 54px;
                }
            }
        }
    }
    .project-btn{
        margin-top: 20px;
    }
}
</style>


