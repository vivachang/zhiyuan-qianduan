<template>
    <div ref="pieChart" class="pie-chart"></div>
</template>
<script>
import echarts from 'echarts';
export default {
    name:'largePieChart',
    props:['detail'],
    data(){
        return {
            pieChart:null
        }
    },
    mounted(){
        this.pieChart = echarts.init(this.$refs.pieChart);
       
    },
    updated(){
        
    },
    methods:{
        // 创建 环状图 列表
        initRing(){
            let value = 0,color="";
            if(this.detail.tag === 3){
                color = '#fb4542';
                value = 90;
            }else if(this.detail.tag === 2){
                color = '#ff9d00';
                value = 60;
            }else if(this.detail.tag === 1){
                color = '#40c133';
                value = 20;
            }else{
                color = '#40c133';
                value = 0;
            }
            this.pieChart.setOption({
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: ['85%', '100%'],
                        hoverAnimation:false,
                        cursor:'auto',
                        label: {
                            show: false,
                            position: 'center'
                        },
                        data: [
                            {
                                value: value,
                                itemStyle:{
                                    color:color
                                }
                            },
                            {
                                value: 100-value,
                                itemStyle:{
                                    color:'#393a56'
                                }
                            }
                        ]
                    }
                ]
            })
        },
    },
    watch:{
        detail(newVal){
            this.initRing();
        }
    }
}
</script>
<style lang="scss" scoped>
    .pie-chart{
        width: 100%;
        height: 100%;
    }
</style>