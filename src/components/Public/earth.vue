<template>
    <div class="earth">
        <div id="myChart" :style="{width: '100%', height: '100vh',pointerEvents:'none'}"></div>
    </div>
</template>
<script>
import echarts from 'echarts'
import 'echarts-gl'
import bathymetry from '@/assets/images/bathymetry.jpg'
import starfield from '@/assets/images/bathymetry.jpg'
import centerBg from '@/static/img/large-content-bg.png'
import data from '@/assets/data.json'
export default {
    name:'earth',
    data(){
        return {

        }
    },
    beforeDestroy(){
        console.log('移除地球');
    },
    mounted(){
        this.drawEarth();
    },
    methods:{
        drawEarth(){
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById('myChart'))
            // 绘制图表
            myChart.setOption({
                backgroundColor: 'none',
                globe: {
                    baseTexture: bathymetry,
                    heightTexture: bathymetry,
                    baseColor: '#0b0c42',
                    displacementScale: 0.1,

                    shading: 'color',
                    environment: 'none',
                    left:'10%',
                    light: {
                        ambient: {
                            intensity: 0.1
                        },
                        main: {
                            intensity: 1.5
                        }
                    },
                },
                series: {
                    type: 'scatter3D',
                    coordinateSystem: 'globe',
                    blendMode: 'lighter',
                    symbolSize: 2,
                    itemStyle: {
                        color: 'rgb(50, 50, 150)',
                        opacity: 1
                    },
                    data: data
                }
            });
        },
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.earth{
    width: 100%;
    height: 100%;
}
</style>
