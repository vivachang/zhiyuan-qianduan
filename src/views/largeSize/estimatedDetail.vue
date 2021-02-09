<template>
    <div class="estimatedDetail">
        <div class="big-chart-box">
            <largeFilterBox @filterChange="handleFilterChange"/>
            <div class="estimated-chart"
                v-loading="chartLoading"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                >
                <div ref="bigLineChart" :style="{width: '100%', height: '100%'}"></div>
            </div>
            <ul class="chart-footer">
                <li v-show="activeType==='formaldehyde' || activeType==='TVOC'">
                    <span>预评估</span>
                </li>
                <li>
                    <span>实际</span>
                </li>
                <!-- <li>
                    <span>平均值</span>
                </li> -->
            </ul>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts';
import largeFilterBox from '@/components/Public/largeFilterBox'
import {recomDataChangeTypes} from '@/utils/tool';
import moment from 'moment';
import request from "@/utils/request";
export default {
    name:'estimatedDetail',
    data(){
        return {
            bigLineChart:null,
            activeType:'formaldehyde',
            activeTime:{
                startTime:moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                // startTime:moment().subtract(10,'days').format('YYYY-MM-DD HH:mm:ss'),
                endTime:moment().format('YYYY-MM-DD HH:mm:ss')
            },
            chartLoading:false,
            positionId:'',
            userInfo:{},
            positionDatas:[],
            markLine:{
                formaldehyde:0,
                TVOC:0
            },
            assessmentList:[]
        }
    },
    created(){
        this.userInfo = this.$store.getters.admin_detail;
        this.positionId = this.$route.params.id;
    },
    mounted(){
        this.bigLineChart = echarts.init(this.$refs.bigLineChart);
        this.getPositionDatas();
    },
    methods:{
        initChart(){
            this.chartLoading = false;
            this.bigLineChart.clear();
            let config = recomDataChangeTypes(this.activeType,['预评估','实际'],[this.assessmentList,this.positionDatas]);
            let series = [
                    {
                        name: '预评估',
                        type: 'line',
                        symbol:'circle',
                        symbolSize:6,
                        itemStyle:{
                            color:"#42ae58",
                            borderWidth:2,
                        },
                        data: config.series[0].data
                    },
                    {
                        name: '实际',
                        type: 'line',
                        symbol:'circle',
                        symbolSize:6,
                        itemStyle:{
                            color:"#71429e"
                        },
                        data: config.series[1].data
                    }
                ];
            let option={
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    left: '1%',
                    right: '10%',
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
                series: series,
                dataZoom: [{
                    startValue: config.xAxis[config.xAxis.length-100]
                }, {
                    type: 'inside'
                }]
            };
            this.bigLineChart.setOption(option);
        },
        async getPositionDatas(){
            this.chartLoading = true;
            let res = await request(this.ajaxUrl.positionDatas,{
                type:2,
                monitorId:this.positionId,
                startTime:this.activeTime.startTime,
                endTime:this.activeTime.endTime
            },'get');
            this.positionDatas = res.body.list.reverse();
            this.getAssessmentList();
        },
        // 获取  默认展示项目 预评估列表
        getAssessmentList(){
            request(this.ajaxUrl.assessmentDetail + this.userInfo.show_project_id,{
                pageSize:999999,
                page:1
            },'get').then((res)=>{
                this.initAssessmentData(res.data);
            }).catch((err)=>{console.log(err)})
        },
        // 创建 预评估 数据（修改数据格式，使其和 原始数据/移动平均值  数据格式相同）
        initAssessmentData(data){
            let resultObj = {};
            data.map((item)=>{  resultObj[item.date] = {formaldehyde:item.hcho,TVOC:item.tvoc}});
            let resultList = this.positionDatas.map((item)=>{
                let timestamp = item.timestamp.slice(0,10);
                return {
                    timestamp:item.timestamp,
                    ...resultObj[timestamp]
                }
            })
            this.assessmentList = resultList;
            this.initChart();
        },
        // 筛选项 变换
        handleFilterChange(type,time){
            this.activeType = type;
            this.activeTime.startTime = time.startTime;
            this.activeTime.endTime = time.endTime;
            this.getPositionDatas();
        }
    },
    components:{
        largeFilterBox
    }
}
</script>
<style lang="scss" scoped>
.estimatedDetail{
    width: 100%;
    height: 100%;
    padding: calc(136px + 4.4vh) 40px 20px 40px;
    .big-chart-box{
        width: 100%;
        height: 100%;
        background-color: rgba(14,14,46,0.5);
        padding: 32px;
        display: flex;
        flex-direction: column;
        position: relative;
        .estimated-chart{
            width: 100%;
            flex: 1;
            position: relative;
        }
        .chart-footer{
            width: 100%;
            position: absolute;
            bottom: 5px;
            display: flex;
            justify-content: center;
            li{
                font-size: 16px;
                color: #9190c1;
                margin-left: 70px;
                >span{
                    vertical-align: middle;
                    margin-left: 10px;
                }
                &::before{
                    content: "";
                    display: inline-block;
                    width: 28px;
                    height: 4px;
                    border-bottom: 4px solid transparent;
                    vertical-align: middle;
                }
                &:nth-of-type(1){
                    margin-left: 0px;
                    &::before{
                        border-color: #42ae58;
                    }
                }
                &:nth-of-type(2){
                    &::before{
                        border-color: #71429e;
                    }
                }
                &:nth-of-type(3){
                    &::before{
                        // border-color: #ddab53;
                        // border-style: dashed;
                        border-bottom: 4px dashed #ddab53;
                    }
                }
            }
        }
    }
}
</style>

