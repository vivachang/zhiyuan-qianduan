<template>
  <div class="largeIndex">
    <div class="indexContent">
      <div class="index-left">
        <div class="title">
          <div class="content-title">数据概览</div>
        </div>
        <ul class="data-statistics">
          <li>
            <div class="statistics-num">{{ indexCount.project_count || 0 }}</div>
            <div class="statistics-name">项目总数</div>
          </li>
          <li>
            <div class="statistics-num">{{ indexCount.position_count || 0 }}</div>
            <div class="statistics-name">监测点总数</div>
          </li>
          <li>
            <div class="statistics-num">{{ indexCount.device_count || 0 }}</div>
            <div class="statistics-name">设备总数</div>
          </li>
        </ul>
        <div class="title">
          <div class="content-title">预警警报</div>
          <div class="title-right" @click="$router.push({ name: 'largeWarningDetail' })">
            <span>更多</span>
            <i class="icon icon-large-to-more"></i>
          </div>
        </div>
        <ul class="warning-list">
          <li class="warning-item" v-for="warningItem in warningList" :key="warningItem.id">
            <largeWarningItem :info="warningItem" @chatMsg="handleChatMsg" />
          </li>
          <!-- <li class="warning-item">
                        <largeWarningItem />
          </li>-->
        </ul>
        <div class="title">
          <div class="content-title">项目预评估+实测曲线</div>
          <div class="title-right">
            <div
              class="right-item"
              :class="activeAssessmentItem === 'formaldehyde' ? 'on' : ''"
              @click="handleChangeLeftChart('formaldehyde')"
            >甲醛</div>
            <div
              class="right-item"
              :class="activeAssessmentItem === 'TVOC' ? 'on' : ''"
              @click="handleChangeLeftChart('TVOC')"
            >TOVC</div>
            <!-- <div class="right-item" :class="activeAssessmentItem==='PM25' ? 'on' : ''" @click="handleChangeLeftChart('PM25')">PM2.5</div>
                        <div class="right-item" :class="activeAssessmentItem==='CO2' ? 'on' : ''" @click="handleChangeLeftChart('CO2')">CO2</div>
                        <div class="right-item" :class="activeAssessmentItem==='temperature' ? 'on' : ''" @click="handleChangeLeftChart('temperature')">温度</div>
            <div class="right-item" :class="activeAssessmentItem==='humidity' ? 'on' : ''" @click="handleChangeLeftChart('humidity')">湿度</div>-->
          </div>
        </div>
        <div
          class="left-chart"
          @click="handleShowBigChart"
          v-loading="leftChartLoading"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <div ref="leftChart" :style="{ width: '100%', height: '100%' }"></div>
          <ul class="chart-footer">
            <li>
              <span>预评估</span>
            </li>
            <li>
              <span>实际</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="index-right">
        <div class="filter-select">
          <span>{{ projectName }}</span>
          <i class="icon icon-dropmenu"></i>
          <el-select class="modle-select" v-model="activePorjectId" placeholder="请选择">
            <el-option
              v-for="item in selectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="swiper-box">
          <div class="swiper-btn top-next" @click="handleSlider('slidePrev')">
            <i class="icon icon-top-next"></i>
          </div>
          <div
            class="swiper-container monitor-box"
            v-loading="areasLoading"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <ul class="swiper-wrapper monitor-list">
              <li
                class="swiper-slide monitor-item"
                v-for="item in positionList"
                :key="item.id"
                @click="handleChooseArea(item)"
              >
                <!-- <div class="item-title">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="item.descript || '暂无释义'"
                    placement="left"
                  >
                    <span>{{ item.threshold_name }}</span>
                  </el-tooltip>
                  <i class="icon icon-hint"></i>
                </div>-->
                <div class="item-content">
                  <largeBall :tag="item.tag" />
                  <p class="address">{{ item.area_name }}</p>
                  <button
                    class="suggest"
                    v-if="item.warnigs_sms"
                    @click.stop="handleShowSuggest(item)"
                  >改善建议</button>
                </div>
              </li>
            </ul>
          </div>
          <div class="swiper-btn bottom-next">
            <i class="icon icon-bottom-next"></i>
          </div>
        </div>
      </div>
      <div
        class="center-content"
        v-loading="areaImgLoading"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <transition name="fade-transform" mode="out-in">
          <!-- <newEarth v-show="centerContent === 'newEarth'"/> -->
          <earthVideo v-show="centerContent === 'earthVideo'" />
        </transition>
        <transition name="fade-transform" mode="in-out">
          <activeArea
            v-show="centerContent === 'activeArea'"
            @updateLineChart="handleUpdateLineChart"
            :area="activeArea"
            @close="handleCloseArea"
          />
        </transition>
      </div>
    </div>
    <el-dialog
      title="改善建议"
      :visible.sync="suggestVisible"
      :close-on-click-modal="false"
      width="1114px"
    >
      <!-- <improveBox @close="suggestVisible=false" :warningMsgList="warningMsgList"/> -->
      <newImproveBox
        v-loading="warningItemLoading"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        @close="suggestVisible = false"
        @showBig="handleShowBigImg"
        :warningMsgList="warningMsgList"
      />
    </el-dialog>
    <el-dialog :visible.sync="bigImgVisible">
      <img style="display: block" width="100%" :src="bigImgUrl" alt />
    </el-dialog>
  </div>
</template>
<script>
//
import echarts from "echarts";
import Swiper from "swiper";
// import { exitFullScreen } from '@/utils/tool.js';
import { fullScreen } from "@/utils/tool.js";
import largeBall from "@/components/Public/largeBall";
import largeWarningItem from "@/components/Public/largeWarningItem";
// import improveBox from '@/components/Public/improveBox';
import newImproveBox from "@/components/Public/newImproveBox";

import { recomDataChangeTypes } from "@/utils/tool";
// import newEarth from '@/components/Public/newEarth';
import earthVideo from "@/components/Public/earthVideo";

import activeArea from "@/components/Public/activeArea";
import moment from "moment";
import request from "@/utils/request";
export default {
  name: "largeIndex",
  data() {
    return {
      indexCount: {},
      leftChart: null,
      positionList: [],
      warningMsgList: [],
      areasLoading: false,
      areaImgLoading: false,
      warningItemLoading: false,
      leftChartLoading: false,
      selectOptions: [],
      activePorjectId: "",
      swiper: null,
      suggestVisible: false,
      bigImgVisible: false,
      centerContent: "earthVideo",
      activeArea: {},
      warningList: [{}, {}],
      userInfo: {},
      activeAssessmentItem: "formaldehyde",
      positionDatas: [],
      assessmentList: [],
      bigImgUrl: "",
      timer: null,
      requestId: {
        monitorId: "",
        projectId: "",
      },
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  created() {
    this.userInfo = this.$store.getters.admin_detail;
    if (this.userInfo.template_id != 1) {
      fullScreen();
      this.$router.push({ name: "largeSmallSizeIndex" });
    } else {
      fullScreen();
      this.$router.push({ name: "largeIndex" });
    }
    this.getSelectOptions(); //获取可选项目列表
    this.getEarlywarningList(); //获取预警警报
    this.getIndexCount(); //获取统计数据
    if (!this.userInfo.show_project_id || !this.userInfo.show_position_id) {
      this.getNewPosition();
    } else {
      this.requestId.monitorId = this.userInfo.show_position_id;
      this.requestId.projectId = this.userInfo.show_project_id;
      this.getPositionDatas();
    }
  },
  mounted() {
    this.leftChart = echarts.init(this.$refs.leftChart);
    this.updatePageData();
  },
  computed: {
    projectName() {
      let filterItem = this.selectOptions.filter((item) => {
        return item.id === this.activePorjectId;
      });
      if (filterItem.length > 0) {
        this.getPositionList(filterItem[0].id);
      }
      this.centerContent = "earthVideo";
      return filterItem[0] && filterItem[0].name;
    },
  },
  methods: {
    updatePageData() {
      this.timer = setInterval(() => {
        this.getEarlywarningList(); //获取预警警报
        this.getIndexCount(); //获取统计数据
        this.getPositionDatas();
      }, 300000);
    },
    // 展示大图
    handleShowBigImg(url) {
      this.bigImgUrl = url;
      this.bigImgVisible = true;
    },
    // 获取  默认展示项目 预评估列表
    getAssessmentList() {
      request(
        this.ajaxUrl.assessmentDetail + this.requestId.projectId,
        {
          pageSize: 999999,
          page: 1,
        },
        "get"
      )
        .then((res) => {
          this.leftChartLoading = false;
          this.initAssessmentData(res.data);
        })
        .catch((err) => {
          console.log(err);
          this.leftChartLoading = false;
        });
    },
    // 创建 预评估 数据（修改数据格式，使其和 原始数据/移动平均值  数据格式相同）
    initAssessmentData(data) {
      let resultObj = {};
      data.map((item) => {
        resultObj[item.date] = { formaldehyde: item.hcho, TVOC: item.tvoc };
      });
      let resultList = this.positionDatas.map((item) => {
        let timestamp = item.timestamp.slice(0, 10);
        return {
          timestamp: item.timestamp,
          ...resultObj[timestamp],
        };
      });
      this.assessmentList = resultList;
      this.initChart();
    },
    // 获取 10分钟移动平均值 -- 最近7天
    getPositionDatas() {
      this.leftChartLoading = true;
      request(
        this.ajaxUrl.positionDatas,
        {
          type: 2,
          monitorId: this.requestId.monitorId,
          startTime: moment().subtract(6, "days").format("YYYY-MM-DD HH:mm:ss"),
          endTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
        "get"
      )
        .then((res) => {
          this.positionDatas = res.body.list.reverse();
          this.getAssessmentList();
        })
        .catch((err) => {
          this.leftChartLoading = false;
          console.log(err);
        });
    },
    handleUpdateLineChart(projectId, monitorId) {
      if (
        this.requestId.projectId !== projectId ||
        this.requestId.monitorId !== monitorId
      ) {
        this.requestId.projectId = projectId;
        this.requestId.monitorId = monitorId;
        this.getPositionDatas();
      }
    },
    getNewPosition() {
      return request(this.ajaxUrl.getNewPosition, {}, "get")
        .then((res) => {
          if (res.id && res.project.id) {
            this.requestId.monitorId = res.id;
            this.requestId.projectId = res.project.id;
            this.getPositionDatas();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 改变左侧 折线图
    handleChangeLeftChart(item) {
      this.activeAssessmentItem = item;
      this.initChart();
    },
    // 获取首页统计数据
    getIndexCount() {
      request(this.ajaxUrl.indexCount, {}, "get")
        .then((res) => {
          this.indexCount = res.count;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取所有 项目列表
    getSelectOptions() {
      request(this.ajaxUrl.largeIndexProject, {}, "get")
        .then((res) => {
          this.selectOptions = res;
          const hasDefaultProject = res.some((item) => {
            return item.id === this.userInfo.show_project_id;
          });
          if (hasDefaultProject) {
            this.activePorjectId = this.userInfo.show_project_id;
          } else {
            this.activePorjectId = res[0].id;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取该项目下的监测点列表
    getPositionList(projectId, isLoading) {
      this.areasLoading = true;
      request(
        this.ajaxUrl.largeIndexArea,
        {
          project_id: projectId,
        },
        "get"
      )
        .then((res) => {
          this.positionList = res.areas;
          this.areasLoading = false;
        })
        .catch((err) => {
          this.areasLoading = false;
          console.log(err);
        });
    },
    // 获取左侧预警警报列表 -  2个
    getEarlywarningList() {
      request(
        this.ajaxUrl.earlyWarningList,
        {
          page: 1,
          pageSize: 2,
        },
        "get"
      )
        .then((res) => {
          this.warningList = res.data.slice(0, 2);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 创建左侧图表
    initChart() {
      this.leftChart.clear();
      let config = recomDataChangeTypes(
        this.activeAssessmentItem,
        ["预评估", "实际"],
        [this.assessmentList, this.positionDatas]
      );
      let option = {
        tooltip: {
          trigger: "axis",
        },
        // legend: {
        //     data: ['预评估', '实际']
        // },
        grid: {
          left: "1%",
          right: "2%",
          bottom: "10%",
          top: "8%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLine: {
            show: false,
            lineStyle: {
              color: "#727691",
            },
          },
          axisTick: {
            show: false,
          },
          data: config.xAxis,
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false,
            lineStyle: {
              //横向分割线样式
              color: "#727691",
            },
          },
          splitLine: {
            lineStyle: {
              color: "#3e425d",
            },
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            name: "预评估",
            type: "line",
            symbol: "none",
            itemStyle: {
              color: "#42ae58",
            },
            data: config.series[0].data,
          },
          {
            name: "实际",
            type: "line",
            symbol: "none",
            itemStyle: {
              color: "#71429e",
            },
            data: config.series[1].data,
          },
        ],
        dataZoom: [
          {
            type: "inside",
            xAxisIndex: [0],
            start: 1,
            end: config.xAxis.length,
          },
        ],
      };
      this.leftChart.setOption(option);
    },
    getChartMsgList(warningId) {
      this.warningItemLoading = true;
      request(
        this.ajaxUrl.warningMsgist,
        {
          warnig_id: warningId,
          pageSize: 99999,
          page: 1,
        },
        "get"
      )
        .then((res) => {
          this.warningMsgList = res.data;
          this.warningItemLoading = false;
        })
        .catch((err) => {
          this.warningItemLoading = false;
          console.log(err);
        });
    },
    // 展示改善建议
    handleShowSuggest(item) {
      let warningId = item.warnigs_sms.warnig_id;
      this.suggestVisible = true;
      this.warningMsgList = [];
      this.getChartMsgList(warningId);
    },
    // 左侧预警警报展示改善建议
    handleChatMsg(itemInfo) {
      this.suggestVisible = true;
      this.getChartMsgList(itemInfo.id);
    },
    // 跳转/展示 预评估 大图表
    handleShowBigChart() {
      // console.log(this.userInfo.show_position_id,this.requestId)
      if (this.requestId.monitorId) {
        let positionId = this.requestId.monitorId;
        this.$router.push({
          name: "estimatedDetail",
          params: { id: positionId },
        });
      }
    },
    // 选择区域
    handleChooseArea(item) {
      this.activeArea = item;
      this.areaImgLoading = true;
      this.centerContent = "activeArea";
      setTimeout(() => {
        this.areaImgLoading = false;
      }, 1000);
    },
    // 关闭选中区域
    handleCloseArea() {
      // this.centerContent = 'newEarth'
      this.centerContent = "earthVideo";
    },
  },
  components: {
    largeBall,
    activeArea,
    largeWarningItem,
    // newEarth,
    earthVideo,
    newImproveBox,
  },
};
</script>

<style lang="scss" scoped>
/deep/.navbar {
  display: none !important;
}
.largeIndex {
  width: 100%;
  height: 100%;
  .indexContent {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    position: relative;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-height: 42px;
      height: 5%;
      .content-title {
        height: 100%;
        width: 230px;
        line-height: 42px;
        // background: linear-gradient(to right,#2a2850,rgba(23,10,38,0.5)); /* 标准语法 */
        color: #fff;
        padding-left: 12px;
        font-size: 20px;
        display: flex;
        align-items: center;
        position: relative;
        &::before {
          content: "";
          position: absolute;
          width: 4px;
          height: 24px;
          background-color: #62627c;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .title-right {
        display: flex;
        align-items: center;
        font-size: 14px;
        cursor: pointer;
        > span {
          font-size: 16px;
          color: #545464;
        }
        > i {
          margin-left: 10px;
        }
        .right-item {
          font-size: 14px;
          color: #545464;
          margin-left: 15px;
          cursor: pointer;
          white-space: nowrap;
          &.on {
            color: #fff;
          }
        }
      }
    }
    .index-left {
      max-width: 560px;
      width: 30%;
      height: 100vh;
      overflow: hidden;
      // background: -webkit-linear-gradient(to right,#140a22,#0e0a2f); /* Safari 5.1-6.0 */
      // background: -o-linear-gradient(to right,#140a22,#0e0a2f); /* Opera 11.1-12.0 */
      // background: -moz-linear-gradient(to right,#140a22,#0e0a2f); /* Firefox 3.6-15 */
      // background: linear-gradient(to right,#140a22,#0e0a2f); /* 标准语法 */
      background-color: rgba(23, 10, 38, 0.4);
      padding-top: calc(68px + 2vh);
      padding-left: 26px;
      padding-right: 36px;
      padding-bottom: 20px;
      position: relative;
      display: flex;
      flex-direction: column;
      z-index: 10;
      .data-statistics {
        width: 100%;
        height: 14.6vh;
        min-height: 100px;
        margin-top: 2.4vh;
        margin-bottom: 4.4vh;
        // background-color: #171230;
        background-color: rgba(23, 18, 48, 0.6);
        display: flex;
        justify-content: space-between;
        > li {
          padding: 0 7%;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          .statistics-num {
            font-size: 50px;
          }
          .statistics-name {
            font-size: 16px;
            color: #787887;
            margin-top: 2.6vh;
          }
        }
      }
      .warning-list {
        width: 100%;
        margin-top: 2.2vh;
        margin-bottom: 3.7vh;
        min-height: 190px;
        display: flex;
        justify-content: space-between;
        .warning-item {
          width: 48%;
        }
      }
      .left-chart {
        width: 100%;
        // height: 27.8vh;
        flex: 1;
        border-radius: 4px;
        background-color: #0f1137;
        margin-top: 2vh;
        overflow: hidden;
        position: relative;
        .chart-footer {
          width: 100%;
          position: absolute;
          bottom: 5px;
          display: flex;
          justify-content: center;
          li {
            font-size: 12px;
            color: #54566f;
            margin-left: 70px;
            > span {
              vertical-align: middle;
              margin-left: 10px;
            }
            &::before {
              content: "";
              display: inline-block;
              width: 10px;
              height: 4px;
              vertical-align: middle;
            }
            &:nth-of-type(1) {
              margin-left: 0px;
              &::before {
                background-color: #42ae58;
              }
            }
            &:nth-of-type(2) {
              &::before {
                background-color: #71429e;
              }
            }
          }
        }
        /deep/canvas {
          cursor: pointer;
        }
      }
    }
    .index-right {
      width: 280px;
      height: 100vh;
      overflow: hidden;
      background-color: rgba(12, 9, 36, 0.4);
      padding: calc(68px + 5.4vh) 20px 20px 20px;
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      .filter-select {
        width: 100%;
        height: 50px;
        border: 1px solid #62627c;
        border-radius: 4px;
        line-height: 50px;
        text-align: center;
        position: relative;
        padding: 0 10px;
        > span {
          font-size: 20px;
          color: #fff;
          margin-right: 13px;
          vertical-align: middle;
          display: inline-block;
          max-width: 80%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        > i {
          vertical-align: middle;
        }
        .modle-select {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
        }
      }
      .swiper-box {
        width: 100%;
        display: flex;
        height: calc(100% - 70px);
        flex-direction: column;
        justify-content: space-between;
        margin-top: 2.6vh;
        .swiper-btn {
          height: 40px;
          background-color: rgba(24, 21, 48, 0.5);
          text-align: center;
          line-height: 40px;
          cursor: pointer;
          &.top-next {
            margin-bottom: 10px;
          }
          &.bottom-next {
            margin-top: 10px;
          }
        }
        .monitor-box {
          width: 100%;
          flex: 1;
          overflow-y: auto;
          .monitor-list {
            width: 100%;
            .monitor-item {
              width: 100%;
              // height: 20vh;
              min-height: 150px;
              position: relative;
              padding-top: 20px;
              padding-bottom: 20px;
              background-color: rgba(24, 24, 48, 0.6);
              margin-bottom: 10px;
              cursor: pointer;
              &:nth-last-child(1) {
                margin-bottom: 0;
              }
              .item-title {
                position: absolute;
                right: 10px;
                top: 3px;
                display: flex;
                align-items: center;
                > span {
                  color: #fff;
                  font-size: 12px;
                  display: inline-block;
                  padding-top: 4px;
                }
                > i {
                  margin-left: 5px;
                }
              }
              .item-content {
                text-align: center;
                .address {
                  font-size: 18px;
                  color: #fff;
                  margin: 10px 0;
                }
                .suggest {
                  width: 100px;
                  height: 3.5vh;
                  border: 1px solid #d02b25;
                  background-color: rgba(44, 29, 52, 0.5);
                  color: #d02b25;
                  border-radius: 4px;
                  cursor: pointer;
                  outline: none;
                }
              }
            }
          }
        }
      }
    }
    .center-content {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 9;
    }
  }

  /deep/.el-dialog {
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0;
    }
  }
}
</style>