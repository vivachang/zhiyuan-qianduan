<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <div class="header-fixed" v-show="!$route.meta.hideNav">
      <div class="logo-box">
        <img
          :src="
            (userInfo.customer &&
              userInfo.customer.logos &&
              userInfo.customer.logos.path) ||
            imgConfig.logo
          "
          alt
        />
        <span>健康空气管理系统</span>
      </div>
      <div class="operation-box">
        <div class="user">
          <el-popover placement="top" width="120" v-model="visible">
            <ul class="operation-list">
              <li @click="handleChangeAvatar">修改头像</li>
              <li @click="handleResizePassword">重置密码</li>
              <li @click="handleShowManager">显示管理</li>
              <!-- <li @click="handleChangeStyle">主题色</li> -->
            </ul>
            <div class="user-info" slot="reference">
              <img
                class="user-img"
                v-if="userInfo.img"
                :src="userInfo.img.path || imgConfig.defaultImg"
                alt
              />
              <img
                class="user-img"
                v-else
                :src="
                  (userInfo.customer &&
                    userInfo.customer.logos &&
                    userInfo.customer.logos.path) ||
                  imgConfig.defaultImg
                "
                alt
              />
              <span class="user-name">{{ userInfo.name }}</span>
            </div>
          </el-popover>
        </div>
        <!-- 消息 -->
        <div class="message" @click="$router.push({ name: 'msgCenter' })">
          <el-badge :value="noReadCount" :hidden="noReadCount <= 0" :max="99" class="item">
            <i class="icon icon-message"></i>
          </el-badge>
        </div>
        <!-- 设置 -->
        <!-- <div class="to-large">
			<i class="icon icon-large-size"></i>
        </div>-->
        <!-- 退出登录 -->
        <div class="logout" @click="handleLogout">
          <i class="icon icon-logout"></i>
        </div>
      </div>
    </div>
    <sidebar class="sidebar-container" v-show="!$route.meta.hideNav" />
    <div class="main-container" :class="{ full: $route.meta.hideNav }">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
      </div>
      <!-- <tags-view /> -->
      <app-main />
    </div>
    <!-- 修改头像弹框 -->
    <el-dialog
      title="修改头像"
      :visible.sync="dialogAvatar"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      width="420px"
    >
      <span>头像图片</span>
      <div class="new-avatar">
        <uploadImg
          :idx="1"
          :imgUrl="newAvatar"
          @afterUpload="afterUpload"
          @afterRemove="afterRemove"
        />
      </div>
      <div class="avatar-hint">
        <p>仅支持jpg,png</p>
        <p>图像大小不超过500kb</p>
      </div>
      <div class="dialog-btn">
        <el-button size="small" @click="dialogAvatar = false">取消</el-button>
        <el-button size="small" type="primary" @click="handleEditAvatar">确定</el-button>
      </div>
    </el-dialog>
    <!-- 修改密码弹框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogPassword"
      :close-on-click-modal="false"
      width="420px"
    >
      <div class="password-box">
        <div class="password-item">
          <span>输入旧密码</span>
          <el-input size="small" placeholder="请输入" show-password v-model.trim="password.old"></el-input>
        </div>
        <div class="password-item">
          <span>输入新密码</span>
          <el-input size="small" placeholder="请输入" show-password v-model.trim="password.newFirst"></el-input>
        </div>
        <div class="password-item">
          <span>再次确认新密码</span>
          <el-input size="small" placeholder="请输入" show-password v-model.trim="password.newSecond"></el-input>
        </div>
      </div>
      <div class="dialog-btn">
        <el-button size="small" @click="dialogPassword = false">取消</el-button>
        <el-button size="small" type="primary" @click="handleChangePassword">确定</el-button>
      </div>
    </el-dialog>
    <!-- 显示设置弹框 -->
    <el-dialog
      title="显示设置"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancel"
      width="450px"
    >
      <div class="input-box">
        <div class="input-item">
          <span>默认显示项目</span>
          <!-- <el-input size="small" placeholder="请输入" v-model="showManager.showProject"></el-input> -->
          <el-select
            size="small"
            @change="getAreasList"
            v-model="largeShowProject.project"
            placeholder="请选择默认显示项目"
          >
            <el-option
              v-for="item in allProjectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="input-item">
          <span>默认显示区域</span>
          <el-select
            size="small"
            @change="getPosition"
            v-model="largeShowProject.area"
            placeholder="请选择默认显示区域"
          >
            <el-option
              v-for="item in areasList"
              :key="item.id"
              :label="item.area_name"
              :value="item.id"
            ></el-option>
          </el-select>
          <!-- <el-input size="small" placeholder="请输入" v-model="showManager.showProject"></el-input> -->
        </div>
        <div class="input-item">
          <span>默认监测点&nbsp;&nbsp;&nbsp;</span>
          <el-select
            size="small"
            v-model="largeShowProject.show_position_id"
            placeholder="请选择默认监测点"
          >
            <el-option
              v-for="item in positionList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <!-- <el-input size="small" placeholder="请输入" v-model="showManager.showProject"></el-input> -->
        </div>
        <div style="color: #606266;font-size: 14px;margin-bottom:10px;">数据屏样式</div>
        <ul class="template_wrapper">
          <li v-if="userInfo.customer == null  || userInfo.customer.template_ids.includes(1)">
            <img
              src="../assets/images/first_template.png"
              class="template_img"
              style="margin-bottom: 5px;"
              @click="showBigImg(1)"
            />
            <el-radio v-model="largeShowProject.templateRadio" label="1">模板一</el-radio>
          </li>
          <li v-if="userInfo.customer == null  || userInfo.customer.template_ids.includes(2)">
            <img
              src="../assets/images/second_template.png"
              class="template_img"
              style="margin:0 10px 5px 10px;"
              @click="showBigImg(2)"
            />
            <el-radio
              v-model="largeShowProject.templateRadio"
              label="2"
              style="margin-left: 10px;"
            >模板二</el-radio>
          </li>
          <li v-if="userInfo.customer == null  || userInfo.customer.template_ids.includes(3)">
            <img
              src="../assets/images/second_template.png"
              class="template_img"
              style="margin-bottom: 5px;"
              @click="showBigImg(3)"
            />
            <el-radio v-model="largeShowProject.templateRadio" label="3">模板三</el-radio>
          </li>
        </ul>
      </div>
      <div class="dialog-btn">
        <el-button size="small" @click="cancel">取消</el-button>
        <el-button size="small" type="primary" @click="handleSureShow">确定</el-button>
      </div>
    </el-dialog>
    <!-- 修改主题色弹框 -->
    <el-dialog
      title="修改主题色"
      :visible.sync="dialogStyle"
      :close-on-click-modal="false"
      width="420px"
    >
      <div class="style-box">
        <span>主题色</span>
        <ul class="style-list">
          <li :class="{ on: activeTheme === 'theme-1' }" @click="themeClick('theme-1')">
            <img src="@/static/img/theme-1.png" alt />
          </li>
          <li :class="{ on: activeTheme === 'theme-2' }" @click="themeClick('theme-2')">
            <img src="@/static/img/theme-2.png" alt />
          </li>
          <li :class="{ on: activeTheme === 'theme-3' }" @click="themeClick('theme-3')">
            <img src="@/static/img/theme-3.png" alt />
          </li>
          <li :class="{ on: activeTheme === 'theme-4' }" @click="themeClick('theme-4')">
            <img src="@/static/img/theme-4.png" alt />
          </li>
        </ul>
      </div>
      <div class="dialog-btn">
        <el-button size="small" @click="dialogStyle = false">取消</el-button>
        <el-button size="small" type="primary" @click="handleSureTheme">确定</el-button>
      </div>
    </el-dialog>

    <!-- 模板图片1 -->
    <el-dialog title="数据屏模板图片" :visible.sync="dialogFirst">
      <img src="../assets/images/first_template.png" class="big_img" />
    </el-dialog>
    <!-- 模板图片2/3 -->
    <el-dialog title="数据屏模板图片" :visible.sync="dialogSecond">
      <img src="../assets/images/second_template.png" class="big_img" />
    </el-dialog>
  </div>
</template>

<script>
// import { Navbar, Sidebar, AppMain ,TagsView} from './components'
import { Navbar, Sidebar, AppMain } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import uploadImg from "@/components/Public/uploadImg";
import request from "@/utils/request";
import store from "@/store";

import defaultLogo from "@/static/img/logo.png";
import defaultImg from "@/static/img/default-img.png";
export default {
  name: "Layout",
  inject: ["reload"],
  data() {
    return {
      imgConfig: {
        logo: defaultLogo,
        defaultImg: defaultImg,
      },
      dialogFirst: false,
      dialogSecond: false,
      visible: false,
      dialogAvatar: false,
      dialogPassword: false,
      dialogShow: false,
      dialogStyle: false,
      newAvatar: "",
      password: {
        old: "",
        newFirst: "",
        newSecond: "",
      },
      showManager: {
        showProject: "",
        showPlace: "",
      },
      userInfo: {},
      activeTheme: "theme-1",
      noReadCount: 0,
      allProjectList: [],
      areasList: [],
      positionList: [],
      largeShowProject: {
        project: "",
        area: "",
        show_position_id: "",
        templateRadio: "",
      },
      avatarId: "",
    };
  },
  components: {
    uploadImg,
    Navbar,
    Sidebar,
    // TagsView,
    AppMain,
  },
  mixins: [ResizeMixin],
  mounted() {
    this.activeTheme = localStorage.getItem("theme") || "theme-1";
    this.userInfo = this.$store.getters.admin_detail;
    console.log(this.userInfo);
    document.getElementById("app").className = this.activeTheme;
    this.getNoreadNum();
    if (this.userInfo.show_project_id) {
      this.largeShowProject = {
        project: this.userInfo.show_project_id,
        area: this.userInfo.show_area_id,
        show_position_id: this.userInfo.show_position_id,
        templateRadio: this.userInfo.template_id.toString(),
      };
      this.getAreasList(this.largeShowProject.project);
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    fixedHeader() {
      //   return this.$store.state.settings.fixedHeader
      return true;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
  },
  methods: {
    // 查看大图
    showBigImg(num) {
      if (num == 1) {
        this.dialogFirst = true;
      } else {
        this.dialogSecond = true;
      }
    },
    // 获取所有项目列表
    getProjectList() {
      request(this.ajaxUrl.largeIndexProject, {}, "get")
        .then((res) => {
          this.allProjectList = res;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取该项目区域列表
    getAreasList(project_id) {
      if (
        this.userInfo.show_project_id &&
        this.userInfo.show_project_id != this.largeShowProject.project
      ) {
        this.largeShowProject.area = "";
        this.largeShowProject.show_position_id = "";
      }
      request(
        this.ajaxUrl.largeIndexArea,
        {
          project_id: this.largeShowProject.project,
        },
        "get"
      )
        .then((res) => {
          this.areasList = res.areas || [];
          if (this.largeShowProject.area) {
            this.getPosition(this.largeShowProject.area);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 默认监测点
    getPosition(area) {
      if (
        this.userInfo.show_area_id &&
        this.userInfo.show_area_id != this.largeShowProject.area
      ) {
        this.largeShowProject.show_position_id = "";
      }
      this.areasList.forEach((item) => {
        if (area == item.id) {
          this.positionList = item.position;
        }
      });
    },
    //   获取未读消息条数
    getNoreadNum() {
      request(this.ajaxUrl.noReadCount, {}, "get")
        .then((res) => {
          this.noReadCount = res.noread;
          setTimeout(() => {
            this.getNoreadNum();
          }, 30000);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //   退出登录
    handleLogout() {
      request(this.ajaxUrl.logOut, {}, "DELETE")
        .then((res) => {
          sessionStorage.clear();
          this.$router.push({ name: "login" });
        })
        .catch((err) => {
          sessionStorage.clear();
          this.$router.push({ name: "login" });
        });
    },
    // 选择风格
    themeClick(theme) {
      this.activeTheme = theme;
    },
    // 确定选择风格
    handleSureTheme() {
      document.getElementById("app").className = this.activeTheme;
      this.dialogStyle = false;
      localStorage.setItem("theme", this.activeTheme);
    },
    afterUpload(res, idx) {
      //头像上传完成后
      this.avatarId = res.id;
    },
    afterRemove(idx) {
      //移除已上传的头像
    },
    // 修改头像
    handleChangeAvatar() {
      this.dialogAvatar = true;
      this.visible = false;
      this.newAvatar = this.userInfo.img && this.userInfo.img.path;
    },
    handleEditAvatar() {
      let userId = this.$store.getters.admin_detail.id;
      request(
        this.ajaxUrl.editUsers + userId,
        {
          img: this.avatarId,
        },
        "patch"
      )
        .then(async (res) => {
          const userInfo = await store.dispatch("user/getInfo"); //更新用户信息
          this.userInfo = userInfo;
          this.$message.success("修改成功");
          this.dialogAvatar = false;
        })
        .catch((err) => {});
    },
    // 重置密码
    handleResizePassword() {
      this.dialogPassword = true;
      this.visible = false;
    },
    // 确定修改密码
    handleChangePassword() {
      if (this.password.old == "") {
        this.$message.warning("请输入旧密码");
        return;
      }
      if (this.password.newFirst == "" || this.password.newSecond == "") {
        this.$message.warning("请输入新密码");
        return;
      }
      if (this.password.newFirst !== this.password.newSecond) {
        this.$message.warning("两次输入的新密码不一致");
        return;
      }
      request(
        this.ajaxUrl.checkPassword,
        {
          password: this.password.old,
        },
        "get"
      )
        .then((res) => {
          let userId = this.$store.getters.admin_detail.id;
          request(
            this.ajaxUrl.editUsers + userId,
            {
              password: this.password.newFirst,
            },
            "patch"
          )
            .then((res) => {
              this.$message.success("密码重置成功");
              this.dialogPassword = false;
              this.password = {
                old: "",
                newFirst: "",
                newSecond: "",
              };
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 显示管理
    handleShowManager() {
      this.getProjectList();
      this.dialogShow = true;
      this.visible = false;
    },
    // 设置大屏默认展示项目及区域
    handleSureShow() {
      let userId = this.$store.getters.admin_detail.id;
      request(
        this.ajaxUrl.editUsers + userId,
        {
          show_project_id: this.largeShowProject.project,
          show_area_id: this.largeShowProject.area,
          show_position_id: this.largeShowProject.show_position_id,
          template_id: this.largeShowProject.templateRadio,
        },
        "patch"
      )
        .then(async (res) => {
          this.$message.success("设置成功");
          this.dialogShow = false;
          const userInfo = await store.dispatch("user/getInfo"); //更新用户信息
          this.userInfo = userInfo;
          this.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    cancel() {
      this.dialogShow = false;
      if (this.userInfo.show_project_id) {
        this.largeShowProject = {
          project: this.userInfo.show_project_id,
          area: this.userInfo.show_area_id,
          show_position_id: this.userInfo.show_position_id,
        };
        this.getAreasList(this.largeShowProject.project);
      }
    },
    // 修改主题
    handleChangeStyle() {
      this.dialogStyle = true;
      this.visible = false;
    },
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
  },
  watch: {
    "$store.getters.admin_detail": function (newVal, oldVal) {
      this.userInfo = newVal;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";
.main-container {
  padding-top: 50px;
}
.operation-box {
  .user {
    .user-info {
      position: relative;
    }
  }
}
.password-box {
  .password-item {
    margin-top: 20px;
    > span {
      display: inline-block;
      margin-bottom: 10px;
    }
  }
}
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 60px;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
.new-avatar {
  display: inline-block;
  width: 60px;
  height: 60px;
  border: 1px dashed #ddd;
  line-height: 60px;
  margin-left: 40px;
  vertical-align: middle;
}
.avatar-hint {
  display: inline-block;
  color: #9b9b9b;
  vertical-align: middle;
  margin-left: 12px;
  p {
    &:nth-of-type(1) {
      margin-bottom: 5px;
    }
  }
}
.input-box {
  .input-item {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    margin-bottom: 20px;
    > span {
      display: inline-block;
      white-space: nowrap;
      margin-right: 20px;
    }
  }
}
.style-box {
  display: flex;
  align-items: center;
  > span {
    color: #9c9c9c;
    margin-right: 20px;
  }
  .style-list {
    display: inline-flex;
    flex-wrap: nowrap;
    li {
      width: 68px;
      height: 56px;
      box-sizing: border-box;
      padding: 3px;
      border: 1px solid transparent;
      border-radius: 8px;
      margin-right: 10px;
      cursor: pointer;
      > img {
        width: 100%;
        height: 100%;
      }
      &.on {
        border-color: #5a66ff;
      }
    }
  }
}
.dialog-btn {
  text-align: center;
  margin-top: 30px;
}
.logo-box {
  line-height: 60px;
}
.template_wrapper {
  display: flex;
}
.template_wrapper .template_img {
  display: block;
  width: 130px;
  height: 70px;
}
.big_img {
  display: block;
  width: 6.6rem;
  height: 500px;
}
</style>
