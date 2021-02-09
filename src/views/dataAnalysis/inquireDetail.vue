<template>
    <div class="inquireDetail">
        <div class="position-item">
            <div class="item-title">监测点信息</div>
            <ul class="info-list">
                <li>
                    <span>项目名称：</span>
                    <span>{{projectInfo.project && projectInfo.project.name}}</span>
                </li>
                <li>
                    <span>所处区域：</span>
                    <span>{{projectInfo.area && projectInfo.area.area_name}}</span>
                </li>
                <li>
                    <span>监测点名称：</span>
                    <span>{{projectInfo.name}}</span>
                </li>
                <li>
                    <span>设备ID：</span>
                    <span>{{projectInfo.device && projectInfo.device.device_number}}</span>
                </li>
            </ul>
        </div>
        <div class="detailHeader">
            <div class="filterBox">
                <div class="filterItem">
                    <span>统计时间</span>
                    <el-date-picker
                        v-model="searchInfo.itime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :clearable="false"
                        size="small"
                        type="datetime"
                        placeholder="选择起始时间">
                    </el-date-picker>
                    &nbsp;至&nbsp;
                    <el-date-picker
                        v-model="searchInfo.etime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :clearable="false"
                        size="small"
                        type="datetime"
                        placeholder="选择终止时间">
                    </el-date-picker>
                    <el-button style="margin-left:20px;" type="primary" size="small" @click="handleExport">导出数据</el-button>
                </div>
                <br>
                <div class="filterItem">
                    <span></span>
                    <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                    <!-- <el-button type="text" size="small">重置查询条件</el-button> -->
                </div>
            </div>
        </div>
        <div class="tableContent">
            <el-table
                :data="tableData"
                v-loading="dataLoading"
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
</template>
<script>
import moment from 'moment';
import myPagination from '@/components/Public/myPagination'
import request from "@/utils/request";
import {exportFile} from '@/utils/tool.js';
export default {
    name:"inquireDetail",
    data(){
        return {
            searchInfo:{
                itime:moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                etime:moment().format('YYYY-MM-DD HH:mm:ss')
            },
            positionId:'',
            projectName:'',
            tableData:[],
            dataLoading:false,
            projectInfo:{},
            pageInfo:{
                total:0,
                pageSize:20,
                currentPage:1,
            }
        }
    },
    created(){
        this.positionId = this.$route.params.id;
        this.projectName = this.$route.query.name;
        this.getPositionDatas();
        this.getPositionDatasHead();
    },
    methods:{
        handleSearch(){
            this.pageInfo.currentPage = 1;
            this.getPositionDatas();
        },
        getPositionDatasHead(){
            request(this.ajaxUrl.getPositionDatasHead,{
                type:1,
                monitorId:this.positionId
            },'get').then((res)=>{
                this.projectInfo = res.data;
            }).catch((err)=>{
                console.log(err)
            })
        },
        // 获取数据列表
        getPositionDatas(){
            this.dataLoading = true;
            request(this.ajaxUrl.positionDatas,{
                type:1,
                monitorId:this.positionId,
                startTime:this.searchInfo.itime,
                endTime:this.searchInfo.etime,
                page:this.pageInfo.currentPage,
                pageSize:this.pageInfo.pageSize
            },'get').then((res)=>{
                this.dataLoading = false;
                this.tableData = res.body.list;
                this.pageInfo.total = res.body.totalCount;
            }).catch((err)=>{
                this.dataLoading = false;
                console.log(err)
            })
        },
        // 导出数据
        handleExport(){
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
            this.getPositionDatas();
        }
    },
    components:{
        myPagination
    }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.inquireDetail{
        .position-item{
            width: 100%;
            padding: 24px 22px;
            background-color: #fff;
            border-radius: 4px;
            margin-bottom: 20px;
            .item-title{
                margin-bottom: 20px;
                font-weight: 600;
            }
            .info-list{
                display: flex;
                flex-wrap: wrap;
                flex-direction: column;
                height: 120px;
                >li{
                    font-size: 12px;
                    color: #000;
                    width: 100%;
                    display: flex;
                    line-height: 30px;
                    margin-right: 20px;
                    >span{
                        display: inline-block;
                        text-align: left;
                        &:nth-of-type(1){
                            width: 85px;
                            color: #979797;
                        }
                        &:nth-of-type(2){
                            flex: 1;
                        }
                    }
                    &:nth-of-type(5){
                        border-right: none;
                    }
                    &:nth-of-type(6){
                        border-right: none;
                    }
                    &:nth-of-type(7){
                        border-right: none;
                    }
                }
            }
        }
    .detailHeader{
        padding: 20px;
        background-color: #fff;
        border-radius: 4px;
        margin-bottom: 20px;
        .filterBox{
            margin-bottom: 0;
            .filterItem{
                font-size: 12px;
            }
        }
    }
    .color-red{
        color: red;
    }
}
</style>