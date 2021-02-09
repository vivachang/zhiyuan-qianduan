<template>
    <div class="thresholdEdit">
        <div class="filterBox">
            <div class="filterItem">
                <span>监测标准</span>
                <el-select v-model="thresholdId" @change="handleChange" size="small" placeholder="请选择">
                    <el-option v-for="(item,idx) in thresholdList" :key="idx" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </div>
        </div>
        <div class="tableContent">
            <div class="thresholdTable">
                <div class="table-title">
                    <div>指标名称</div>
                    <div>
                        <p>拖动圆点设置阈值</p>
                        <p>
                            <span>图例</span>
                            <span class="section low">优质</span>
                            <span class="section center">合格</span>
                            <span class="section high">污染</span>
                        </p>
                    </div>
                </div>
                <ul class="table-list">
                    <li v-for="(indexItem,idx) in indexList" :key="idx">
                        <div class="item-name">
                            <span>{{indexItem.name}}</span>
                            <div class="del-mask">
                                <el-button size="small" @click="handleDel(idx)">删除指标</el-button>
                            </div>
                        </div>
                        <div class="item-section">
                            <my-slider :idx="idx" @change="handleSliderChange" :step="indexItem.rangeInfo.step" :min="indexItem.rangeInfo.min" :max="indexItem.rangeInfo.max" :value="indexItem.value"/>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="add-btn">
                <el-button size="small" @click="dialogVisible = true">+新增指标</el-button>
            </div>
        </div>
        <div class="threshold-btn">
            <el-button size="small" type="primary" @click="handleSave">保存</el-button>
            <el-button size="small" @click="$router.go(-1)">取消</el-button>
        </div>
        <el-dialog 
            title="新增指标"
            :visible.sync="dialogVisible" 
            :close-on-click-modal='false'
            width="40%">
            <ul class="default-list">
                <el-button size="small" :disabled="isDisabled[idx]" v-for="(deItem,idx) in publicObj.defaultThreshold" :key="idx" @click="handleAddIndex(deItem)">{{deItem.name}}</el-button>
            </ul>
        </el-dialog>
    </div>
</template>
<script>
import mySlider from '@/components/Public/mySlider'
import request from "@/utils/request";
export default {
    name:'thresholdEdit',
    data(){
        return {
            dialogVisible:false,
            thresholdList:[],
            thresholdId:'',
            indexList:[],     //指标列表
                
            defaultList:[],
            editThreshold:{

            }
        }
    },
    created(){
        this.thresholdId = Number(this.$route.params.id);
        this.getThresholdsList();
        this.getThresholdsInfo();
    },
    computed:{
        isDisabled(item){
            let result = this.publicObj.defaultThreshold.map((item,idx)=>{
                return this.indexList.some((childItem,childIdx)=>{
                    return item.type === childItem.type
                })
            });
            return result
        }
    },
    methods:{
        // 获取监测标准详情
        getThresholdsInfo(){
            request(this.ajaxUrl.thresholdsInfo + this.thresholdId,{

            },'get').then((res)=>{
                res.thresholdinfo = res.thresholdinfo ? JSON.parse(res.thresholdinfo) : {};
                this.editThreshold = res;
                this.initIndexList();
            }).catch((err)=>{
                console.log(err)
            })
        },
        // 可选监测标准列表
        getThresholdsList(){
            request(this.ajaxUrl.thresholdsList,{
                page:1,
                pageSize:9999
            },'get').then((res)=>{
                this.thresholdList = res.data;
            }).catch((err)=>{
                console.log(err)
            })
        },
        initIndexList(){
            this.indexList = this.publicObj.defaultThreshold.filter((item)=>{
                let hasKey = !!this.editThreshold.thresholdinfo[item.type];
                if(hasKey){
                    if(item.type === 'PM25' || item.type === 'CO2'){
                        item.rangeInfo.step = 1;
                    }
                    item.value = this.editThreshold.thresholdinfo[item.type].split('~');
                }
                return hasKey
            });
        },
        handleSave(){
            let data = {};
            this.indexList.map((item)=>{
                data[item.type] = item.value.join('~');
            });
            request(this.ajaxUrl.editThresholds + this.thresholdId,{
                thresholdinfo:JSON.stringify(data)
            },'patch').then((res)=>{
                this.$message.success('保存成功');
            }).catch((err)=>{
                console.log(err);
            })
        },
        // 切换监测标准
        handleChange(newVal){
            const $route = this.$route;
            this.$router.replace({name:$route.name,params:{id:newVal}})
        },
        handleSliderChange(value,idx){
            this.indexList[idx].value = value;
        },
        // 新增指标
        handleAddIndex(item){
            if(item.type === 'PM25' || item.type === 'CO2'){
                item.rangeInfo.step = 1;
            }
            this.indexList.push({
                ...item,
                value:[item.rangeInfo.min,item.rangeInfo.max/2]
            });
            this.dialogVisible = false;
        },
        // 删除指标
        handleDel(idx){
            this.$confirm('确定删除此指标?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.indexList.splice(idx,1);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {});
        }
    },
    components:{
        mySlider
    }
}
</script>
<style lang="scss" scoped>
.thresholdEdit{
    width: 100%;
    .tableContent{
        min-height: 70vh;
        border-bottom: 1px solid #ddd;
        .thresholdTable{
            width: 100%;
            font-size: 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            overflow: hidden;
            .table-title{
                height: 40px;
                line-height: 40px;
                background-color: #f5f5f5;
                display: flex;
                justify-content: space-between;
                font-weight: 600;
                border-bottom: 1px solid #ddd;
                >div{
                    &:nth-of-type(1){
                        width: 120px;
                        text-align: center;
                        border-right: 1px solid #ddd;
                    }
                    &:nth-of-type(2){
                        flex: 1;
                        padding-left: 30px;
                        padding-right: 22px;
                        display: flex;
                        justify-content: space-between;
                        >p{
                            display: inline-block;
                            height: 100%;
                            .section{
                                font-weight: normal;
                                margin-left: 20px;
                                padding-left: 15px;
                                position: relative;
                                &::before{
                                    content:'';
                                    position: absolute;
                                    width: 10px;
                                    height: 10px;
                                    border-radius: 50%;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    left:0;
                                    background-color: #000;
                                }
                                &.low{
                                    &::before{
                                        background-color: #24cb7b;
                                    }
                                }
                                &.center{
                                    &::before{
                                        background-color: #ffb149;
                                    }
                                }
                                &.high{
                                    &::before{
                                        background-color: #ff5e5e;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .table-list{
                background-color: #fff;
                >li{
                    width: 100%;
                    height: 120px;
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 1px solid #ddd;
                    &:nth-last-of-type(1){
                        border-bottom: none;
                    }
                    >div{
                        height: 100%;
                        &:nth-of-type(1){
                            width: 120px;
                            line-height: 120px;
                            text-align: center;
                            border-right: 1px solid #ddd;
                        }
                        &:nth-of-type(2){
                            flex: 1;
                            padding: 0 32px;
                            display: flex;
                            align-items: center;
                        }
                        &.item-name{
                            position: relative;
                            .del-mask{
                                position: absolute;
                                width: 100%;
                                height: 100%;
                                background-color: rgba(0,0,0,0.8);
                                left: 0;
                                top: 0;
                                display: none;
                            }
                            &:hover{
                                .del-mask{
                                    display: block;
                                }
                            }
                        }
                    }
                }
            }
        }
        .add-btn{
            margin-top: 10px;
        }
    }
    .default-list{

    }
}
</style>


