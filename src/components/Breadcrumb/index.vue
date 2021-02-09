<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <div class="go-back" @click="$router.go(-1)" v-if="levelList.length>2">
      <i class="icon icon-page-go-back"></i>
    </div>
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      // const first = matched[0]
      // if (!this.isDashboard(first)) {
      //   // matched = [{ path: '/dashboard', meta: { title: 'Dashboard' }}].concat(matched)
      //   matched = matched.slice(-1);
      // }
      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 16px;
  line-height: 50px;
  margin-left: 8px;
  /deep/.el-breadcrumb__item{
      .el-breadcrumb__inner{
        font-weight: 600 !important;
        >span{
          color: #888;
        }
        >a{
          color: #888;
        }
      }
    &:nth-last-of-type(1){
      .el-breadcrumb__inner{
        >span{
          color: #222;
        }
        >a{
          color: #222;
        }
      }
    }
  }
}

.go-back{
  height:100%;
  float:left;
  line-height:46px;
  padding-right:10px;
  cursor: pointer;
}
</style>
