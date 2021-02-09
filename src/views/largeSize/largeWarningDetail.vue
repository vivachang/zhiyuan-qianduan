<template>
  <div class="largeWarningDetail">
    <div class="largeWarning-left">
      <div class="chart-box">
        <gaugeChart :positionInfo="positionInfo" />
      </div>
      <ul class="warning-term-list">
        <li
          class="item"
          v-for="(item, idx) in typeList"
          :key="idx"
          v-if="item.tag"
        >
          <div class="pie-chart-box">
            <largePieChart :detail="item" />
            <div class="center-text">
              <p>{{ item.value }}</p>
              <p>
                <span v-if="item.tag === 1">优秀</span>
                <span v-else-if="item.tag === 2">合格</span>
                <span v-else-if="item.tag === 3">污染</span>
                <span v-else>未知</span>
              </p>
            </div>
          </div>
          <p class="item-name">{{ item.name }}</p>
        </li>
      </ul>
    </div>
    <div class="largeWarning-right">
      <div class="right-title">预警警报</div>
      <ul class="warning-list">
        <li
          class="warning-item"
          v-for="warningItem in warningList"
          :key="warningItem.id"
          @click="handleShowImprove(warningItem)"
        >
          <largeWarningItem :info="warningItem" />
        </li>
      </ul>
    </div>
    <el-dialog
      title="改善建议"
      :visible.sync="suggestVisible"
      :close-on-click-modal="false"
      width="1114px"
    >
      <!-- <improveBox @close="suggestVisible=false" :warningDetail="warningDetail"/> -->
      <newImproveBox
        @close="suggestVisible = false"
        @showBig="handleShowBigImg"
        :warningMsgList="warningMsgList"
      />
    </el-dialog>
    <el-dialog :visible.sync="bigImgVisible">
      <img style="display: block" width="100%" :src="bigImgUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import echarts from "echarts";
import largeWarningItem from "@/components/Public/largeWarningItem";
import largePieChart from "@/components/Public/largePieChart";
import gaugeChart from "@/components/Public/gaugeChart";
import improveBox from "@/components/Public/improveBox";
import newImproveBox from "@/components/Public/newImproveBox";
import request from "@/utils/request";
export default {
  name: "largeWarningDetail",
  data() {
    return {
      gagueChart: null,
      suggestVisible: false,
      warningList: [],
      typeList: [
        {
          name: "甲醛",
          type: "formaldehyde",
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
      ],
      warningMsgList: [],
      positionInfo: {},
      firstPositionId: "",
      bigImgVisible: false,
      bigImgUrl: "",
    };
  },
  created() {
    this.getEarlywarningList();
  },
  mounted() {},
  methods: {
    getChartMsgList(warningId) {
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
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 展示大图
    handleShowBigImg(url) {
      this.bigImgUrl = url;
      this.bigImgVisible = true;
    },
    // 获取预警警报列表 -
    getEarlywarningList() {
      request(
        this.ajaxUrl.earlyWarningList,
        {
          page: 1,
          pageSize: 12,
        },
        "get"
      )
        .then((res) => {
          this.warningList = res.data.slice(0, 12);
          this.firstPositionId =
            this.warningList[0] && this.warningList[0].projects_positions.id;
          if (this.firstPositionId) {
            this.getNewPositionData(this.firstPositionId);
          }
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
          this.typeList = mock_typeList.map((item) => {
            item.value = datas[item.type];
            item.tag = datas[item.type + "_tag"];
            return item;
          });
          console.log(this.typeList);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleShowImprove(warningItem) {
      if (warningItem.isnew) {
        this.suggestVisible = true;
        this.getChartMsgList(warningItem.id);
      }
    },
  },
  components: {
    largeWarningItem,
    largePieChart,
    gaugeChart,
    newImproveBox,
  },
};
</script>
<style lang="scss" scoped>
.largeWarningDetail {
  width: 100%;
  height: 100%;
  padding: calc(68px + 3vh) 40px 20px 40px;
  display: flex;
  > div {
    height: 100%;
    &.largeWarning-left {
      width: 35%;
      max-width: 515px;
      background-color: rgba(15, 16, 52, 0.5);
      overflow: hidden;
      // display: flex;
      // flex-direction: column;
      .chart-box {
        max-width: 430px;
        width: 100%;
        padding: 0 20px;
        min-height: 330px;
        height: 50%;
        margin: 0 auto;
        margin-bottom: 20px;
      }
      .warning-term-list {
        width: 100%;
        height: 50%;
        max-height: calc(100% - 330px);
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 0 33px;
        overflow-y: auto;
        .item {
          width: 30%;
          height: 40%;
          max-height: 150px;
          margin-bottom: 4.6vh;
          .pie-chart-box {
            width: 100%;
            // height: 120px;
            height: calc(100% - 30px - 2vh);
            min-height: 60px;
            position: relative;
            .pie-chart {
              width: 100%;
              height: 100%;
            }
            .center-text {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              > p {
                color: #fff;
                text-align: center;
                &:nth-of-type(1) {
                  font-size: 26px;
                }
                &:nth-of-type(2) {
                  font-size: 18px;
                }
              }
            }
          }
          .item-name {
            text-align: center;
            font-size: 16px;
            color: #a5a4a9;
            margin-top: 2vh;
          }
        }
      }
    }
    &.largeWarning-right {
      overflow: hidden;
      flex: 1;
      padding-left: 35px;
      padding-top: 68px;
      .right-title {
        width: 250px;
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
        background: linear-gradient(to right, #1f2352, #05042e);
        font-size: 24px;
        color: #fff;
      }
      .warning-list {
        width: 100%;
        height: calc(100% - 80px);
        overflow-y: auto;
        display: flex;
        flex-wrap: wrap;
        margin-top: 20px;
        .warning-item {
          width: 23%;
          margin-right: 2%;
          margin-bottom: 2vh;
          &:nth-of-type(9),
          &:nth-of-type(10),
          &:nth-of-type(11),
          &:nth-of-type(12) {
            margin-bottom: 0;
          }
          /deep/.warning-content {
            > p {
              font-size: 16px;
            }
          }
        }
      }
    }
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
</style>