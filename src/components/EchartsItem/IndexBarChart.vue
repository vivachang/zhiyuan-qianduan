<template>
    <div class="IndexBarChart">
        <div ref="myChart" :style="{width: '100%', height: '100%'}"></div>
    </div>
</template>
<script>
import echarts from 'echarts'
import 'echarts-gl'
export default {
    name:"IndexBarChart",
    props:['chartData'],
    data(){
        return {
            myChart:null,
        }
    },
    mounted(){
        this.myChart = echarts.init(this.$refs.myChart);
        this.initChart(this.chartData);
    },
    methods:{
        initChart(obj){
            this.myChart.setOption({
                color: ['#006eff'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: obj.xAxis,
                        axisLine:{
                            lineStyle:{
                                color:'#959595'
                            },
                        },
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        axisLine:{
                            lineStyle:{
                                color:'#959595'
                            },
                        },
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: obj.title,
                        type: 'bar',
                        barWidth: '60%',
                        label: {
                            show: true,
                            position: 'top',
                            color:"#000"
                        },
                        itemStyle:{
                            color:"#5a66ff"
                        },
                        data: obj.data
                    }
                ]
            })
        }
    },
    watch:{
        chartData(news,olds) {
            this.initChart(this.chartData);
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss">
    .IndexBarChart{
        width: 100%;
        height: 100%;
    }
</style>