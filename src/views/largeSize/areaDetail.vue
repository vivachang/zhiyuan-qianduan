<template>
  <div class="areaDetail">
    <div class="areaDetail-top">
      <div
        class="top-left-gauge"
        @click="
          $router.push({ name: 'dataComparison', params: { id: projectId } })
        "
      >
        <gaugeChart :positionInfo="positionInfo" />
      </div>
      <div class="top-right-line">
        <largeFilterBox
          @filterChange="handleFilterChange"
          size="small"
          :others="true"
        />
        <div
          class="areaDetail-linChart"
          v-loading="chartDataLoading"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <div ref="lineChart" class="lineChart"></div>
        </div>
      </div>
    </div>
    <div class="areaDetail-bottom">
      <p class="hint"><span>LEED</span><i class="icon icon-hint"></i></p>
      <ul class="type-list">
        <li
          class="type-item"
          v-for="(typeItem, idx) in typeList"
          :key="idx"
          v-if="typeItem.tag"
        >
          <div class="item-info">
            <p>{{ typeItem.value }}</p>
            <p>{{ typeItem.name }}</p>
          </div>
          <div class="item-chart">
            <largePieChart :detail="typeItem" ref="largePieChart" />
            <p class="type-status">
              <span v-if="typeItem.tag === 1">优质</span>
              <span v-else-if="typeItem.tag === 2">合格</span>
              <span v-else-if="typeItem.tag === 3">污染</span>
              <span v-else>未知</span>
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import moment from "moment";
import gaugeChart from "@/components/Public/gaugeChart";
import largePieChart from "@/components/Public/largePieChart";
import largeFilterBox from "@/components/Public/largeFilterBox";
import request from "@/utils/request";
import { recomDataChangeTypes } from "@/utils/tool";
export default {
  name: "areaDetail",
  data() {
    return {
      activeType: "formaldehyde",
      lineChart: null,
      projectId: "",
      positionId: "",
      chartDataLoading: false,
      typeList: [
        {
          name: "甲醛",
          type: "formaldehyde",
          value: 0,
          tag: 1,
        },
        {
          name: "TVOC",
          type: "TVOC",
          value: 0,
          tag: 1,
        },
        {
          name: "PM2.5",
          type: "PM25",
          value: 0,
          tag: 1,
        },
        {
          name: "CO2",
          type: "CO2",
          value: 0,
          tag: 1,
        },
        {
          name: "温度",
          type: "temperature",
          value: 0,
          tag: 1,
        },
        {
          name: "湿度",
          type: "humidity",
          value: 0,
          tag: 1,
        },
      ],
      markLine: {
        formaldehyde: 0,
        TVOC: 0,
      },
      searchTime: {
        startTime: moment().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
        // startTime:moment().subtract(10,'days').format('YYYY-MM-DD HH:mm'),
        endTime: moment().format("YYYY-MM-DD HH:mm:ss"),
      },
      filterObj: {
        formaldehyde: "甲醛",
        temperature: "温度",
        humidity: "湿度",
        PM25: "PM2.5",
        CO2: "CO2",
        TVOC: "TVOC",
      },
      positionInfo: {},
    };
  },
  created() {
    this.positionId = this.$route.params.id;
    this.projectId = this.$route.query.project_id;
    this.getNewPositionData(this.positionId);
    this.getMarkline();
  },
  mounted() {
    this.lineChart = echarts.init(this.$refs.lineChart);
  },
  methods: {
    initLineChart(configData) {
      let checkObj = {
        formaldehyde: "甲醛",
        PM25: "PM2.5",
        TVOC: "TVOC",
        CO2: "CO2",
        temperature: "温度",
        humidity: "湿度",
      };
      let series = [
        {
          name: this.filterObj[this.activeType],
          type: "line",
          symbol: "circle",
          symbolSize: 6,
          itemStyle: {
            color: "#71429e",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#71429e",
              },
              {
                offset: 1,
                color: "rgba(14,17,50,0.7)",
              },
            ]),
          },
          data: configData.series[0].data,
        },
      ];
      if (this.activeType === "formaldehyde" || this.activeType === "TVOC") {
        let markLine = {
          symbol: "none",
          silent: true,
          label: {
            show: true,
            position: "end",
            distance: 3,
            formatter: function (params) {
              return `${params.name}参考线：${params.value}`;
            },
          },
          lineStyle: {
            color: "#ddab53",
            width: 2,
          },
          data: [
            {
              yAxis: this.markLine[this.activeType] || 0,
              name: checkObj[this.activeType],
            },
          ],
        };
        series[0].markLine = markLine;
      }
      let option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          selectedMode: false,
          orient: "vertical",
          left: "right",
          top: "center",
          align: "left",
          textStyle: {
            color: "#fff",
          },
        },
        grid: {
          left: "1%",
          right: "12%",
          bottom: "14%",
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
          data: configData.xAxis,
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
        series: series,
        dataZoom: [
          {
            startValue: configData.xAxis[configData.xAxis.length - 100],
          },
          {
            type: "inside",
          },
        ],
      };
      this.lineChart.setOption(option);
    },
    // 获取项目参考线
    getMarkline() {
      request(this.ajaxUrl.projectsInfo + this.projectId, {}, "get")
        .then((res) => {
          this.markLine.formaldehyde = res.hcho;
          this.markLine.TVOC = res.tvoc;
          this.getPositionDatas();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取监测点最近的一条数据
    getNewPositionData(monitorId) {
      return request(
        this.ajaxUrl.getNewPositionData,
        {
          monitorId: monitorId,
        },
        "get"
      )
        .then((res) => {
          const mock_typeList = JSON.parse(JSON.stringify(this.typeList));
          this.positionInfo = {
            project_name: res.project.name,
            area_name: res.area.area_name,
            position_name: res.position.name,
            tag: res.position.tag,
          };
          let datas = res.data[0];
          this.typeList = mock_typeList.map((item, idx) => {
            item.value = datas[item.type];
            item.tag = datas[item.type + "_tag"];
            return item;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 筛选项 变换
    handleFilterChange(type, timeRange) {
      this.searchTime = { ...timeRange };
      this.activeType = type;
      this.lineChart.clear();
      this.getPositionDatas();
    },
    async getPositionDatas() {
      this.chartDataLoading = true;
      let res = await request(
        this.ajaxUrl.positionDatas,
        {
          type: 2,
          monitorId: this.positionId,
          startTime: this.searchTime.startTime,
          endTime: this.searchTime.endTime,
        },
        "get"
      );
      let datas = res.body.list.reverse();
      this.initLineChart(
        recomDataChangeTypes(this.activeType, [this.positionId], [datas])
      );
      this.chartDataLoading = false;
    },
  },
  components: {
    gaugeChart,
    largePieChart,
    largeFilterBox,
  },
};
</script>
<style lang="scss" scoped>
.areaDetail {
  height: 100%;
  padding: calc(136px + 4.6vh) 35px 35px 35px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .areaDetail-top {
    width: 100%;
    height: 51vh;
    display: flex;
    .top-left-gauge {
      width: 515px;
      height: 100%;
      background-color: rgba(14, 17, 50, 0.7);
    }
    .top-right-line {
      margin-left: 30px;
      flex: 1;
      background-color: rgba(14, 17, 50, 0.7);
      padding: 30px 40px 0px 40px;
      display: flex;
      flex-direction: column;
      .areaDetail-linChart {
        width: 100%;
        flex: 1;
        .lineChart {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .areaDetail-bottom {
    flex: 1;
    // margin-top: 4.6vh;
    .hint {
      text-align: right;
      color: #fff;
      font-size: 12px;
      margin-bottom: 10px;
      > span {
        vertical-align: middle;
        margin-right: 10px;
        color: #fff;
      }
      > i {
        vertical-align: middle;
      }
    }
    .type-list {
      height: 18.5vh;
      width: 100%;
      background-color: rgba(12, 14, 39, 0.6);
      padding: 3.7vh 0;
      display: flex;
      justify-content: flex-start;
      flex-wrap: nowrap;
      .type-item {
        flex: 1;
        max-width: 17%;
        height: 100%;
        overflow: hidden;
        padding: 20px 30px;
        box-sizing: border-box;
        position: relative;
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
        &:not(:last-child) {
          &::after {
            content: "";
            width: 1px;
            height: 100%;
            position: absolute;
            right: 0;
            top: 0;
            background-color: #1a3753;
            // box-shadow: 0px 0px 6px 2px #1a3753;
          }
        }
        .item-info {
          flex: 1;
          height: 100%;
          padding: 0 10px;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          > p {
            &:nth-of-type(1) {
              color: #fff;
              font-size: 36px;
              font-weight: 600;
            }
            &:nth-of-type(2) {
              color: #8d8d92;
              font-size: 14px;
            }
          }
        }
        .item-chart {
          width: 80px;
          height: 100%;
          position: relative;
          .type-status {
            position: absolute;
            font-size: 16px;
            color: #fff;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
  }
}
</style>

