<template>
  <div id="app" class="theme-1">
    <router-view v-if="isReloadAlive" />
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload,
    };
  },

  data() {
    return {
      isReloadAlive: true,
    };
  },
  created() {
    setInterval(() => {
      let oldToken = sessionStorage.getItem("token");
      if (sessionStorage.getItem("token")) {
        request(this.ajaxUrl.updateToken, {}, "PUT")
          .then((res) => {
            console.log("刷新token", res);
            sessionStorage.setItem("updateToken", "true");
            sessionStorage.setItem("token", res.access_token);
          })
          .catch((err) => {
            console.log("刷新token错误", err);
          });
      } else {
        console.log("不更新token");
      }
    }, 1000000);
  },
  methods: {
    reload() {
      this.isReloadAlive = false;
      this.$nextTick(function () {
        this.isReloadAlive = true;
      });
    },
  },
};
</script>
<style lang="scss">
</style>


