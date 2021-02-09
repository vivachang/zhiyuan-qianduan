<template>
  <div class="equipment mainPage">
    <div class="radio-box">
      <radio-group size="middle" :timeType="activeTimeType" @change="handleChange" />
    </div>

    <div class="equipment-item">
      <ul class="equipment-statics">
        <li>
          <p class="statics-tit">设备总数</p>
          <p class="statics-acount">{{deviceCount.all | formatNum}}</p>
        </li>
        <li>
          <p class="statics-tit">在库设备数</p>
          <p class="statics-acount">{{deviceCount.in_count | formatNum}}</p>
        </li>
        <li>
          <p class="statics-tit">已出库</p>
          <p class="statics-acount">{{deviceCount.out_count | formatNum}}</p>
        </li>
        <li>
          <p class="statics-tit">运行中设备数</p>
          <p class="statics-acount">{{deviceCount.run_count | formatNum}}</p>
        </li>
      </ul>
    </div>
    <div class="equipment-item">
      <div class="filterBox">
        <div class="filterItem">
          <span>设备状态：</span>
          <el-select v-model="searchInfo.status" clearable size="small" placeholder="请选择">
            <!-- <el-option label="未出库" value="1"></el-option>
            <el-option label="已出库" value="2"></el-option>-->
            <el-option label="正常" value="1"></el-option>
            <el-option label="维修" value="2"></el-option>
            <el-option label="损坏" value="3"></el-option>
          </el-select>
        </div>
        <div class="filterItem">
          <span>运行状态：</span>
          <el-select v-model="searchInfo.run_status" clearable size="small" placeholder="请选择">
            <el-option label="在线" value="1"></el-option>
            <el-option label="已离线" value="2"></el-option>
          </el-select>
        </div>
        <div class="filterItem">
          <span>设备所属：</span>
          <el-select v-model="searchInfo.type" clearable size="small" placeholder="请选择">
            <el-option label="客户" value="1"></el-option>
            <el-option label="至源" value="2"></el-option>
          </el-select>
        </div>
        <br />
        <div class="filterItem">
          <span></span>
          <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
          <el-button type="text" size="small" @click="handleReset">重置查询条件</el-button>
        </div>
      </div>
    </div>
    <div class="equipment-item">
      <div class="filterBox">
        <el-button size="small" v-btnRole="24" type="primary" @click="handleCreate">新增设备</el-button>
        <uploadFileBtn btn="批量导入" @afterUpload="afterUpload" :url="ajaxUrl.importDevice" />
        <a :href="'http://47.93.41.147' + '/storage/设备导入模板.xlsx'" download="设备导入模板" v-btnRole="25">
          <el-button size="small">下载导入模板</el-button>
        </a>
        <el-input
          class="keywords fr"
          v-model="device_number"
          size="small"
          placeholder="请输入产品名称或设备id"
        >
          <el-button slot="append" icon="el-icon-search" @click="handlePreciseSearch"></el-button>
        </el-input>
      </div>
      <div class="tableContent">
        <el-table
          :data="tableContent"
          border
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column prop="device_number" label="设备id" width="120"></el-table-column>
          <el-table-column prop="name" label="产品名称">
            <template slot-scope="scope">全能空气检测器</template>
          </el-table-column>
          <el-table-column label="出厂日期" prop="come_date" width="120"></el-table-column>
          <el-table-column width="120" label="设备型号">
            <template slot-scope="scope">{{deviceTypeTxt(scope.row.model)}}</template>
          </el-table-column>
          <el-table-column prop="manufacturer" width="120" label="生产厂家"></el-table-column>
          <el-table-column width="120" label="设备状态">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.status === 1">正常</span>
                <span v-if="scope.row.status === 2">维修</span>
                <span v-if="scope.row.status === 3">损坏</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="设备所有权">
            <template slot-scope="scope">{{scope.row.type===1 ? '客户' : '至源'}}</template>
          </el-table-column>
          <el-table-column label="使用单位">
            <template
              slot-scope="scope"
            >{{scope.row.customer[0] && scope.row.customer[0].company_name}}</template>
          </el-table-column>
          <el-table-column label="所在仓库">
            <template slot-scope="scope">
              <span
                v-if="scope.row.store_status===1"
              >在库（{{scope.row.storehouse[0] && scope.row.storehouse[0].name}}）</span>
              <span v-if="scope.row.store_status===2">已出库</span>
            </template>
          </el-table-column>
          <el-table-column align="left" width="100" label="在线/离线">
            <template slot-scope="scope">
              <div>
                <span class="text-dot color1" v-if="scope.row.state === 1">在线</span>
                <span class="text-dot color2" v-if="scope.row.state === 2">离线</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="left" width="100" label="信号强度">
            <template slot-scope="scope">
              <div class="device-soc" v-if="scope.row.device">
                <span>{{scope.row.device.rssi || ''}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="left" width="100" label="设备电量">
            <template slot-scope="scope">
              <div class="device-soc" v-if="scope.row.device">
                <span
                  v-if="scope.row.status==1"
                  :class="scope.row.device.soc&&scope.row.device.soc<=20 ? 'warning' : ''"
                >{{scope.row.device.soc ? scope.row.device.soc + '%' : ''}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" width="120" label="监测点状态">
            <template slot-scope="scope">
              <div style="textAlign:center;">
                <span class="color1" v-if="scope.row.position_flg === 1">已开启</span>
                <span class="color2" v-if="scope.row.position_flg === 2">已停用</span>
                <span class="color3" v-if="scope.row.position_flg === 3">未绑定</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="120" label="检测指标数">
            <template
              slot-scope="scope"
            >{{scope.row.check_data && scope.row.check_data.split(',').length || 0}}</template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <template v-if="scope.row.position_flg!=1">
                <!-- <el-button size="mini" v-btnRole="26" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" v-btnRole="27" type="text" v-if="scope.row.customer[0]" @click="handleDelete(scope.row)">收回</el-button>-->
                <el-button size="mini" v-btnRole="26" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  v-btnRole="27"
                  type="text"
                  @click="handleDelete(scope.row)"
                >收回</el-button>
              </template>
              <el-button
                size="mini"
                type="text"
                @click="handleShowLocation(scope.row)"
              >查看定位</el-button>
            </template>
          </el-table-column>
        </el-table>
        <myPagination :pageInfo="pageInfo" @current-change="pageChange" />
      </div>
    </div>
    <el-dialog
      :title="(editId ? '编辑' : '新增') + '设备'"
      :visible.sync="dialogShow"
      :before-close="handleClose"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="equipmentForm"
        label-position="top"
        label-width="100px"
        class="warehouseForm form-inline"
      >
        <el-form-item class="form-item-inline" label="产品名称">
          <el-input size="small" value="全能空气检测器" disabled></el-input>
        </el-form-item>
        <el-form-item class="form-item-inline" label="设备ID" prop="device_number">
          <el-input
            size="small"
            :disabled="!!editId"
            v-model="formData.device_number"
            placeholder="请填写设备ID"
          ></el-input>
        </el-form-item>
        <el-form-item class="form-item-inline" label="出厂时间" prop="come_date">
          <el-date-picker
            v-model="formData.come_date"
            value-format="yyyy-MM-dd"
            size="small"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="form-item-inline" label="所属型号" prop="model">
          <el-select size="small" v-model="formData.model" placeholder="请选择设备型号">
            <el-option
              v-for="item in deviceType"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-item-inline" label="生产厂家" prop="manufacturer">
          <el-input size="small" v-model="formData.manufacturer" placeholder="请填写生产厂家"></el-input>
        </el-form-item>
        <el-form-item class="form-item-inline" label="入库仓库" prop="storehouse_id">
          <el-select size="small" v-model="formData.storehouse_id" placeholder="请选择入库仓库">
            <el-option
              v-for="item in warehouseList"
              v-show="!(item.status===2)"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-item-inline" label="所属客户">
          <el-select
            size="small"
            clearable
            v-model="formData.customer_id"
            filterable
            placeholder="请选择所属客户"
          >
            <el-option
              v-for="item in customerList"
              :key="item.id"
              :label="item.company_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-item-inline" label="所属客户类型">
          <el-select
            size="small"
            clearable
            v-model="formData.type"
            filterable
            placeholder="请选择所属客户类型"
          >
            <el-option label="客户" :value="1"></el-option>
            <el-option label="至源" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监测数据" prop="check_data">
          <el-checkbox-group v-model="formData.check_data">
            <el-checkbox v-for="item in monitorList" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="设备状态" prop="status">
          <el-radio-group size="small" v-model="formData.status">
            <el-radio-button label="1">正常</el-radio-button>
            <el-radio-button label="2">维修</el-radio-button>
            <el-radio-button label="3">损坏</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="handleCancel">取消</el-button>
          <el-button size="small" @click="handleSubmit" type="primary">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="位置" :visible.sync="locationShow" :close-on-click-modal="false">
      <div>
        <el-button size="small" @click="handleToLocation">定位</el-button>
        <div class="locationBox" style="width:100%;height:400px;" id="map"></div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import radioGroup from "@/components/Public/radioGroup";
import myPagination from "@/components/Public/myPagination";
import uploadFileBtn from "@/components/Public/uploadFileBtn";
import request from "@/utils/request";
export default {
  name: "equipment",
  data() {
    return {
      editId: 0,
      dialogShow: false,
      locationShow: false,
      deviceCount: {
        all: 0,
        in_count: 0,
        out_count: 0,
        run_count: 0,
      },
      formData: {
        device_number: "",
        come_date: "",
        model: "",
        manufacturer: "",
        storehouse_id: "",
        check_data: [],
        status: "",
        customer_id: "",
        type: "",
      },
      deviceType: [],
      monitorList: [],
      warehouseList: [],
      customerList: [],
      rules: {
        name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
        device_number: [
          { required: true, message: "请输入设备ID", trigger: "blur" },
        ],
        come_date: [
          { required: true, message: "请选择出厂日期", trigger: "blur" },
        ],
        model: [
          { required: true, message: "请选择设备所属型号", trigger: "blur" },
        ],
        manufacturer: [
          { required: true, message: "请输入生产厂家", trigger: "blur" },
        ],
        storehouse_id: [
          { required: true, message: "请选择入库仓库", trigger: "blur" },
        ],
        check_data: [
          { required: true, message: "请选择监测数据", trigger: "blur" },
        ],
        status: [
          { required: true, message: "请选择设备设备状态", trigger: "click" },
        ],
      },
      device_number: "",
      searchInfo: {
        status: "",
        run_status: "",
        type: "",
      },
      tableContent: [],
      multipleSelection: [],
      activeTimeType: 4,
      pageInfo: {
        total: 0,
        pageSize: 20,
        currentPage: 1,
      },
      location_x_y: "",
    };
  },
  created() {
    this.monitorList = this.$store.getters.dictionary.filter((item) => {
      return item.nameflag === "jianceshuju";
    })[0].value;
    this.deviceType = this.$store.getters.dictionary.filter((item) => {
      return item.nameflag === "suoshuxinghao";
    })[0].value;
    this.getCustomsList();
    this.getWarehouseList();
    this.getDeviceCount();
    this.getDeviceList();
  },
  methods: {
    // 设备开关机
    handleChangeState(detail) {
      const url = `/${detail.id}/state`;
      const state = detail.state === 1 ? 2 : 1;
      this.$confirm(`确定将该设备${state === 2 ? "关机" : "开机"}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        request(
          this.ajaxUrl.stateChange + url,
          {
            state: state,
          },
          "patch"
        )
          .then((res) => {
            this.getDeviceList();
            this.$message.success("操作成功");
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    handleToLocation() {
      this.mapObj.centerAndZoom(
        new BMap.Point(this.location_x_y[0], this.location_x_y[1]),
        15
      ); // 初始化地图,设置中心点坐标和地图级别
    },
    // 显示地图位置
    handleShowLocation(detail) {
      if (!detail.loca_x_y) {
        this.$message.warning("暂时无法获取定位信息");
        return;
      }
      //  || '104.072601,30.663525'
      this.locationShow = true;
      this.location_x_y = detail.loca_x_y.split(",");
      this.$nextTick(() => {
        const devLocation = detail.loca_x_y.split(",");
        this.initMap({
          s: devLocation[0],
          n: devLocation[1],
        });
      });
    },
    initMap(data) {
      // 百度地图API功能
      this.mapObj = new BMap.Map("map"); // 创建Map实例
      this.mapObj.centerAndZoom(new BMap.Point(data.s, data.n), 15); // 初始化地图,设置中心点坐标和地图级别
      // 添加定位控件
      // map.setCurrentCity(data.name);          // 设置地图显示的城市 此项是必须设置的
      this.mapObj.enableScrollWheelZoom(true);
      var point = new BMap.Point(data.s, data.n);
      var marker = new BMap.Marker(point); // 创建标注
      this.mapObj.addOverlay(marker); // 将标注添加到地图中
      // 设置标注动画效果。如果参数为null，则取消动画效果。该方法需要在addOverlay方法后设置
      marker.setAnimation(Animation);
    },
    deviceTypeTxt(model) {
      return this.deviceType.filter((item) => {
        return item.id === model;
      })[0].name;
    },
    // 上传成功后
    afterUpload(res) {
      this.getDeviceCount();
      this.getDeviceList();
    },
    getDeviceCount(type) {
      request(
        this.ajaxUrl.deviceCount,
        {
          type: this.activeTimeType,
        },
        "get"
      )
        .then((res) => {
          this.deviceCount = res;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取客户列表
    getCustomsList() {
      request(
        this.ajaxUrl.customsList,
        {
          pageSize: 99999,
          page: 1,
        },
        "get"
      )
        .then((res) => {
          this.customerList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取可入库仓库列表
    getWarehouseList() {
      request(
        this.ajaxUrl.storeHouses,
        {
          page: 1,
          pageSize: 99999,
        },
        "get"
      )
        .then((res) => {
          this.warehouseList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取设备列表
    getDeviceList() {
      request(
        this.ajaxUrl.deviceList,
        {
          page: this.pageInfo.currentPage,
          pageSize: this.pageInfo.pageSize,
          run_status: this.searchInfo.run_status,
          status: this.searchInfo.status,
          type: this.searchInfo.type,
          device_number: this.device_number,
        },
        "get"
      )
        .then((res) => {
          this.tableContent = res.data;
          this.pageInfo.total = res.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 头部时间切换
    handleChange(timeType) {
      this.activeTimeType = timeType;
      this.getDeviceCount();
    },
    // 翻页
    pageChange(val) {
      this.pageInfo.currentPage = val;
      this.getDeviceList();
    },
    // 搜索
    handleSearch() {
      this.device_number = "";
      this.pageInfo.currentPage = 1;
      this.getDeviceList();
    },
    // 精确搜索
    handlePreciseSearch() {
      this.handleReset();
      this.pageInfo.currentPage = 1;
      this.getDeviceList();
    },
    // 重置查询条件
    handleReset() {
      this.searchInfo.status = "";
      this.searchInfo.run_status = "";
      this.searchInfo.type = "";
    },
    // 新增/编辑设备弹框
    handleCreate() {
      this.editId = 0;
      this.dialogShow = true;
    },
    // 关闭弹框
    handleClose(done) {
      this.$refs["equipmentForm"].resetFields();
      done();
    },
    // 取消新增/编辑设备
    handleCancel() {
      this.$refs["equipmentForm"].resetFields();
      this.dialogShow = false;
    },
    // 提交
    handleSubmit() {
      this.$refs["equipmentForm"].validate((valid) => {
        if (valid) {
          if (this.editId) {
            request(
              this.ajaxUrl.editDevice + this.editId,
              {
                device_number: this.formData.device_number,
                come_date: this.formData.come_date,
                model: this.formData.model,
                manufacturer: this.formData.manufacturer,
                storehouse_id: this.formData.storehouse_id,
                check_data: this.formData.check_data.join(","),
                customer_id: this.formData.customer_id,
                status: this.formData.status,
                type: this.formData.type,
              },
              "put"
            )
              .then((res) => {
                this.$message.success("设备编辑成功");
                this.getDeviceList();
                this.$refs["equipmentForm"].resetFields();
                this.dialogShow = false;
                this.getDeviceCount();
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            request(
              this.ajaxUrl.addDevice,
              {
                device_number: this.formData.device_number,
                come_date: this.formData.come_date,
                model: this.formData.model,
                manufacturer: this.formData.manufacturer,
                storehouse_id: this.formData.storehouse_id,
                check_data: this.formData.check_data.join(","),
                customer_id: this.formData.customer_id,
                status: this.formData.status,
                type: this.formData.type,
              },
              "post"
            )
              .then((res) => {
                this.$message.success("设备新增成功");
                this.$refs["equipmentForm"].resetFields();
                this.getDeviceList();
                this.dialogShow = false;
                this.getDeviceCount();
              })
              .catch((err) => {
                console.log(err);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 编辑设备弹框
    handleEdit(detail) {
      this.editId = detail.id;
      this.dialogShow = true;
      let item = JSON.parse(JSON.stringify(detail));
      item.check_data = detail.check_data.split(",").map((item) => {
        return Number(item);
      });
      this.$nextTick(() => {
        //确保 form表单初始化完成后再赋值
        this.formData = item;
      });
    },
    // 删除
    handleDelete(detail) {
      this.$confirm("是否回收该设备", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request(this.ajaxUrl.recycleDevice + detail.id + "/cancel", {}, "put")
            .then((res) => {
              this.$message({
                type: "success",
                message: "回收成功!",
              });
              this.getDeviceList();
              this.getDeviceCount();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 翻页
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
      this.getDeviceList();
    },
  },
  components: {
    myPagination,
    radioGroup,
    uploadFileBtn,
  },
};
</script>
<style rel="stylesheet/scss" lang="scss">
.equipment {
  .radio-box {
    width: 189px;
    margin-bottom: 20px;
  }
  .equipment-item {
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
    margin-bottom: 20px;
    .equipment-statics {
      width: 100%;
      height: 90px;
      display: flex;
      li {
        width: 25%;
        height: 100%;
        max-width: 300px;
        border-right: 1px solid #eaeaea;
        color: #000;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding-left: 20px;
        &:nth-last-of-type(1) {
          border-right: none;
        }
        .statics-tit {
          font-size: 12px;
        }
        .statics-acount {
          font-size: 32px;
          font-weight: 600;
        }
      }
    }
    .filterBox {
      margin-bottom: 0;
      .filterItem {
        &:nth-last-of-type(1) {
          margin-bottom: 0;
        }
      }
    }
    .tableContent {
      margin-top: 20px;
      .text-dot {
        &.color1 {
          color: #29cc85;
          &::before {
            background-color: #29cc85;
          }
        }
        &.color2 {
          color: #fe4f5d;
          &::before {
            background-color: #fe4f5d;
          }
        }
      }
      .color1 {
        color: #29cc85;
      }
      .color2 {
        color: #fe4f5d;
      }
    }
  }
  #map {
    margin-top: 20px;
  }
  .device-soc {
    text-align: left;
    .warning {
      color: red;
    }
  }
}
</style>