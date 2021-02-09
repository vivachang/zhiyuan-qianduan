<template>
  <div class="home" :class="userInfo.type === 2 ? 'customer' : ''">
    <div class="index-welcome" v-show="welcome_show">
      <span>欢迎使用健康空气管理系统，当前版本号V3.0.0</span>
      <i class="el-icon-circle-close" @click="welcome_show = false"></i>
    </div>
    <ul class="statics">
      <li>
        <div>
          <img src="@/static/img/index-item-1.png" alt="" />
        </div>
        <div>
          <p class="name">项目数量</p>
          <p class="acount">
            <strong>{{ indexCount.project_count || 0 }}</strong
            >个
          </p>
        </div>
      </li>
      <li>
        <div>
          <img src="@/static/img/index-item-2.png" alt="" />
        </div>
        <div>
          <p class="name">监测点数量</p>
          <p class="acount">
            <strong>{{ indexCount.position_count || 0 }}</strong
            >个
          </p>
        </div>
      </li>
      <li>
        <div>
          <img src="@/static/img/index-item-3.png" alt="" />
        </div>
        <div>
          <p class="name">设备总数</p>
          <p class="acount">
            <strong>{{ indexCount.device_count || 0 }}</strong
            >个
          </p>
        </div>
      </li>
      <li>
        <div>
          <img src="@/static/img/index-item-4.png" alt="" />
        </div>
        <div>
          <p class="name">运行设备数</p>
          <p class="acount">
            <strong>{{ indexCount.run_device_count || 0 }}</strong
            >个
          </p>
        </div>
      </li>
    </ul>
    <div class="content-warp">
      <div class="chart-box" v-if="userInfo.type === 1">
        <el-tabs v-model="activeType" @tab-click="handleClick">
          <el-tab-pane label="销售额" name="1">
            <div class="chart-title">
              <span>销售额趋势</span>
              <el-date-picker
                class="dayPicker"
                v-model="moneryTime"
                @change="handleMoneyTime"
                value-format="yyyy-MM"
                size="small"
                type="monthrange"
                :picker-options="pickerOptionsMonth"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </div>
          </el-tab-pane>
          <el-tab-pane label="订单数" name="2">
            <div class="chart-title">
              <span>订单增长趋势</span>
              <el-date-picker
                class="dayPicker"
                v-model="orderTime"
                @change="handleOrderTime"
                value-format="yyyy-MM"
                size="small"
                type="monthrange"
                :picker-options="pickerOptionsMonth"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="bar-chart-box">
          <component :is="componentName" :chartData="chartData"></component>
        </div>
      </div>
      <div class="warning-msg" v-if="userInfo.type === 1" v-btnRole="'11,12'">
        <dl>
          <dt>
            <span>解决方案</span>
            <span class="more-btn" @click="$router.push({ name: 'solution' })"
              >More</span
            >
          </dt>
          <dd v-for="item in msgList" :key="item.id">
            <span
              :class="item.isnew === 1 ? 'isNew' : ''"
              v-if="item.projects_positions"
              @click="handleToDetail(item)"
              :title="
                item.projects_positions.name +
                '检测到' +
                item.threshold_keys +
                '超标'
              "
            >
              {{ item.projects_positions.name }}检测到{{
                item.threshold_keys
              }}超标
            </span>
            <span>{{ item.waring_time }}</span>
          </dd>
        </dl>
      </div>
      <div class="warning-msg" v-if="userInfo.type === 2" v-btnRole="'9,10'">
        <dl>
          <dt>
            <span>预报警报</span>
            <span
              class="more-btn"
              @click="$router.push({ name: 'customerWarning' })"
              >More</span
            >
          </dt>
          <dd v-for="item in msgList" :key="item.id">
            <span
              :class="item.isnew === 1 ? 'isNew' : ''"
              v-if="item.projects_positions"
              @click="handleToDetail(item)"
              :title="
                item.projects_positions.name +
                '检测到' +
                item.threshold_keys +
                '超标'
              "
            >
              {{ item.projects_positions.name }}检测到{{
                item.threshold_keys
              }}超标
            </span>
            <span>{{ item.waring_time }}</span>
          </dd>
        </dl>
      </div>
    </div>
    <div class="condition-box" :class="userInfo.type === 2 ? 'customer' : ''">
      <div class="condition-left">
        <strong>项目情况</strong>
        <div class="condition-item">
          <p class="condition-title">
            <img src="@/static/icon/index-icon1.png" alt="" /><span
              >累计项目数</span
            >
          </p>
          <strong>{{ indexCount.project_count || 0 }}</strong>
        </div>
        <div class="condition-item">
          <p class="condition-title">
            <img src="@/static/icon/index-icon1.png" alt="" /><span
              >本周新增项目数</span
            >
          </p>
          <strong>{{ indexCount.project_week_count || 0 }}</strong>
        </div>
      </div>
      <div class="condition-right">
        <div class="right-title">
          <strong>新增项目</strong>
          <div class="time-change">
            <div class="radio-box">
              <radio-group @change="handleChange" ref="radioGroup" />
            </div>
            <el-date-picker
              class="dayPicker"
              value-format="yyyy-MM-dd"
              @change="handleProjectTime"
              :picker-options="pickerOptionsDay"
              v-model="projectTime"
              size="small"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </div>
        </div>
        <div class="right-chart">
          <div ref="lineChart" :style="{ width: '100%', height: '100%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import IndexBarChart from "@/components/EchartsItem/IndexBarChart";
import radioGroup from "@/components/Public/radioGroup";
import request from "@/utils/request";
import moment from "moment";
export default {
  name: "home",
  data() {
    return {
      msgList: [],
      welcome_show: true,
      activeType: "1",
      chartData: {
        data: [],
        title: "",
        xAxis: [],
      },
      projectTime: "",
      projectTimeType: 2,

      componentName: "",
      lineChart: null,
      indexCount: {},
      userInfo: {},
      moneryTime: [
        moment().startOf("month").format("YYYY-MM"),
        moment().format("YYYY-MM"),
      ],
      orderTime: [
        moment().startOf("month").format("YYYY-MM"),
        moment().format("YYYY-MM"),
      ],

      allProjectList: [], //最近一年的新增项目
      pickerOptionsDay: {
        disabledDate(time) {
          return (
            time.getTime() > moment() ||
            time.getTime() < moment().subtract(1, "year")
          );
        },
      },
      pickerOptionsMonth: {
        disabledDate(time) {
          return (
            moment(time).format("YYYY-MM") > moment().format("YYYY-MM") ||
            moment(time).format("YYYY-MM") <
              moment().subtract(11, "month").format("YYYY-MM")
          );
        },
      },
    };
  },
  created() {
    this.userInfo = this.$store.getters.admin_detail;
    this.getIndexCount();
  },
  mounted() {
    if (this.userInfo.type === 1) {
      this.componentName = "indexBarChart";
      this.getIndexOrderSale();
    }
    this.lineChart = echarts.init(this.$refs.lineChart);
    this.getIndexNewProjectCount();
  },
  methods: {
    // 跳转 预警警报/解决方案 查看页面
    handleToDetail(item) {
      if (this.userInfo.type === 1) {
        let hasDetailRole = this.$store.getters.roleList.includes(11); //是否有 解决方案 发送消息权限
        if (hasDetailRole) {
          this.$router.push({
            name: "solutionMsg",
            params: { id: item.id },
            query: { type: "send" },
          });
        } else {
          this.$message.warning("您没有【数据详情】功能权限，请联系管理员");
        }
      } else {
        let hasDetailRole = this.$store.getters.roleList.includes(9); //是否有 预警警报 发送消息权限
        if (hasDetailRole) {
          this.$router.push({
            name: "customerMsg",
            params: { id: item.id },
            query: { type: "send" },
          });
        } else {
          this.$message.warning("您没有【数据详情】功能权限，请联系管理员");
        }
      }
    },
    // 获取首页统计数据
    getIndexCount() {
      request(this.ajaxUrl.indexCount, {}, "get")
        .then((res) => {
          this.indexCount = {
            ...res.count,
            project_week_count: res.project_week_count,
          };
          this.msgList = res.msg_list;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 订单数/销售额切换
    handleClick(tab, event) {
      this.getIndexOrderSale();
    },
    // 销售额时间切换
    handleMoneyTime(time) {
      this.moneryTime[0] = time[0];
      this.moneryTime[1] = time[1];
      this.getIndexOrderSale();
    },
    // 订单数时间切换
    handleOrderTime(time) {
      this.orderTime[0] = time[0];
      this.orderTime[1] = time[1];
      this.getIndexOrderSale();
    },
    // 首页 订单数/销售额 数据
    getIndexOrderSale() {
      request(
        this.ajaxUrl.getIndexOrderSale,
        {
          type: this.activeType,
          start_date:
            this.activeType == 1 ? this.moneryTime[0] : this.orderTime[0],
          end_date:
            this.activeType == 1 ? this.moneryTime[1] : this.orderTime[1],
        },
        "get"
      )
        .then((res) => {
          let _chartData = {};
          _chartData.data = res.map((item) => {
            return this.activeType == 1 ? item.money : item.count;
          });
          this.activeType == 1
            ? (_chartData.title = "销售额")
            : (_chartData.title = "订单数");
          _chartData.xAxis = res.map((item) => {
            return item.date;
          });
          this.chartData = _chartData;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 首页新增项目数据
    getIndexNewProjectCount() {
      request(
        this.ajaxUrl.getIndexNewProjectCount,
        {
          type: this.projectTimeType,
          start_date: this.projectTime[0],
          end_date: this.projectTime[1],
        },
        "get"
      )
        .then((res) => {
          this.allProjectList = res;
          this.lineChart.setOption(this.initProjectOption());
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleChange(active) {
      this.projectTimeType = active;
      this.projectTime = [];
      this.getIndexNewProjectCount();
    },
    // 新增项目 时间筛选
    handleProjectTime(time) {
      // this.$refs.radioGroup.reset();
      this.getIndexNewProjectCount();
    },
    // 生成 新增项目 图表配置项
    initProjectOption() {
      this.lineChart.clear();
      const dateArr = [],
        seriesArr = [];
      this.allProjectList.map((item) => {
        dateArr.push(item.date);
        seriesArr.push(item.count);
      });
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: dateArr,
          axisLine: {
            lineStyle: {
              color: "#959595",
            },
          },
        },
        yAxis: {
          type: "value",
          minInterval: 1,
          axisLine: {
            lineStyle: {
              //横向分割线样式
              color: "#959595",
            },
          },
        },
        grid: {
          left: "3%",
          top: "10%",
          right: "5%",
          bottom: "13%",
        },
        series: [
          {
            data: seriesArr,
            type: "line",
            name: "新增项目数量",
            itemStyle: {
              color: "#626eff",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#d3d6ff",
                },
                {
                  offset: 1,
                  color: "#fdfdff",
                },
              ]),
            },
          },
        ],
      };
      return option;
    },
  },
  components: {
    IndexBarChart,
    radioGroup,
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.home {
  // max-width: 1180px;
  width: 100%;
  > .title {
    margin: 0 0 26px 0;
    font-size: 16px;
  }
  .index-welcome {
    width: 100%;
    height: 44px;
    border: 1px solid #89e2bb;
    border-radius: 4px;
    color: #199861;
    background-color: #e9f9f2;
    font-size: 12px;
    line-height: 42px;
    padding-left: 12px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 30px;
    > i {
      font-size: 20px;
      cursor: pointer;
    }
  }
  .statics {
    width: 100%;
    display: flex;
    justify-content: space-between;
    li {
      width: 24%;
      // max-width: 280px;
      height: 116px;
      background: #fff;
      box-sizing: border-box;
      padding: 0px 10px 0 20px;
      background-repeat: no-repeat;
      background-position: right bottom;
      border-radius: 4px;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      > div {
        height: 60px;
        &:nth-of-type(1) {
          width: 60px;
          height: 60px;
          > img {
            width: 100%;
            height: 100%;
          }
        }
        &:nth-of-type(2) {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-left: 22px;
          .name {
            font-size: 12px;
            color: #959595;
          }
          .acount {
            font-size: 12px;
            color: #000;
            > strong {
              font-size: 28px;
            }
          }
        }
      }
    }
  }
  .content-warp {
    width: 100%;
    height: 433px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    margin-top: 20px;
    font-size: 12px;
    > div {
      height: 100%;
      background: #fff;
      box-sizing: border-box;
      border-radius: 4px;
    }
    .chart-box {
      margin-right: 20px;
      flex: 1;
      padding: 20px 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .chart-title {
        font-size: 14px;
        color: #000;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;
      }
      .bar-chart-box {
        flex: 1;
      }
    }
    .warning-msg {
      // width: 380px;
      width: 32%;
      padding: 36px 10px 0 20px;
      color: #7b7b7b;
      dl {
        dt {
          color: #000;
          margin-bottom: 15px;
          display: flex;
          justify-content: space-between;
          padding-right: 10px;
          .more-btn {
            color: #5a66ff;
            cursor: pointer;
          }
        }
        dd {
          line-height: 36px;
          padding-left: 12px;
          display: flex;
          justify-content: space-between;
          flex-wrap: nowrap;
          position: relative;
          &::before {
            content: "";
            position: absolute;
            width: 4px;
            height: 4px;
            background: #5a66ff;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
          > span {
            white-space: nowrap;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            &:nth-of-type(1) {
              width: 65%;
              cursor: pointer;
              &.isNew {
                &::before {
                  content: "New";
                  display: inline-block;
                  padding: 0 4px;
                  background-color: #ff5e5e;
                  color: #fff;
                  border-radius: 4px;
                  transform: scale(0.8);
                  height: 20px;
                  line-height: 20px;
                  font-size: 12px;
                }
              }
            }
            &:nth-of-type(2) {
              width: 30%;
              text-align: right;
            }
          }
        }
      }
    }
  }
  .condition-box {
    width: 100%;
    height: 330px;
    background: #fff;
    border-radius: 4px;
    margin-top: 20px;
    display: flex;
    > div {
      box-sizing: border-box;
    }
    .condition-left {
      // width: 280px;
      width: 24%;
      height: 100%;
      padding: 20px 25px;
      > strong {
        font-size: 14px;
        margin-bottom: 35px;
        display: inline-block;
      }
      .condition-item {
        // width: 210px;
        width: 80%;
        height: 97px;
        background-color: #f7f7ff;
        border-radius: 4px;
        box-sizing: border-box;
        padding: 18px 15px;
        &:nth-of-type(1) {
          margin-bottom: 20px;
        }
        .condition-title {
          font-size: 16px;
          color: #888888;
          margin-bottom: 18px;
          > img {
            vertical-align: middle;
          }
          > span {
            vertical-align: middle;
            margin-left: 10px;
          }
        }
        > strong {
          font-size: 24px;
          color: #000;
        }
      }
    }
    .condition-right {
      flex: 1;
      // max-width: 800px;
      height: 100%;
      box-sizing: border-box;
      padding: 14px 20px 0 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .right-title {
        width: 100%;
        font-size: 14px;
        color: #000;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .time-change {
          display: flex;
          flex-wrap: nowrap;
          .radio-box {
            width: 190px;
            margin-right: 20px;
          }
        }
      }
      .right-chart {
        width: 100%;
        flex: 1;
      }
    }
  }

  &.customer {
    font-size: 0;
    .content-warp {
      width: 530px;
      display: inline-block;
      vertical-align: top;
      .warning-msg {
        width: 100%;
      }
    }
    .condition-box {
      width: calc(100% - 550px);
      display: inline-flex;
      vertical-align: top;
      margin-left: 20px;
      height: 433px;
      .condition-left {
        width: 35%;
        min-width: 200px;
        .condition-item {
          width: 100%;
        }
      }
    }
  }
}
</style>
