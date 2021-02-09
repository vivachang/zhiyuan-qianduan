<template >
    <div class="analysisDetail">
        <div class="analysis-item">
            <div class="analysis-search">
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
                    <!-- <br>
                    <div class="filterItem">
                        <span>监测点名称</span>
                        <el-select v-model="searchInfo.name" size="small" placeholder="请选择监测点名称">
                            <el-option label="运行中" value="1"></el-option>
                            <el-option label="已停止" value="2"></el-option>
                        </el-select>
                        <br>
                    </div> -->
                    <br>
                    <div class="filterItem">
                        <span></span>
                        <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                        <!-- <el-button type="text" size="small">重置查询条件</el-button> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="analysis-item">
            <div class="chart-title">
                <div class="title"></div>
                <ul class="chart-filter">
                    <el-checkbox-group v-model="chartFilter" @change="handleChartChange">
                        <el-checkbox label="formaldehyde" checked>甲醛</el-checkbox>
                        <el-checkbox label="TVOC">TVOC</el-checkbox>
                        <el-checkbox label="PM25">PM2.5</el-checkbox>
                        <el-checkbox label="CO2">CO2</el-checkbox>
                        <el-checkbox label="temperature">温度</el-checkbox>
                        <el-checkbox label="humidity">湿度</el-checkbox>
                    </el-checkbox-group>
                </ul>
            </div>
            <div class="canvas-box" v-loading="dataLoading">
                <div ref="lineChart" :style="{width: '100%', height: '100%'}"></div>
            </div>
        </div>
        <div class="analysis-item">
            <div class="export-btn">
                <el-button type="primary" size="small" @click="handleExport">导出数据</el-button>
            </div>
            <div class="tableContent">
                <el-table
                    v-loading="dataLoading"
                    :data="currentData"
                    border
                    style="width: 100%">
                    <el-table-column
                        prop="timestamp"
                        label="统计时间"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        label="甲醛（mg/m3）">
                        <template slot-scope="scope">
                            <span :class="scope.row.red && scope.row.red.includes('formaldehyde') ? 'color-red' : ''">{{scope.row.formaldehyde}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="TVOC（mg/m3）">
                        <template slot-scope="scope">
                            <span :class="scope.row.red && scope.row.red.includes('TVOC') ? 'color-red' : ''">{{scope.row.TVOC}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="PM2.5（μg/m3）">
                        <template slot-scope="scope">
                            <span :class="scope.row.red && scope.row.red.includes('PM25') ? 'color-red' : ''">{{scope.row.PM25}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="CO2（ppm）">
                        <template slot-scope="scope">
                            <span :class="scope.row.red && scope.row.red.includes('CO2') ? 'color-red' : ''">{{scope.row.CO2}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="温度（℃）">
                        <template slot-scope="scope">
                            <span :class="scope.row.red && scope.row.red.includes('temperature') ? 'color-red' : ''">{{scope.row.temperature}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="湿度（%RH）">
                        <template slot-scope="scope">
                            <span :class="scope.row.red && scope.row.red.includes('humidity') ? 'color-red' : ''">{{scope.row.humidity}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <myPagination :pageInfo="pageInfo" @current-change="pageChange"/>
            </div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts';
import moment from 'moment';
import myPagination from '@/components/Public/myPagination';
import request from "@/utils/request";
import {recomDataChooseTypes,uploadFile,exportFile} from '@/utils/tool';
export default {
    name:'analysisDetail',
    data(){
        return {
            tableData:[],
            currentData:[],
            allDatas:[],
            dataLoading:false,
            searchInfo:{
                itime:moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                etime:moment().format('YYYY-MM-DD HH:mm:ss'),
                name:''
            },
            chartFilter:[],
            activeValue:[],
            positionId:'',
            projectId:'',
            projectName:'',
            lineChart:null,
            markLine:{
                formaldehyde:'',
                TVOC:''
            },
            pageInfo:{
				total:0,
				pageSize:10,
				currentPage:1,
            }
        }
    },
    created(){
        this.positionId = this.$route.params.id;
        this.projectId = this.$route.query.projectId;
        this.getMarkline();
    },
    mounted(){
        this.lineChart = echarts.init(this.$refs.lineChart);
        // this.initData();
    },
    methods:{
        handleSearch(){
            this.pageInfo.currentPage = 1;
            this.getPositionDatas();
        },
        // 获取项目参考线
        getMarkline(){
            request(this.ajaxUrl.projectsInfo + this.projectId,{

            },'get').then((res)=>{
                this.markLine.formaldehyde = res.hcho;
                this.markLine.TVOC = res.tvoc;
                this.projectName = res.name;
                this.getPositionDatas();
            }).catch((err)=>{
                console.log(err);
                this.$message.error('请求超时');
            })
        },
        getPositionDatas(){
            this.dataLoading = true;
            request(this.ajaxUrl.positionDatas,{
                type:2,
                monitorId:this.positionId,
                startTime:this.searchInfo.itime,
                endTime:this.searchInfo.etime
            },'get').then((res)=>{
                this.pageInfo.total = res.body.list.length;
                this.allDatas = JSON.parse(JSON.stringify(res.body.list)).reverse();
                this.tableData = res.body.list;
                this.initData();
                this.initCurrentData();
                this.dataLoading = false;
            }).catch((err)=>{
                this.dataLoading = false;
                this.$message.error('请求超时');
                console.log(err)
            })
        },
        // 本地分页展示数据
        initCurrentData(){
            let starIdx = (this.pageInfo.currentPage-1)*this.pageInfo.pageSize;
            let endIdx = this.pageInfo.currentPage*this.pageInfo.pageSize;
            this.currentData = this.tableData.slice(starIdx,endIdx);
        },
        handleChartChange(val){
            this.lineChart.clear()
            this.$nextTick(()=>{
                this.initData();
            })
        },
        initChart(){
            this.lineChart.setOption(this.options);
        },
        // 绘制折线图
        getListOptions(config,showAll){
            var datas = {},keys={
                '甲醛':0.1,
                'PM2.5':75,
                'TVOC':0.6,
                'CO2':1000,
                '温度':60,
                '湿度':32
            };
            this.options = {
                legend: {
                    data: config.legend,
                    selectedMode:false
                },
                grid: {
                    right: '12%',
                },
                tooltip: {
                    trigger: 'axis',
                    formatter:function(params,ticket,callback){
                        let _html = `${params[0].axisValueLabel}<br/>`;
                        params.map((item)=>{
                            if(config.legend.length>1){
                                _html+=`<p>${item.marker}${item.seriesName}:${Number(item.data*keys[item.seriesName]).toFixed(3)}</p>`
                            }else{
                                _html+=`<p>${item.marker}${item.seriesName}:${Number(item.data).toFixed(3)}</p>`
                            }
                        })
                        return _html
                    }
                },
                xAxis: {
                    type: 'category',
                    data: config.xAxis
                },
                yAxis: {
                    type: 'value',
                    minInterval:0.001,
                    axisTick:{
                        show:false
                    },
                    // offset:'100px'
                    // show:false
                    show:config.legend.length==1
                },
                dataZoom: [{
                    startValue: showAll ? 0 :config.xAxis[config.xAxis.length-10]
                    // startValue: 0
                }, {
                    type: 'inside'
                }],
                series: config.series
            }
            this.initChart();
        },
        // 创建折线图数据
        initData(){
            this.getListOptions(recomDataChooseTypes(this.chartFilter,this.allDatas,this.markLine));
        },
        // 导出数据
        handleExport(){
            this.getListOptions(recomDataChooseTypes(this.chartFilter,this.allDatas,this.markLine),true);
            const canvas = document.querySelector('canvas');
            setTimeout(()=>{
                uploadFile(canvas.toDataURL("image/jpg"),2)
                    .then((res)=>{
                        this.initFile(res.id)
                    }).catch((err)=>{
                        console.log(err);
                    })
            },300)
        },
        // 导出数据
        initFile(imgId){
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            exportFile(this.ajaxUrl.exportDatas,{
                monitorId:this.positionId,
                startTime:this.searchInfo.itime,
                endTime:this.searchInfo.etime,
                type:2,
                img:imgId
            }).then((res)=>{
                const blob = new Blob([res.data],{ type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }); 
                // const fileName = 'xxx.xls';
                const linkNode = document.createElement('a');
                const url = window.URL || window.webkitURL || window.moxURL;        //兼容不同浏览器
                let fileName = '';
                let sDay = this.searchInfo.itime.slice(0,10);
                let eDay = this.searchInfo.etime.slice(0,10);
                if(sDay == eDay){
                    fileName = sDay.split('-').join('') + this.projectName + '-健康空气实时监测报告-SL+至源科技';
                }else{
                    fileName = sDay.split('-').join('') + '-' + eDay.split('-').join('') + this.projectName + '-健康空气实时监测报告-SL+至源科技';
                }

                linkNode.download = fileName; //a标签的download属性规定下载文件的名称
                linkNode.href = url.createObjectURL(blob); //生成一个Blob URL 创建下载链接
                // console.log(url.createObjectURL(blob))
                linkNode.click();  //模拟在按钮上的一次鼠标单击
                url.revokeObjectURL(linkNode.href); // 释放URL 对象
                loading.close();
            }).catch((err)=>{
                loading.close();
                console.log(err);
            })
        },
        // 翻页
        pageChange(val){
            this.pageInfo.currentPage = val;
            this.initCurrentData();
        },
    },
    components:{
        myPagination
    }
}
</script>
<style rel="stylesheet/scss" lang="scss">
    .analysisDetail{
        .analysis-item{
            padding: 20px;
            background-color: #fff;
            margin-bottom: 20px;
            border-radius: 4px;
            .analysis-search{
                .filterBox{
                    margin-bottom: 0;
                    .filterItem{
                        &:nth-last-of-type(1){
                            margin-bottom: 0;
                        }
                    }
                }
            }
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
                    
                }
            }
            .canvas-box{
                height: 400px;
            }
            .tableContent{
                margin-top: 20px;
                padding: 0;
            }
        }
        .color-red{
            color: red;
        }
    }
</style>