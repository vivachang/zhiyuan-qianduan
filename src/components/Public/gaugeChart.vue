<template>
    <div class="gaugeChart">
        <div class="gaugeBox">
            <div ref="gaugeChart" :style="{width: '100%', height: '100%'}"></div>
        </div>
        <div class="address">
            <p class="name" :title="positionInfo.position_name">{{positionInfo.position_name}}</p>
            <p class="address-info">{{positionInfo.project_name}} | {{positionInfo.area_name}}</p>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts';
export default {
    name:'gaugeChart',
    props:['positionInfo'],
    data(){
        return {
            gagueChart:null,
        }
    },
    mounted(){
        this.gagueChart = echarts.init(this.$refs.gaugeChart);
        this.initGauge();
    },
    methods:{
        // 创建仪表盘
        initGauge(){
            let value=0;
            switch(this.positionInfo.tag){
                case 1:
                    value=20;
                    break;
                case 2:
                    value=60;
                    break;
                case 3:
                    value=90;
                    break;
                default:
                    value=0;
            }
            let option = {
                // tooltip: {
                //     formatter: '{a} <br/>{b} : {c}%'
                // },
                series: [
                    {
                        type: 'gauge',
                        min: 0,
                        max: 100,
                        detail: {formatter: '{value}%'},
                        axisLine:{
                            lineStyle:{
                                color:[[0.25,'#058837'],[0.7,'#fd6501'],[1,'#ee2518']],
                                width:8
                            }
                        },
                        axisTick: {            // 坐标轴小标记
                            length: 15,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto'
                            }
                        },
                        splitLine:{
                            length:15,
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                width: 3,
                                color: 'auto'
                            }
                        },
                        data: [{value: value, name: ''}]
                    }
                ]
            };
            this.gagueChart.setOption(option);
        },
    },
    watch:{
        positionInfo(){
            this.initGauge();
        }
    }
}
</script>

<style lang="scss" scoped>
.gaugeChart{
    width: 100%;
    height: 100%;
    .gaugeBox{
        width: 100%;
        height: 80%;
        margin: 0 auto;
    }
    .address{
        text-align: center;
        position: relative;
        top: -60px;
        .name{
            font-size: 38px;
            font-weight: 600;
            color: #fff;
            margin-bottom: 25px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .address-info{
            font-size: 25px;
            color: #bab9be;
        }
    }
}
</style>

