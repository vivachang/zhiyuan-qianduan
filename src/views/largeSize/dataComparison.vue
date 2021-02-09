<template>
    <div class="dataComparison">
        <div class="comparison-left">
            <div class="filter-project">
                <p class="left-title">当前项目</p>
                <div class="active-project">
                    <span>{{projectName}}</span>
                    <i class="icon icon-dropmenu"></i>
                    <el-select class="modle-select" @change="handleChangeProject" v-model="projectId" placeholder="请选择">
                        <el-option
                        v-for="item in projectList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="monitor-box">
                <p class="left-title">监测点列表</p>
                <div class="monitor-filter">
                    <div class="keyword-search">
                        <input placeholder="搜索监测点名称" class="keywords" type="text" v-model="keywords">
                        <i class="icon icon-search-btn" @click="handleLocationSearch"></i>
                    </div>
                    <ul class="choose-filter">
                        <li :class="showChoose ? '' : 'on'" @click="handleChoose(false)">未选中</li>
                        <li :class="showChoose ? 'on' : ''" @click="handleChoose(true)">已选中</li>
                    </ul>
                </div>
                <ul class="monitor-list"
                    v-loading="listDataLoading"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)" >
                    <li v-for="monitorItem in showMonitorList" :key="monitorItem.id" v-show="monitorItem.itemShow">
                        <div class="item-left">
                            <p class="monitor-name">
                                <i class="icon icon-monitor"></i>
                                <span>{{monitorItem.name}}</span>
                            </p>
                            <p class="monitor-number">
                                {{monitorItem.number}}
                            </p>
                        </div>
                        <div class="item-right" :class="monitorItem.isChoose ? 'otherStyle' : ''" @click="handleChooseItem(monitorItem)">
                            {{monitorItem.isChoose ? '—' : '+'}}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="comparison-right">
            <div class="right-content" 
                v-loading="chartLoading"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)" >
                <largeFilterBox @filterChange="handleFilterChange" :others="true"/>
                <div class="chart-box" ref="bigLineChart"></div>
                <div class="chart-bottom">
                    <p class="bottom-hint">
                        <strong>图例</strong>
                        <span>点击图例开启/关闭监测点显示</span>
                    </p>
                    <ul class="legend-list">
                        <li v-for="(activeItem,idx) in activeMonitorList" :key="activeItem.id" :class="{'showChart' : activeItem.showChart}" @click="handleShow(activeItem,idx)">
                            <span :class="'color_' + (idx+1)">{{activeItem.name}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts';
import largeFilterBox from '@/components/Public/largeFilterBox';
import request from "@/utils/request";
import moment from 'moment';
import {recomDataChangeTypes} from '@/utils/tool';
export default {
    name:'dataComparison',
    data(){
        return {
            projectId:'',
            keywords:'',
            searchKeywords:'',
            bigLineChart:null,
            projectList:[],
            monitorList:[],
            activeMonitorList:[],
            showChoose:false,
            projectStartTime:'',
            colorList:["#633ce3","#00c7db","#ffe14d","#348a31"],
            searchTime:{
                startTime:moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                // startTime:moment().subtract(10,'days').format('YYYY-MM-DD HH:mm'),
                endTime:moment().format('YYYY-MM-DD HH:mm:ss')
            },
            activeType:'formaldehyde',
            positionIds:[],
            responseDataList:[],
            chartLoading:false,
            listDataLoading:false,
            promiseArr:[]
        }
    },
    created(){
        this.projectId = this.$route.params.id;
        this.getProjectList();
    },
    mounted(){
        this.bigLineChart = echarts.init(this.$refs.bigLineChart);
        // this.initChart();
    },
    computed:{
        // 项目名称
        projectName(){
            const projectItem = this.projectList.filter((item)=>{
                return item.id==this.projectId
            });
            if(projectItem[0]){
                this.getPositionList(projectItem[0].id);
                this.projectStartTime = projectItem[0].stages[0].start_date;
                return projectItem[0].name
            }else{
                return ''
            }
        },
        // 当前展示的 监测点列表（已选中/未选中）
        showMonitorList(){
            return this.monitorList.filter((item)=>{
                if(item.name.indexOf(this.searchKeywords) === -1){
                    item.itemShow = false;
                }else{
                    item.itemShow = true;
                }
                return item.isChoose == this.showChoose
            })
        }
    },
    methods:{
        handleChangeProject(){      //改变项目
            this.activeMonitorList = [];
            this.keywords = '';
            this.searchKeywords = '';
            this.bigLineChart.clear();
        },
        // 获取所有 项目列表
        getProjectList(){
            request(this.ajaxUrl.largeIndexProject,{
                
            },'get').then((res)=>{
                this.projectList = res;
            }).catch((err)=>{
                console.log(err);
            })
        },
        // 获取该项目下的监测点列表
        getPositionList(projectId){
            this.listDataLoading = true;
            request(this.ajaxUrl.largeIndexArea,{
                project_id:projectId
            },'get').then((res)=>{
                let monitorList = [];
                res.areas.map((areaItem)=>{
                    monitorList = [...monitorList,...areaItem.position]
                });
                monitorList = monitorList.map((item)=>{
                    return {
                        isChoose:false,
                        showChart:true,
                        itemShow:true,
                        ...item
                    }
                })
                this.monitorList = monitorList;
                this.listDataLoading = false;
                // console.log(monitorList,'23123')
            }).catch((err)=>{
                this.listDataLoading = false;
                console.log(err);
            })
        },
        // 已选中/未选中 切换
        handleChoose(isChoose){
            this.showChoose = isChoose;
        },
        // 选中/取消选中 监测点
        handleChooseItem(monitorItem){
            if(!monitorItem.isChoose && this.activeMonitorList.length>=4){
                this.$message.warning('最多只能同时对比四个点位的数据');
                return;
            }
            monitorItem.isChoose = !monitorItem.isChoose;
            let activeList = this.monitorList.filter((item)=>{
                item.showChart = true;
                return item.isChoose
            });
            this.activeMonitorList = activeList;
            if(activeList.length===0){
                this.bigLineChart.clear();
            }else{
                this.promiseAllStart();
            }
        },
        // 获取选中的监测点数据
        async getContrastDatas(id){
            let res = await request(this.ajaxUrl.positionDatas,{
                type:3,
                projectStartTime:this.projectStartTime,
                monitorId:id,
                startTime:this.searchTime.startTime,
                endTime:this.searchTime.endTime
            },'get');
            this.responseDataList.push(res.body.list.reverse());
            this.initData();
            return res
        },
        promiseAllStart(){
            this.responseDataList = [];
            this.chartLoading = true;
            this.activeMonitorList.map((item,idx)=>{
                this.promiseArr.push(this.getContrastDatas(item.id));
            });
            Promise.all(this.promiseArr)
                .then((resList)=>{
                    this.chartLoading = false;
                }).catch((err)=>{
                    this.chartLoading = false;
                })
        },
        // 创建折线图数据
        initData(){
            this.bigLineChart.clear();
            let positionNames = this.activeMonitorList.map((item)=>{return item.name})
            this.initChart(recomDataChangeTypes(this.activeType,positionNames,this.responseDataList));
        },
        // 在图表中 展示/取消展示  该点位
        handleShow(item,idx){
            item.showChart = !item.showChart;
            let showPositionNames = this.activeMonitorList.map((mapItem)=>{
                if(mapItem.showChart){
                    return mapItem.name
                }else{
                    return ''
                }
            });
            let showResponseDataList = this.responseDataList.map((dataItem,idx)=>{
                if(this.activeMonitorList[idx].showChart){
                    return dataItem
                }else{
                    return []
                }
            });
            this.bigLineChart.clear();
            this.initChart(recomDataChangeTypes(this.activeType,showPositionNames,showResponseDataList));
        },
        // 筛选项 变换
        handleFilterChange(type,time){
            this.activeType = type;
            if(this.searchTime.startTime == time.startTime && this.searchTime.endTime == time.endTime){
                this.initData();
            }else{
                this.searchTime = {
                    startTime:time.startTime,
                    endTime:time.endTime
                }
                this.promiseAllStart();
            }
        },
        // 初始化 图表
        initChart(config){
            let option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '1%',
                        right: '2%',
                        bottom: '10%',
                        top:'8%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLine:{
                            show:false,
                            lineStyle:{
                                color:'#727691'
                            }
                        },
                        axisTick:{
                            show:false  
                        },
                        data: config.xAxis
                    },
                    yAxis: {
                        type: 'value',
                        axisLine:{
                            show:false,
                            lineStyle:{     //横向分割线样式
                                color:'#727691'     
                            }
                        },
                        splitLine:{
                            lineStyle:{
                                color:'#3e425d'
                            }
                        },
                        axisTick:{
                            show:false  
                        },
                    },
                    series: config.series.map((item,idx)=>{
                        return {
                            name:item.name,
                            type: 'line',
                            symbol:'circle',
                            symbolSize:6,
                            itemStyle:{
                                borderWidth:2,
                                color:this.colorList[idx]
                            },
                            data:item.data
                        }
                    }),
                    dataZoom: [
                        {
                            startValue: config.xAxis[config.xAxis.length-100],
                            bottom:'2%'
                        },
                        {
                            type: 'inside',
                        }
                    ]
                };
            this.bigLineChart.setOption(option);
        },
        // 本地 根据 监测点名称筛选 展示列表
        handleLocationSearch(){
            this.searchKeywords = this.keywords;
        }
    },
    components:{
        largeFilterBox
    }
}
</script>
<style lang="scss" scoped>
.dataComparison{
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    .comparison-left{
        width: 410px;
        height: 100%;
        background-color: rgba(11,13,38,0.8);
        padding: calc(68px + 2.3vh) 40px 20px 30px;
        display: flex;
        flex-direction: column;
        .left-title{
            font-size: 20px;
            color: #fff;
            font-weight:600;
            margin-bottom: 2vh;
        }
        .filter-project{
            width: 100%;
            margin-bottom: 3.4vh;
            .active-project{
                width: 100%;
                height: 50px;
                box-sizing: border-box;
                border: 1px solid #3a3c8a;
                border-radius: 4px;
                background-color: #131443;
                line-height: 48px;
                color: #aeb1f2;
                font-size: 20px;
                padding: 0 20px 0 18px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                position: relative;
                .modle-select{
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    left: 0;
                    top: 0;
                }
            }
        }
        .monitor-box{
            width: 100%;
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            .monitor-filter{
                width: 100%;
                .keyword-search{
                    width: 100%;
                    height: 50px;
                    border: 1px solid #3a3c8a;
                    border-radius: 4px;
                    background-color: #131443;
                    display: flex;
                    padding: 0 14px 0 18px;
                    align-items: center;
                    >input{
                        height: 100%;
                        border: none;
                        background-color: transparent;
                        flex: 1;
                        outline: none;
                        color: #aeb1f2;
                    }
                    input::-webkit-input-placeholder { 
                        /* WebKit browsers */ 
                        color: #545464; 
                    } 
                    input:-moz-placeholder { 
                        /* Mozilla Firefox 4 to 18 */ 
                        color: #545464; 
                    } 
                    input::-moz-placeholder { 
                        /* Mozilla Firefox 19+ */ 
                        color: #545464; 
                    } 
                    input:-ms-input-placeholder { 
                        /* Internet Explorer 10+ */ 
                        color: #545464; 
                    }
                    >i{
                        cursor: pointer;
                    }
                }
                .choose-filter{
                    width: 100%;
                    height: 50px;
                    display: flex;
                    margin: 12px 0 17px 0;
                    >li{
                        width: 50%;
                        height: 100%;
                        line-height: 48px;
                        border: 1px solid transparent;
                        text-align: center;
                        font-size: 20px;
                        color: #545464;
                        background-color: #131443;
                        cursor: pointer;
                        &:nth-of-type(1){
                            border-top-left-radius: 4px;
                            border-bottom-left-radius: 4px;
                        }
                        &:nth-last-of-type(1){
                            border-top-right-radius: 4px;
                            border-bottom-right-radius: 4px;
                        }
                        &.on{
                            color: #aeb1f2;
                            border-color: #3a3c8a;
                        }
                    }
                }
            }
            .monitor-list{
                width: 100%;
                flex: 1;
                height: 0;    //若纵向需要滚动
                overflow-y: auto;
                &::-webkit-scrollbar {
                    width: 4px;    
                    /*height: 4px;*/
                }
                &::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    -webkit-box-shadow: inset 0 0 5px #131443;
                    background: #131443;
                }
                &::-webkit-scrollbar-track {
                    -webkit-box-shadow: inset 0 0 5px #5d5e6f;
                    border-radius: 0;
                    background: #5d5e6f;
                }
                >li{
                    width: 100%;
                    height: 80px;
                    box-sizing: border-box;
                    padding:0 20px;
                    display: flex;
                    align-items: center;
                    background-color: #141639;
                    margin-bottom: 10px;
                    .item-left{
                        flex: 1;
                        padding-right: 20px;
                        >p{
                            white-space: nowrap;
                            overflow: hidden;
                            &.monitor-name{
                                color: #fff;
                                font-size: 20px;
                                margin-bottom: 14px;
                                >i{
                                    margin-right: 12px;
                                    vertical-align: middle
                                }
                                >span{
                                    vertical-align: middle;
                                }
                            }
                            &.monitor-number{
                                font-size: 14px;
                                color: #4e506f;
                                padding-left: 28px;
                            }
                        }
                    }
                    .item-right{
                        width: 40px;
                        height: 40px;
                        background-color: #292b4b;
                        color: #5d5e6f;
                        border-radius: 3px;
                        font-size: 40px;
                        text-align: center;
                        line-height: 40px;
                        font-weight: normal;
                        cursor: pointer;
                        &.otherStyle{
                            font-size: 17px;
                            font-weight: 600;
                        }
                    }
                }
            }
        }
    }
    .comparison-right{
        flex: 1;
        height: 100%;
        padding:calc(136px + 3.52vh) 40px 20px 40px;
        overflow: hidden;
        .right-content{
            width: 100%;
            height: 100%;
            background-color: rgba(12,14,40,0.6);
            padding: 20px 40px;
            display: flex;
            flex-direction: column;
            position: relative;
            .chart-box{
                width: 100%;
                flex: 1;
            }
            .chart-bottom{
                .bottom-hint{
                    font-size: 14px;
                    color: #fff;
                    >strong{
                        font-size: 18px;
                        margin-right: 10px;
                    }
                }
                .legend-list{
                    width: 100%;
                    height: 40px;
                    display: flex;
                    margin-top: 2vh;
                    >li{
                        padding: 0 15px 0 10px;
                        line-height: 40px;
                        background-color: #17193e;
                        border-radius: 20px;
                        margin-right: 20px;
                        font-size: 16px;
                        color: #6e6f83;
                        cursor: pointer;
                        &.showChart{
                            background-color: #262850;
                            color: #aeb1f2;
                        }
                        >span{
                            &::before{
                                content: "";
                                display: inline-block;
                                width:20px;
                                height: 4px;
                                vertical-align: middle;
                                margin-right: 10px;
                            }
                            &.color_1{
                                &::before{
                                    background-color: #633ce3;
                                }
                            }
                            &.color_2{
                                &::before{
                                    background-color: #00c7db;
                                }
                            }
                            &.color_3{
                                &::before{
                                    background-color: #ffe14d;
                                }
                            }
                            &.color_4{
                                &::before{
                                    background-color: #348a31;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>

