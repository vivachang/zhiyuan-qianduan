<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <el-button type="primary" class="to-largesize" @click="handleToLarge">
      <i class="icon icon-to-largesize"></i>
      <span>切换全屏</span>
    </el-button>
    <!-- <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="userImg" class="user-avatar"
          v-if="userImg">
          <div class="name-box">
            <span class="user-name">{{username}}</span>
            <i class="el-icon-caret-bottom" />
          </div>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown" style="overflow: visible">
          <el-dropdown-item>
            <span style="display:block;" @click="logout">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { fullScreen } from "@/utils/tool.js";

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  data() {
    return {
      username: sessionStorage.getItem("username"),
      userImg: sessionStorage.getItem("admin_detail")
        ? JSON.parse(sessionStorage.getItem("admin_detail")).img
        : "",
      userInfo: {},
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
  },
  created() {
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
        )
      );
    }
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });
    this.userInfo = this.$store.getters.admin_detail;
  },
  methods: {
    //   跳转大屏
    handleToLarge() {
      fullScreen();
      if (this.userInfo.template_id == 1 || this.userInfo.template_id == null) {
        setTimeout(() => {
          this.$router.push({ name: "largeIndex" });
        }, 300);
      } else {
        setTimeout(() => {
          this.$router.push({ name: "largeSmallSizeIndex" });
        }, 300);
      }
    },
    handleToSmallLarge() {
      fullScreen();
      setTimeout(() => {
        this.$router.push({ name: "largeSmallSizeIndex" });
      }, 300);
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      console.log("退出登录 或者修改密码");
      //   await this.$store.dispatch('user/logout')
      //   this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }
  .to-largesize {
    height: 32px;
    padding: 0 10px;
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    > span {
      vertical-align: middle;
    }
    > i {
      vertical-align: middle;
    }
    &:hover {
      background-color: #5a66ff;
      border-color: #5a66ff;
    }
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        line-height: 100%;
        vertical-align: middle;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .name-box {
          cursor: pointer;
          display: inline-block;
          position: relative;
          bottom: 14px;
          .user-name {
            position: relative;
          }
        }
        .el-icon-caret-bottom {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
