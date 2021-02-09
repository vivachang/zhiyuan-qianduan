<template>
  <div class="small_warpper">
    <div class="top_title">
      <div class="back_wrapper" @click="handleClickBack" v-if="showBack">
        <i class="icon icon-go-back"></i>
        <p>返回</p>
      </div>
      <div class="title">健康空气实时监测系统</div>
      <div class="time">{{ time }}</div>
      <div class="right_close" @click="handleClickOut">
        <img src="../../static/img/right_icon.png" />
        <p>退出全屏</p>
      </div>
    </div>
    <div class="main_wrapper">
      <transition name="fade-transform" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { exitFullScreen } from "@/utils/tool.js";
export default {
  name: "largeSmallSizeIndex",
  data() {
    return {
      time: moment().format("YYYY/MM/DD HH:mm:ss"),
      timer: null,
      showBack: false,
    };
  },
  watch: {
    $route: function () {
      if (this.$route.name === "smallMain") {
        this.showBack = false;
      } else {
        this.showBack = true;
      }
    },
  },
  mounted() {
    // fullScreen();
    this.timer = setInterval(() => {
      this.time = moment().format("YYYY/MM/DD HH:mm:ss");
    }, 1000);
  },
  methods: {
    // 返回
    handleClickBack() {
      this.$router.go(-1);
    },
    // 退出全屏
    handleClickOut() {
      exitFullScreen();
      this.$router.push({ name: "Home" });
    },
  },
  destroyed() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped>
.small_warpper {
  width: 100%;
  min-height: 100%;
  background: url("../../static/img/small_bg.png") no-repeat center center/100%
    100%;
}
.top_title {
  position: relative;
  padding-top: 0.16rem /* 16/100 */;
  width: 100%;
  height: 1.11rem;
  background: url("../../static/img/small_header.png") no-repeat center
    center/100% 100%;
  text-align: center;
}
.top_title .title {
  margin-bottom: 0.08rem /* 8/100 */;
  font-size: 30px; /* px */
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #f4f4f5;
}
.top_title .time {
  font-size: 16px; /* px */
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #f4f4f5;
}
.right_close {
  position: absolute;
  top: 0.17rem /* 17/100 */;
  right: 0.42rem /* 42/100 */;
  display: flex;
}
.right_close img {
  margin-right: 0.02rem /* 2/100 */;
  width: 0.18rem /* 18/100 */;
  height: 0.18rem /* 18/100 */;
}
.right_close p {
  font-size: 0.16rem /* 16/100 */;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  cursor: pointer;
}
.main_wrapper {
  width: 100%;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter,
.fade-leave-to {
  transition: all 0.5s;
  opacity: 0;
}
.back_wrapper {
  display: flex;
  align-items: center;
  position: absolute;
  left: 0.5rem /* 50/100 */;
}
.back_wrapper .icon {
  font-size: 0.18rem /* 18/100 */;
}
.back_wrapper p {
  margin-left: 0.05rem /* 5/100 */;
  font-size: 0.2rem /* 20/100 */;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #f4f4f5;
}
</style>