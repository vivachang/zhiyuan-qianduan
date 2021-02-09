<template>
  <div class="inquire mainPage">
    <template v-if="showParent">
      <div class="tableContent">
        <div class="project-search">
          <div class="filterBox">
            <div class="filterItem">
              <span>项目名称</span>
              <!-- <el-input clearable v-model="searchInfo.projectName" size="small" placeholder="请输入项目名称"></el-input> -->
              <el-select
                v-model="searchInfo.project_name"
                size="small"
                clearable
                filterable
                placeholder="请输入项目名称"
              >
                <el-option
                  v-for="item in projectList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </div>
            <div class="filterItem">
              <span>监测点名称</span>
              <el-input
                clearable
                v-model="searchInfo.position_name"
                size="small"
                placeholder="请输入监测点名称"
              ></el-input>
            </div>
            <br />
            <div class="filterItem">
              <span>设备ID</span>
              <el-input
                clearable
                v-model="searchInfo.device_number"
                size="small"
                placeholder="请输入设备ID"
              ></el-input>
            </div>
            <div class="filterItem relative">
              <span>设备电量</span>
              <el-input
                maxlength="3"
                class="relative-input"
                clearable
                v-model="searchInfo.soc"
                size="small"
              ></el-input>
              <span class="absolute" style="display:inline;margin-left:5px;">以下</span>
            </div>
            <br />
            <div class="filterItem">
              <span></span>
              <el-button type="primary" class="minWidth" size="small" @click="handleSearch">查询</el-button>
              <el-button type="text" size="small" @click="resetSearch">重置查询条件</el-button>
            </div>
          </div>
        </div>
        <el-table v-loading="dataLoading" :data="tableData" border style="width: 100%">
          <el-table-column prop="number" label="监测点ID" width="180"></el-table-column>
          <el-table-column prop="name" label="监测点名称" width="180"></el-table-column>
          <el-table-column prop="project" label="项目名称">
            <template slot-scope="scope">{{scope.row.project.name}}</template>
          </el-table-column>
          <el-table-column label="所处区域">
            <template slot-scope="scope">{{scope.row.area && scope.row.area.area_name}}</template>
          </el-table-column>
          <el-table-column align="left" width="180" label="监测点状态">
            <template slot-scope="scope">
              <template v-if="scope.row.device">
                <span v-if="scope.row.status===1" class="text-dot color1">使用中</span>
                <span v-if="scope.row.status===2" class="text-dot color3">已停止</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="设备ID">
            <template slot-scope="scope">{{scope.row.device && scope.row.device.device_number}}</template>
          </el-table-column>
          <el-table-column align="left" label="设备电量" width="120">
            <template slot-scope="scope">
              <div class="device-soc" v-if="scope.row.device">
                <span
                  v-if="scope.row.status==1"
                  :class="scope.row.device.soc&&scope.row.device.soc<=20 ? 'warning' : ''"
                >{{scope.row.device.soc ? scope.row.device.soc + '%' : ''}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="left" label="信号强度" width="120">
            <template slot-scope="scope">
              <div class="device-soc" v-if="scope.row.device">
                <span>{{scope.row.device.rssi || ''}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="left" label="在线/离线 " width="120">
            <template slot-scope="scope">
              <div class="device-soc">
                <span>{{scope.row.device.state == 1 ? '在线' : '离线'}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="left" width="120" label="空气质量">
            <template slot-scope="scope">
              <span v-if="scope.row.tag===1" class="text-dot color1">优秀</span>
              <span v-if="scope.row.tag===2" class="text-dot color2">合格</span>
              <span v-if="scope.row.tag===3" class="text-dot color3">污染</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-btnRole="31"
                size="mini"
                @click="handleToDetail(scope.row)"
              >查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <myPagination :pageInfo="pageInfo" @current-change="pageChange" />
      </div>
    </template>
    <router-view></router-view>
  </div>
</template>
<script>
import myPagination from "@/components/Public/myPagination";
import request from "@/utils/request";
export default {
  name: "inquire",
  data() {
    return {
      showParent: false,
      searchInfo: {
        project_name: "",
        position_name: "",
        device_number: "",
        soc: "",
      },
      dataLoading: false,
      projectList: [],
      tableData: [],
      pageInfo: {
        total: 50,
        pageSize: 5,
        currentPage: 1,
      },
      pageInfo: {
        total: 0,
        pageSize: 20,
        currentPage: 1,
      },
    };
  },
  mounted() {
    if (this.$route.name === "inquire") {
      //展示父组件列表
      this.showParent = true;
      this.getPositionsList();
      this.getProjectList();
    } else {
      //展示子组件路由
      this.showParent = false;
    }
  },
  methods: {
    resetSearch() {
      this.searchInfo = {
        project_name: "",
        position_name: "",
        device_number: "",
        soc: "",
      };
    },
    // 获取项目列表
    getProjectList() {
      request(
        this.ajaxUrl.projectsList,
        {
          include: "customs",
          pageSize: 999999,
          page: 1,
        },
        "get"
      )
        .then((res) => {
          this.projectList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getPositionsList() {
      this.dataLoading = true;
      request(
        this.ajaxUrl.positionsList,
        {
          project_name: this.searchInfo.project_name,
          position_name: this.searchInfo.position_name,
          device_number: this.searchInfo.device_number,
          soc: this.searchInfo.soc,
          page: this.pageInfo.currentPage,
          pageSize: this.pageInfo.pageSize,
        },
        "get"
      )
        .then((res) => {
          this.tableData = res.data;
          this.pageInfo.total = res.total;
          this.dataLoading = false;
        })
        .catch((err) => {
          this.dataLoading = false;
          console.log(err);
        });
    },
    handleSearch() {
      this.pageInfo.currentPage = 1;
      this.getPositionsList();
    },
    // 查看详情
    handleToDetail(detail) {
      this.$router.push({
        name: "inquireDetail",
        params: { id: detail.id },
        query: { name: detail.project.name },
      });
    },
    // 翻页
    pageChange(val) {
      this.pageInfo.currentPage = val;
      this.getPositionsList();
    },
  },
  components: {
    myPagination,
  },
};
</script>
<style rel="stylesheet/scss" lang="scss">
.inquire {
  .tableContent {
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
    .color1 {
      color: #29cc85;
      &::before {
        background-color: #29cc85;
      }
    }
    .color2 {
      color: #ffc13a;
      &::before {
        background-color: #ffc13a;
      }
    }
    .color3 {
      color: #fe4f5d;
      &::before {
        background-color: #fe4f5d;
      }
    }
    .relative {
      position: relative;
      .relative-input {
        .el-input__suffix {
          right: 50px !important;
        }
      }
    }
    .absolute {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      min-width: auto !important;
    }
  }
  .device-soc {
    text-align: left;
    .warning {
      color: red;
    }
  }
}
</style>