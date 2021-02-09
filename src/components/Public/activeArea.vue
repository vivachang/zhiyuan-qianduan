<template>
  <div class="activeArea">
    <div class="area-place">
      <div class="img-box">
        <img :src="area.file && area.file.path" alt="" />
        <div class="item-box">
          <el-popover
            v-for="(item, idx) in positionList"
            :key="idx"
            v-model="item.visible"
            placement="top-start"
            title=""
            width="422"
            @show="handleShowPopover(item, idx)"
            trigger="click"
          >
            <div
              class="hover-content"
              @click="
                $router.push({
                  name: 'areaDetail',
                  params: { id: item.id },
                  query: { project_id: item.project_id },
                })
              "
            >
              <div class="hover-title">
                <span class="position-name">{{ item.name }}</span>
                <span class="hover-time">{{ item.timestamp }}</span>
              </div>
              <div class="content">
                <div class="content-left">
                  <div class="hover-chart">
                    <largePieChart :detail="item.chart" />
                    <p class="chart-center" v-if="item.tag === 1">优秀</p>
                    <p class="chart-center" v-else-if="item.tag === 2">合格</p>
                    <p class="chart-center" v-else-if="item.tag === 3">污染</p>
                    <p class="chart-center" v-else>未知</p>
                  </div>
                </div>
                <div
                  class="content-right"
                  v-loading="dataLoading"
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(0, 0, 0, 0.2)"
                >
                  <p v-for="(child, childIdx) in item.data" :key="childIdx">
                    <span>{{ child.name }}</span>
                    <span>{{ child.value }}</span>
                  </p>
                </div>
              </div>
            </div>
            <!-- <i slot="reference" @click="handleChooseMonitor(item)" class="icon icon-position-default area-item" :class="item.status==2 ? 'isDisabled' : ''" :style="{'left':item.location.left,'top':item.location.top}"></i> -->
            <smallBall
              slot="reference"
              :class="item.status == 2 ? 'isDisabled' : ''"
              @click="handleChooseMonitor(item)"
              :tag="item.tag"
              :style="{ left: item.location.left, top: item.location.top }"
            ></smallBall>
          </el-popover>
          <i class="el-icon-circle-close closeBtn" @click="handleCloseArea"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import largePieChart from "@/components/Public/largePieChart";
import smallBall from "./smallBall";
import request from "@/utils/request";
export default {
  name: "activeArea",
  props: ["area"],
  data() {
    return {
      positionList: [],
      dataLoading: true,
    };
  },
  mounted() {},
  methods: {
    handleCloseArea() {
      this.$emit("close");
    },
    handleChooseMonitor(item) {
      this.$emit("updateLineChart", item.project_id, item.id);
    },
    async handleShowPopover(item, idx) {
      const values = {
        1: 40,
        2: 55,
        3: 70,
      };
      this.dataLoading = true;
      const res = await this.getPositionData(item.id);
      this.dataLoading = false;
      item.chart = {
        value: values[item.tag],
        tag: item.tag,
      };
      item.data = this.publicObj.defaultThreshold.map((child, idx) => {
        console.log(child);
        return {
          name: child.name,
          value: (res.data[0] && res.data[0][child.type]) || "",
        };
      });
      item.timestamp = res.data[0] && res.data[0].timestamp;
      console.log(item, 1111111);
      this.$forceUpdate();
    },
    // 获取最近的一条数据
    getPositionData(monitorId) {
      return request(
        this.ajaxUrl.getNewPositionData,
        {
          monitorId: monitorId,
        },
        "get"
      );
    },
  },
  watch: {
    area(newVal, oldVal) {
      this.positionList = newVal.position.map((item) => {
        return {
          chart: { value: 0, tag: item.tag },
          datas: {},
          visible: false,
          ...item,
        };
      });
    },
  },
  components: {
    largePieChart,
    smallBall,
  },
};
</script>
<style lang="scss" scoped>
.ballImg {
  width: 50px;
  height: 50px;
  position: absolute;
}
.activeArea {
  width: 100%;
  height: 100%;
  padding: calc(136px + 2vh) 282px 20px 30%;
  color: #fff;
  // line-height: 300px;
  font-size: 60px;
  position: relative;
  display: flex;
  align-items: center;
  .area-place {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-y: auto;
    .img-box {
      text-align: center;
      position: relative;
      display: inline-block;
      font-size: 0;
      > img {
        max-width: 100%;
        max-height: 100%;
        display: inline-block;
      }
    }
    // .img-box{
    //     text-align: center;
    //     position: relative;
    //     display: inline-block;
    //     font-size: 0;
    //     width: 100%;
    //     height: 100%;
    //     >img{
    //         width: 100%;
    //         height: 100%;
    //         display: inline-block;
    //     }
    // }
    .item-box {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      .area-item {
        position: absolute;
        cursor: pointer;
        &:hover {
          background: url("../../static/icon/position-hover.png") no-repeat
            center center/100% 100%;
        }
      }
      .closeBtn {
        font-size: 20px;
        color: #5a66ff;
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
      }
    }
  }
}
.hover-content {
  width: 100%;
  height: 220px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  .hover-title {
    width: 100%;
    height: 52px;
    padding-left: 35px;
    color: #fff;
    background: linear-gradient(to right, #292653, #0e0d32);
    .hover-time {
      margin-left: 20px;
      color: #fff;
      font-size: 14px;
      display: inline-block;
      vertical-align: middle;
    }
    .position-name {
      font-size: 22px;
      color: #fff;
      display: inline-block;
      line-height: 52px;
      max-width: 55%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: middle;
    }
  }
  .content {
    padding: 20px 30px 20px 35px;
    flex: 1;
    display: flex;
    flex-wrap: nowrap;
    > div {
      height: 100%;
      &.content-left {
        width: 105px;
        .hover-chart {
          width: 100%;
          position: relative;
          .chart-center {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            color: #fff;
            font-size: 16px;
          }
        }
      }
      &.content-right {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > p {
          width: 100%;
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          color: #fff;
          padding-left: 36px;
          > span {
            &:nth-of-type(1) {
              color: #aeacca;
            }
          }
        }
      }
    }
  }
}
.isDisabled {
  pointer-events: none;
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
}
</style>