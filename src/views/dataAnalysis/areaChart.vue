<template>
    <div class="areaChart">
        <div class="areaHeader">
            <div class="filterBox">
                <div class="filterItem">
                    <span>统计时间</span>
                    <el-date-picker
                        v-model="searchInfo.itime"
                        :clearable="false"
                        size="small"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择起始时间">
                    </el-date-picker>
                    &nbsp;至&nbsp;
                    <el-date-picker
                        v-model="searchInfo.etime"
                        :clearable="false"
                        size="small"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择终止时间">
                    </el-date-picker>
                </div>
                <br>
                <div class="filterItem">
                    <span></span>
                    <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                    <!-- <el-button type="text" size="small">重置查询条件</el-button> -->
                </div>
            </div>
        </div>
        <div class="chartBox">
            <div class="chart-title">
                <div class="title">数据对比</div>
                <ul class="chart-filter">
                    <li v-for='(item,idx) in charFilterList' :key="idx" @click="handleFilter(item)" :class="{'on':item.type === areaType}"><span>{{item.name}}</span></li>
                </ul>
            </div>
            <div class="canvas-box" v-loading="dataLoading">
                <div ref="lineChart" :style="{width: '100%', height: '100%'}"></div>
            </div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts';
import moment from 'moment';
import request from "@/utils/request";
import { constants } from 'zlib';
import {recomDataChangeTypes} from '@/utils/tool';
export default {
    name:'areaChart',
    data(){
        return {
            searchInfo:{
                itime:moment().subtract(10,'days').format('YYYY-MM-DD HH:mm:ss'),
                etime:moment().format('YYYY-MM-DD HH:mm:ss'),
                // itime:'',
                // etime:''
            },
            lineChart:null,
            dataLoading:false,
            options:{

            },
            ContrastDatas:{

            },
            areaList:[],
            numberList:[],
            charFilterList:[
                {
                    name:'甲醛',
                    type:'formaldehyde'
                },
                {
                    name:'TVOC',
                    type:'TVOC'
                },
                {
                    name:'PM2.5',
                    type:'PM25'
                },
                {
                    name:'CO2',
                    type:'CO2'
                },
                {
                    name:'温度',
                    type:'temperature'
                },
                {
                    name:'湿度',
                    type:'humidity'
                }
            ],
            areaType:'formaldehyde',
            responseNumberList:[],
            responseDataList:[],
            promiseArr:[]
        }
    },
    created(){
        this.areaList = this.$route.params.idlist.split(',');
        this.numberList = this.$route.query.numberList.split(',');
        this.promiseAllStart();
    },
    mounted(){
        this.lineChart = echarts.init(this.$refs.lineChart);
        // this.initData();
    },
    methods:{
        async getContrastDatas(id,number){
            this.dataLoading = true;
            let res = await request(this.ajaxUrl.positionDatas,{
                type:3,
                monitorId:id,
                startTime:this.searchInfo.itime,
                endTime:this.searchInfo.etime
            },'get');
            this.responseNumberList.push(number);
            this.responseDataList.push(res.body.list.reverse());
            this.initData('formaldehyde');
            this.dataLoading = false;
            return res
        },
        handleSearch(){
            this.responseNumberList=[];
            this.responseDataList = [];
            this.promiseArr = [];
            this.promiseAllStart();
        },
        promiseAllStart(){
            this.areaList.map((item,idx)=>{
                this.promiseArr.push(this.getContrastDatas(item,this.numberList[idx]));
            });
            // Promise.all(this.promiseArr)
            //     .then((resList)=>{
                    
            //     })
        },
        handleFilter(item){
            this.areaType = item.type;
            this.initData(item.type);
        },
        // 绘制折线图
        getListOptions(config){
            this.options = {
                legend: {
                    data: config.legend,
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: config.xAxis
                },
                yAxis: {
                    type: 'value',
                    minInterval:0.1,
                },
                dataZoom: [{
                    startValue: config.xAxis[config.xAxis.length-100]
                }, {
                    type: 'inside'
                }],
                series: config.series
            }
            this.initChart();
        },
        initChart(){
            this.lineChart.setOption(this.options);
        },
        // 创建折线图数据
        initData(type='formaldehyde'){
            this.getListOptions(recomDataChangeTypes(type,this.responseNumberList,this.responseDataList));
            // console.log(recomDataChangeTypes(type,this.responseNumberList,this.responseDataList))
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.areaChart{
    .areaHeader{
        padding:20px;
        background-color: #fff;
        border-radius: 4px;
        margin-bottom: 20px;
        .filterBox{
            margin-bottom: 0;
            .filterItem{
                &:nth-last-of-type(1){
                    margin-bottom: 0;
                }
            }
        }
    }
    .chartBox{
        padding: 20px;
        background-color: #fff;
        border-radius: 4px;
        .chart-title{
            width: 100%;
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            margin-bottom: 30px;
            .title{
                color: #000;
                font-weight: 600;
            }
            .chart-filter{
                display: flex;
                li{
                    padding: 0 24px;
                    &:nth-last-of-type(1){
                        padding-right: 0;
                    }
                    >span{
                        padding-bottom: 5px;
                        font-weight: normal;
                        border-bottom: 2px solid transparent;
                        cursor: pointer;
                    }
                    &.on{
                        >span{
                            font-weight: 600;
                            border-color: #5a66ff;
                        }
                    }
                }
            }
        }
        .canvas-box{
            width: 100%;
            height: 400px;
        }
    }
}
</style>