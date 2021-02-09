// 监测点
<template>
  <div class="smallMonitor_wrapper">
    <div class="center_title">
      <p v-if="receiveItem.areas">{{ receiveItem.areas[queryIndex].area_name }}</p>
    </div>
    <div class="top_img_wrapper">
      <div
        class="left_wrapper"
        v-if="receiveItem.areas"
        :class="rightItemArr.length >= 5 ? 'active_img_height' : ''"
      >
        <div class="inner_img">
          <img :src="receiveItem.areas[queryIndex].file.path" />
          <div
            class="position_img"
            v-for="(item, index) in receiveItem.areas[queryIndex].position"
            :key="index"
            :style="{
              top: item.location.top,
              left: item.location.left,
            }"
            :class="[
              { excellent_img: item.tag == 1 || item.tag == null },
              { qualified_img: item.tag == 2 },
              { contaminated_img: item.tag == 3 },
              {
                stop_class: item.status == 2
              }
            ]"
          >{{ index + 1 }}</div>
        </div>
      </div>
      <ul class="right_wrapper" v-if="rightItemArr.length < 5">
        <li v-for="(item, index) in rightItemArr" :key="index">
          <div class="item_top" v-if="item.position">
            <span
              class="num"
              :class="[
                { excellent: item.position.tag == 1 || item.position.tag == null },
                { qualified: item.position.tag == 2 },
                { contaminated: item.position.tag == 3 },
              ]"
            >{{ index + 1 }}</span>
            <p class="name">{{ item.position.name }}</p>
            <p class="time">{{ item.position.updated_at }}</p>
          </div>
          <div class="item_center">
            <largeBall :tag="item.position.tag" v-if="item.position" />
            <div class="temperature" style="margin: 0 0.42rem 0 0.28rem">
              <p class="du">
                {{
                item.temperature != ""
                ? item.temperature
                : 0
                }}℃
              </p>
              <p class="text">温度</p>
            </div>
            <div class="temperature">
              <p class="du">
                {{
                item.humidity != ""
                ? item.humidity
                : 0
                }}%
              </p>
              <p class="text">湿度</p>
            </div>
          </div>
          <div class="bottom_wrapper">
            <p style="width: 1.15rem; margin-bottom: 0.08rem">
              <span style="background: #23cd6c"></span>
              甲醛:{{
              item.formaldehyde != ""
              ? item.formaldehyde
              : 0
              }}
            </p>
            <p>
              <span style="background: #eb982c"></span>
              TVOC:{{
              item.TVOC != ""
              ? item.TVOC
              : 0
              }}
            </p>
            <p style="width: 1.15rem">
              <span style="background: #eb3c2c"></span>
              PM2.5:{{
              item.PM25 != ""
              ? item.PM25
              : 0
              }}
            </p>
            <p>
              <span style="background: #23cd6c"></span>
              CO2:{{
              item.CO2 != ""
              ? item.CO2
              : 0
              }}
            </p>
          </div>
        </li>
      </ul>
      <ul class="right_wrapper" v-if="rightItemArr.length > 5" style="flex-flow: wrap-reverse">
        <li v-for="(item, index) in rightItemSliceArr" :key="index">
          <div class="item_top" v-if="item.position">
            <span
              class="num"
              :class="[
                { excellent: item.position.tag == 1 || item.tag == null },
                { qualified: item.position.tag == 2 },
                { contaminated: item.position.tag == 3 },
              ]"
            >{{ index + 6 }}</span>
            <p class="name">{{ item.position.name }}</p>
            <p class="time">{{ item.position.updated_at }}</p>
          </div>
          <div class="item_center">
            <largeBall :tag="item.position.tag" v-if="item.position" />
            <div class="temperature" style="margin: 0 0.42rem 0 0.28rem">
              <p class="du">
                {{
                item.temperature != ""
                ? item.temperature
                : 0
                }}℃
              </p>
              <p class="text">温度</p>
            </div>
            <div class="temperature">
              <p class="du">
                {{
                item.humidity != ""
                ? item.humidity
                : 0
                }}%
              </p>
              <p class="text">湿度</p>
            </div>
          </div>
          <div class="bottom_wrapper">
            <p style="width: 1.15rem; margin-bottom: 0.08rem">
              <span style="background: #23cd6c"></span>
              甲醛:{{
              item.formaldehyde != ""
              ? item.formaldehyde
              : 0
              }}
            </p>
            <p>
              <span style="background: #eb982c"></span>
              TVOC:{{
              item.TVOC != ""
              ? item.TVOC
              : 0
              }}
            </p>
            <p style="width: 1.15rem">
              <span style="background: #eb3c2c"></span>
              PM2.5:{{
              item.PM25 != ""
              ? item.PM25
              : 0
              }}
            </p>
            <p>
              <span style="background: #23cd6c"></span>
              CO2:{{
              item.CO2 != ""
              ? item.CO2
              : 0
              }}
            </p>
          </div>
        </li>
      </ul>
    </div>
    <!-- 5个监测点显示 -->
    <ul class="bottom_monitor" style="display: flex" v-if="rightItemArr.length >= 5">
      <li v-for="(item, index) in rightItemArr.slice(0, 5)" :key="index">
        <div class="item_top" v-if="item.position">
          <span
            class="num"
            :class="[
              { excellent: item.position.tag == 1 || item.position.tag == null },
              { qualified: item.position.tag == 2 },
              { contaminated: item.position.tag == 3 },
            ]"
          >{{ index + 1 }}</span>
          <p class="name">{{ item.position.name }}</p>
          <p class="time">{{ item.position.updated_at }}</p>
        </div>
        <div class="item_center">
          <largeBall :tag="item.position.tag" v-if="item.position" />
          <div class="temperature" style="margin: 0 0.42rem 0 0.28rem">
            <p class="du">
              {{
              item.temperature != ""
              ? item.temperature
              : 0
              }}℃
            </p>
            <p class="text">温度</p>
          </div>
          <div class="temperature">
            <p class="du">
              {{
              item.humidity != ""
              ? item.humidity
              : 0
              }}%
            </p>
            <p class="text">湿度</p>
          </div>
        </div>
        <div class="bottom_wrapper">
          <p style="width: 1.15rem; margin-bottom: 0.08rem">
            <span style="background: #23cd6c"></span>
            甲醛:{{
            item.formaldehyde != ""
            ? item.formaldehyde
            : 0
            }}
          </p>
          <p>
            <span style="background: #eb982c"></span>
            TVOC:{{
            item.TVOC != ""
            ? item.TVOC
            : 0
            }}
          </p>
          <p style="width: 1.15rem">
            <span style="background: #eb3c2c"></span>
            PM2.5:{{
            item.PM25 != ""
            ? item.PM25
            : 0
            }}
          </p>
          <p>
            <span style="background: #23cd6c"></span>
            CO2:{{
            item.CO2 != ""
            ? item.CO2
            : 0
            }}
          </p>
        </div>
      </li>
    </ul>
    <!-- 大于9个监测点显示 -->
    <ul class="bottom_monitor" style="display: flex" v-if="rightItemArr.length > 9">
      <li v-for="(item, index) in multipleItem" :key="index">
        <div class="item_top" v-if="item.position">
          <span
            class="num"
            :class="[
              { excellent: item.position.tag == 1 || item.position.tag == null },
              { qualified: item.position.tag == 2 },
              { contaminated: item.position.tag == 3 },
            ]"
          >{{ index + 10 }}</span>
          <p class="name">{{ item.position.name }}</p>
          <p class="time">{{ item.position.updated_at }}</p>
        </div>
        <div class="item_center">
          <largeBall :tag="item.tag" v-if="item.position" />
          <div class="temperature" style="margin: 0 0.42rem 0 0.28rem">
            <p class="du">
              {{
              item.temperature != ""
              ? item.temperature
              : 0
              }}℃
            </p>
            <p class="text">温度</p>
          </div>
          <div class="temperature">
            <p class="du">
              {{
              item.humidity != ""
              ? item.humidity
              : 0
              }}%
            </p>
            <p class="text">湿度</p>
          </div>
        </div>
        <div class="bottom_wrapper">
          <p style="width: 1.15rem; margin-bottom: 0.08rem">
            <span style="background: #23cd6c"></span>
            甲醛:{{
            item.formaldehyde != ""
            ? item.formaldehyde
            : 0
            }}
          </p>
          <p>
            <span style="background: #eb982c"></span>
            TVOC:{{
            item.VOC != ""
            ? item.TVOC
            : 0
            }}
          </p>
          <p style="width: 1.15rem">
            <span style="background: #eb3c2c"></span>
            PM2.5:{{
            item.PM25 != ""
            ? item.PM25
            : 0
            }}
          </p>
          <p>
            <span style="background: #23cd6c"></span>
            CO2:{{
            item.CO2 != ""
            ? item.CO2
            : 0
            }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import largeBall from "@/components/Public/largeBall";
import request from "@/utils/request";
export default {
  name: "smallMonitor",
  components: {
    largeBall,
  },
  data() {
    return {
      receiveItem: {},
      idList: [],
      rightItemArr: [],
      rightItemSliceArr: [],
      multipleItem: [],
      queryIndex: "",
    };
  },
  created() {
    this.queryIndex = this.$route.query.index;
    this.getPositionList();
  },
  methods: {
    // 获取该项目下的监测点列表
    getPositionList() {
      request(
        this.ajaxUrl.largeIndexArea,
        {
          project_id: this.$route.query.id,
        },
        "get"
      ).then((res) => {
        this.receiveItem = res;
        if (res.areas[this.queryIndex].position.length != 0) {
          this.idList = res.areas[this.queryIndex].position.map(
            (ele) => ele.id
          );
        }
        this.getNewPositionData();
      });
    },
    // 获取监测点数据
    getNewPositionData() {
      request(
        this.ajaxUrl.getNewSmallPositionDatas,
        {
          monitorIds: this.idList.toString(),
        },
        "get"
      )
        .then((res) => {
          this.rightItemArr = res.data;
          if (this.rightItemArr.length > 5) {
            this.rightItemSliceArr = this.rightItemArr.slice(5, 10).reverse();
          }
          if (this.rightItemArr.length > 9) {
            this.multipleItem = this.rightItemArr.slice(9);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.center_title {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 0.17rem /* 17/100 */;
  margin-left: 0.36rem /* 36/100 */;
  padding-left: 0.25rem /* 25/100 */;
  max-width: 4.4rem /* 290/100 */;
  height: 0.5rem /* 50/100 */;
  background: url("../../static/img/small_left_title.png") no-repeat center
    center/100% 100%;
  z-index: 99;
}
.center_title p {
  margin: 0 0.08rem 0 0.18rem;
  font-size: 0.2rem /* 20/100 */;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #f4f4f5;
}
.top_img_wrapper {
  display: flex;
  margin-bottom: 0.12rem /* 22/100 */;
}
.left_wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.36rem /* 36/100 */;
  margin-right: 0.12rem /* 12/100 */;
  width: 7.7rem /* 770/100 */;
  height: 5.14rem /* 514/100 */;
  background: #11133e;
  box-shadow: 0px 1px 3px 0px rgba(42, 44, 121, 1);
  opacity: 0.8;
}
.left_wrapper .inner_img {
  position: relative;
  width: 6.84rem /* 684/100 */;
  height: 3.04rem /* 304/100 */;
}
.left_wrapper .inner_img img {
  display: block;
  width: 100%;
  height: 100%;
}
.right_wrapper {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  width: 5.3rem /* 520/100 */;
}
.right_wrapper li,
.bottom_monitor li {
  margin-right: 0.12rem /* 12/100 */;
  margin-bottom: 0.12rem /* 12/100 */;
  width: 2.49rem /* 248/100 */;
  height: 1.79rem /* 179/100 */;
  background: url("../../static/img/rside_bg.png") no-repeat center center/100%
    100%;
  color: #f4f4f5;
}
.position_img {
  position: absolute;
  width: 0.36rem /* 36/100 */;
  height: 0.43rem /* 43/100 */;
  background: green;
  font-size: 0.24rem /* 24/100 */;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #f4f4f5;
  line-height: 0.4rem /* 43/100 */;
  text-align: center;
  cursor: pointer;
}
.right_wrapper li .item_top,
.bottom_monitor li .item_top {
  display: flex;
  align-items: center;
  padding: 0 0.11rem /* 11/100 */;
  height: 0.4rem /* 40/100 */;
}
.right_wrapper li .item_top .num,
.bottom_monitor li .item_top .num {
  display: inline-block;
  width: 0.2rem /* 20/100 */;
  height: 0.2rem /* 20/100 */;
  line-height: 0.2rem /* 20/100 */;
  text-align: center;
  font-size: 0.14rem /* 14/100 */;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #f4f4f5;
  border-radius: 50%;
}
.excellent {
  background: #23cd6c;
}
.qualified {
  background: #eb982c;
}
.contaminated {
  background: #eb3c2c;
}
.excellent_img {
  background: url("../../static/img/youzhi.png") no-repeat center center/100%
    100%;
}
.qualified_img {
  background: url("../../static/img/hege.png") no-repeat center center/100% 100%;
}
.contaminated_img {
  background: url("../../static/img/weixian.png") no-repeat center center/100%
    100%;
}
.stop_class {
  background: url("../../static/img/stop_icon.png") no-repeat center center/100%
    100%;
}
.right_wrapper li .item_top .name,
.bottom_monitor li .item_top .name {
  margin: 0 0 0 0.06rem;
  width: 1rem /* 120/100 */;
  font-size: 0.14rem /* 14/100 */;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #f4f4f5;
}
.right_wrapper li .item_top .time,
.bottom_monitor li .item_top .time {
  font-size: 0.1rem /* 10/100 */;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #9c9cbc;
}
.right_wrapper li .item_center,
.bottom_monitor li .item_center {
  display: flex;
  align-items: center;
  padding: 0 0.12rem /* 12/100 */;
  height: 0.79rem /* 79/100 */;
}
/deep/ .right_wrapper li .item_center .largeBall {
  margin: 0;
  width: 0.6rem /* 60/100 */;
  height: 0.6rem /* 60/100 */;
}
/deep/ .bottom_monitor li .item_center .largeBall {
  margin: 0;
  width: 0.6rem /* 60/100 */;
  height: 0.6rem /* 60/100 */;
}
/deep/ .right_wrapper li .item_center .ball-content {
  width: 0.45rem /* 45/100 */;
  height: 0.45rem /* 45/100 */;
}
/deep/ .bottom_monitor li .item_center .ball-content {
  width: 0.45rem /* 45/100 */;
  height: 0.45rem /* 45/100 */;
}
/deep/ .right_wrapper .ball-bg .status-text {
  display: none;
}
/deep/ .bottom_monitor li .item_center .status-text {
  display: none;
}
.right_wrapper li .temperature .du,
.bottom_monitor li .temperature .du {
  margin-bottom: 0.05rem /* 5/100 */;
  font-size: 0.2rem /* 20/100 */;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #f4f4f5;
}
.right_wrapper li .temperature .text,
.bottom_monitor li .temperature .text {
  font-size: 0.12rem /* 12/100 */;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #9c9cbc;
}
.right_wrapper li .bottom_wrapper,
.bottom_monitor li .bottom_wrapper {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  padding: 0.1rem;
}
.right_wrapper li .bottom_wrapper p,
.bottom_monitor li .bottom_wrapper p {
  height: 0.17rem /* 17/100 */;
  font-size: 0.12rem /* 12/100 */;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #f4f4f5;
  line-height: 0.17rem /* 17/100 */;
}
.right_wrapper li .bottom_wrapper p span,
.bottom_monitor li .bottom_wrapper p span {
  display: inline-block;
  margin-right: 0.1rem /* 10/100 */;
  width: 0.06rem /* 6/100 */;
  height: 0.06rem /* 6/100 */;
  border-radius: 50%;
  vertical-align: middle;
}
.bottom_monitor {
  padding: 0 0.35rem;
}
.active_img_height {
  height: 3.72rem /* 372/100 */ !important;
}
</style>