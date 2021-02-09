<template>
  <div>
    <div class="center_title">
      <p v-if="receiveItem.areas">{{ receiveItem.areas[queryIndex].area_name }}</p>
    </div>
    <div style="display: flex">
      <div class="lside_img"></div>
      <div class="swiper_wrapper">
        <img
          src="../../static/img/lside_icon.png"
          class="active_icon"
          style="margin-right: 0.4rem"
          @click.stop="handleClickLeftArrow"
        />
        <div class="swiper">
          <div class="block">
            <el-carousel arrow="never" :interval="10000" @change="swiperChange" ref="carousel">
              <el-carousel-item
                v-for="(item, index) in rightItemArr"
                :key="index"
                class="swiper_item"
              >
                <div class="top_title" v-if="item.position">
                  <p class="name">{{ item.position.name }}</p>
                  <p class="time">{{ item.position.updated_at }}</p>
                </div>
                <div class="item_center">
                  <largeBall :tag="item.position.tag" v-if="item.position" />
                  <div class="temperature" style="margin: 0 0.56rem 0 0.36rem">
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
                <div class="last_wrapper">
                  <div class="clearfix">
                    <p class="fl lside_con">
                      <span class="spot" style="background: #23cd6c"></span>甲醛
                    </p>
                    <p class="fr rside_con">
                      {{
                      item.formaldehyde != ""
                      ? item.formaldehyde
                      : 0
                      }}
                    </p>
                  </div>
                  <div class="clearfix">
                    <p class="fl lside_con">
                      <span class="spot" style="background: #eb3c2c"></span>PM2.5
                    </p>
                    <p class="fr rside_con">
                      {{
                      item.PM25 != ""
                      ? item.PM25
                      : 0
                      }}
                    </p>
                  </div>
                  <div class="clearfix">
                    <p class="fl lside_con">
                      <span class="spot" style="background: #eb982c"></span>TVOC
                    </p>
                    <p class="fr rside_con">
                      {{
                      item.TVOC != ""
                      ? item.TVOC
                      : 0
                      }}
                    </p>
                  </div>
                  <div class="clearfix">
                    <p class="fl lside_con">
                      <span class="spot" style="background: #23cd6c"></span>CO2
                    </p>
                    <p class="fr rside_con">
                      {{
                      item.CO2 != ""
                      ? item.CO2
                      : 0
                      }}
                    </p>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
        <img
          src="../../static/img/rside_icon.png"
          class="active_icon"
          style="margin-left: 0.4rem"
          @click.stop="handleClickRightArrow"
        />
        <div class="dot_wrapper clearfix">
          <p
            v-for="(item, index) in rightItemArr"
            :key="index"
            class="fl"
            :class="{ activeSwiperClass: swiperItemIndex == index }"
          ></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import largeBall from "@/components/Public/largeBall";
import request from "@/utils/request";
export default {
  name: "smallMonitorDetails",
  data() {
    return {
      receiveItem: {},
      swiperItemIndex: 0,
      idList: [],
      rightItemArr: [],
      queryIndex: "",
    };
  },
  components: {
    largeBall,
  },
  created() {
    this.queryIndex = this.$route.query.index;
    this.getPositionList();
  },
  mounted() {},
  computed: {},
  methods: {
    // 上一张
    handleClickLeftArrow() {
      if (this.swiperItemIndex != 0) {
        this.swiperItemIndex--;
        this.$refs.carousel.setActiveItem(this.swiperItemIndex);
        console.log(this.swiperItemIndex);
      }
    },
    // 下一张
    handleClickRightArrow() {
      if (Math.abs(this.swiperItemIndex) != this.rightItemArr.length - 1) {
        this.swiperItemIndex++;
        this.$refs.carousel.setActiveItem(this.swiperItemIndex);
      }
    },
    swiperChange(index) {
      this.swiperItemIndex = index;
    },
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
    async getNewPositionData() {
      await request(
        this.ajaxUrl.getNewSmallPositionDatas,
        {
          monitorIds: this.idList.toString(),
        },
        "get"
      )
        .then((res) => {
          this.rightItemArr = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}

.clearfix {
  zoom: 1;
}

.fl {
  float: left;
}

.fr {
  float: right;
}
.center_title {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 0.17rem /* 17/100 */;
  margin-left: 0.46rem /* 36/100 */;
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
.lside_img {
  margin: -0.1rem 0 0 0.46rem;
  width: 8.6rem /* 860/100 */;
  height: 5.51rem /* 551/100 */;
  background: url("../../static/img/third_bg.png") no-repeat center center/100%
    100%;
}
.swiper_wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: -0.5rem /* 100/100 */;
  margin-left: -1.8rem;
  height: 5.75rem /* 575/100 */;
}
.swiper_wrapper .active_icon {
  width: 0.22rem /* 22/100 */;
  height: 0.78rem /* 78/100 */;
  cursor: pointer;
}
.swiper_wrapper .swiper {
  position: relative;
  width: 4.72rem /* 472/100 */;
  height: 5.75rem /* 575/100 */;
  /* overflow: hidden; */
}
.swiper_wrapper .swiper .block {
  height: 100%;
}
/deep/ .swiper_wrapper .el-carousel__container {
  height: 100%;
}
/deep/ .swiper_wrapper .swiper .el-carousel--horizontal {
  height: 100%;
}
/deep/ .swiper_wrapper .swiper .el-carousel__indicators--horizontal {
  display: none;
}
.swiper_wrapper .block .swiper_item {
  width: 4.72rem /* 472/100 */;
  height: 5.75rem /* 575/100 */;
  background: url("../../static/img/big_bg.png") no-repeat center center/100%
    100%;
}
.swiper_wrapper .dot_wrapper {
  position: absolute;
  bottom: -0.16rem /* 16/100 */;
  left: 0.62rem /* 62/100 */;
  display: flex;
  justify-content: center;
  width: 4.8rem /* 480/100 */;
}
.swiper_wrapper .dot_wrapper p {
  margin-right: 0.06rem /* 6/100 */;
  width: 0.08rem /* 8/100 */;
  height: 0.08rem /* 8/100 */;
  background: #333569;
  border-radius: 0.05rem /* 5/100 */;
}
.activeSwiperClass {
  width: 0.17rem /* 17/100 */ !important;
  height: 0.08rem /* 8/100 */ !important;
  background: #f4f4f5 !important;
  border-radius: 0.05rem /* 5/100 */ !important;
}
.top_title {
  padding: 0.18rem 0 0 0.24rem;
}
.top_title .name {
  margin-bottom: 0.05rem /* 5/100 */;
  font-size: 0.32rem /* 32/100 */;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #f4f4f5;
}
.top_title .time {
  font-size: 0.16rem /* 16/100 */;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #9c9cbc;
}
/deep/.swiper_wrapper .block .largeBall {
  margin: 0;
  width: 1.13rem /* 113/100 */;
  height: 1.13rem /* 113/100 */;
}
/deep/ .swiper_wrapper .block .ball-content {
  width: 1rem /* 100/100 */;
  height: 1rem /* 100/100 */;
}
/deep/ .swiper_wrapper .block .ball-content {
  width: 1rem /* 100/100 */;
  height: 1rem /* 100/100 */;
}
/deep/ .swiper_wrapper .block .ball-bg .status-text {
  display: none;
}
/deep/ .swiper_wrapper .block .status-text {
  display: none;
}
.item_center {
  display: flex;
  margin-top: 0.6rem /* 60/100 */;
  margin-left: 0.24rem /* 24/100 */;
}
.item_center .temperature .du {
  margin-top: 0.2rem /* 20/100 */;
  margin-bottom: 0.1rem /* 10/100 */;
  font-size: 0.36rem /* 36/100 */;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;
}
.item_center .temperature .text {
  font-size: 0.2rem /* 20/100 */;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #9c9cbc;
}
.last_wrapper {
  margin-top: 0.8rem /* 80/100 */;
  padding: 0 0.29rem;
}
.last_wrapper div {
  margin-bottom: 0.27rem /* 27/100 */;
  height: 0.28rem /* 28/100 */;
  line-height: 0.28rem /* 28/100 */;
}
.last_wrapper .lside_con {
  font-size: 0.16rem /* 16/100 */;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #f4f4f5;
}
.last_wrapper .rside_con {
  font-size: 0.2rem /* 20/100 */;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;
}
.last_wrapper div .spot {
  margin-right: 0.17rem /* 17/100 */;
  display: inline-block;
  width: 0.1rem /* 10/100 */;
  height: 0.1rem /* 10/100 */;
  border-radius: 50%;
}
</style>
