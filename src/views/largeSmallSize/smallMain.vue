<template>
  <div class="main_center" @click="showSelect = false" v-if="selectOptions.length != 0">
    <div class="center_title" @click.stop="showSelect = !showSelect">
      <p>{{ porjectList.name }}</p>
      <img v-if="showSelect == false" src="../../static/img/down.png" />
      <img v-else src="../../static/img/up.png" />
    </div>
    <transition name="fade">
      <ul class="select_wrapper" v-show="showSelect">
        <li
          v-for="(item, index) in selectOptions"
          :key="index"
          @click.stop="activePorject(item)"
        >{{ item.name }}</li>
      </ul>
    </transition>
    <ul
      class="message_wrapper"
      :class="
          positionList.length >= 5 && positionList.length <= 10
            ? 'active_height'
            : ''
        "
    >
      <li v-for="(item, index) in positionList" :key="index" @click="handleClickItem(item,index)">
        <p class="title">{{ item.area_name }}</p>
        <largeBall :tag="item.tag" />
      </li>
    </ul>
  </div>
</template>

<script>
import largeBall from "@/components/Public/largeBall";
import request from "@/utils/request";
export default {
  name: "smallMain",
  components: {
    largeBall,
  },
  data() {
    return {
      showSelect: false,
      selectOptions: [],
      userInfo: {},
      porjectList: {},
      projectId: "",
      positionList: [],
    };
  },
  methods: {
    // 点击item
    handleClickItem(item, index) {
      if (this.userInfo.template_id == 2) {
        this.$router.push({
          name: "smallMonitor",
          query: {
            id: item.project_id,
            index: index,
          },
        });
      } else {
        this.$router.push({
          name: "smallMonitorDetails",
          query: {
            id: item.project_id,
            index: index,
          },
        });
      }
    },
    // 获取所有 项目列表
    getSelectOptions() {
      request(this.ajaxUrl.largeIndexProject, {}, "get").then((res) => {
        this.selectOptions = res;
        const hasDefaultProject = res.filter(
          (item) => item.id === this.userInfo.show_project_id
        );
        if (hasDefaultProject.length != 0) {
          this.porjectList = hasDefaultProject[0];
          this.projectId = hasDefaultProject[0].id;
        } else {
          this.porjectList = res[0];
          this.projectId = res[0].id;
        }
        this.getPositionList();
      });
    },
    // 获取该项目下的监测点列表
    getPositionList() {
      request(
        this.ajaxUrl.largeIndexArea,
        {
          project_id: this.projectId,
        },
        "get"
      ).then((res) => {
        this.positionList = res.areas;
      });
    },
    // 点击下拉菜单
    activePorject(item) {
      this.showSelect = false;
      this.porjectList = item;
      this.projectId = item.id;
      this.getPositionList();
    },
  },
  created() {
    this.userInfo = this.$store.getters.admin_detail;
    this.getSelectOptions(); //获取可选项目列表
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
.main_center {
  position: relative;
}
.center_title {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: -0.2rem /* 20/100 */;
  margin-bottom: 0.33rem /* 33/100 */;
  margin-left: 0.93rem /* 93/100 */;
  width: 2.9rem /* 290/100 */;
  height: 0.5rem /* 50/100 */;
  background: url("../../static/img/small_left_title.png") no-repeat center
    center/100% 100%;
}
.center_title p {
  margin: 0 0.08rem 0 0.18rem;
  font-size: 0.22rem /* 22/100 */;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #f4f4f5;
}
.center_title img {
  width: 0.16rem /* 16/100 */;
  height: 0.16rem /* 16/100 */;
}
.message_wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  min-height: 5.67rem /* 567/100 */;
}
.message_wrapper li {
  position: relative;
  margin: 0 0.18rem 0.25rem 0;
  width: 2.16rem /* 216/100 */;
  height: 1.72rem /* 172/100 */;
  border: 2px solid rgba(136, 132, 250, 0.21); /* no */
  background: url("../../static/img/small_top_title.png") no-repeat center
    center/100% 100%;
}
.message_wrapper li:nth-child(5n) {
  margin-right: 0;
}
.message_wrapper .title {
  margin-top: 0.05rem /* 5/100 */;
  margin-bottom: 0.22rem /* 22/100 */;
  width: 100%;
  height: 0.33rem /* 33/100 */;
  font-size: 0.16rem /* 16/100 */;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #f4f4f5;
  line-height: 0.33rem /* 33/100 */;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/ .message_wrapper li .largeBall {
  width: 0.97rem /* 97/100 */;
  height: 0.97rem /* 97/100 */;
}
/deep/ .message_wrapper li .ball-content {
  width: 0.82rem /* 82/100 */;
  height: 0.82rem /* 82/100 */;
}
/deep/.message_wrapper li .largeBall .ball-bg .status-text {
  font-size: 0.2rem /* 20/100 */;
}
.select_wrapper {
  position: absolute;
  top: 0.56rem /* 56/100 */;
  left: 0.93rem /* 93/100 */;
  padding: 0.12rem 0;
  width: 2.9rem /* 290/100 */;
  max-height: 5.5rem /* 550/100 */;
  border: 1px solid rgba(80, 79, 190, 0.44); /* no */
  background: #04053e;
  overflow-y: scroll;
  box-sizing: border-box;
  z-index: 99;
}
.select_wrapper li {
  padding-left: 0.2rem /* 20/100 */;
  width: 100%;
  height: 0.48rem /* 48/100 */;
  font-size: 16px; /* px */
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #f4f4f5;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 0.48rem /* 48/100 */;
}
.select_wrapper li:hover {
  background: #312b88;
  color: #bfbfff;
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
.activeTop {
  margin-top: 1rem /* 100/100 */;
}
.active_height {
  padding-top: 1rem /* 100/100 */ !important;
  height: auto !important;
}
</style>