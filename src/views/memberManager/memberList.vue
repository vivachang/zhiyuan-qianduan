<template>
  <div class="app-container">
    <router-view></router-view>
    <template v-if="listShow">
      <div class="head-left">
        <div class="block">
          <div class="member-acount">
            <p class="font-color">客户数量</p>
            <p class="number">
              <span>{{pageInfo.total}}</span>个
            </p>
          </div>
          <div class="images">
            <el-image :src="src" class="header"></el-image>
          </div>
        </div>
        <div class="box-input">
          <el-form :model="searchInfo" :inline="true">
            <el-form-item style="margin-bottom:10px;" prop="name" label="公司名称">
              <el-input size="small" placeholder="请输入" v-model.trim="searchInfo.name" clearable></el-input>
            </el-form-item>
            <el-form-item prop="contact" label="联系人">
              <el-input size="small" placeholder="请输入" v-model.trim="searchInfo.contact" clearable></el-input>
            </el-form-item>
          </el-form>
          <el-button size="small" type="primary" class="minWidth" @click="handleSearch()">查 询</el-button>
          <el-button size="small" type="text" @click="handleResize()">重置查询条件</el-button>
        </div>
      </div>
      <div class="box-card">
        <div class="btns">
          <el-button size="small" v-btnRole="14" type="primary" @click="handleCreate(2)">新增客户</el-button>
        </div>
        <el-table :data="memberList" class="border-table" style="width: 100%; margin-top:20px" fit>
          <!-- <el-table-column prop="id" label="编号" align="left" width="80"></el-table-column> -->
          <el-table-column type="index" label="编号" :index="indexMethod" width="50"></el-table-column>
          <el-table-column prop="company_name" label="公司名称" width="200" header-align="left">
            <template slot-scope="scope">
              <span
                style="white-space: nowrap;"
                :title="scope.row.company_name"
              >{{scope.row.company_name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="company_addr" label="公司简称" width="150" align="left">
            <template slot-scope="scope">
              <span
                style="white-space: nowrap;"
                :title="scope.row.company_addr"
              >{{scope.row.company_addr}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="客户类型" align="left" width="150">
            <template slot-scope="scope">
              {{ returnCustomType(scope.row.type) || '未知' }}
              <!-- <i class="icon" :class="'icon-customs-type-' + scope.row.type"></i> -->
              <!-- <span class="customsType" :class="'type_' + scope.row.type" v-if="scope.row.type == 0">普通</span>
                            <span class="customsType" :class="'type_' + scope.row.type" v-if="scope.row.type == 1">VIP</span>
              <span class="customsType" :class="'type_' + scope.row.type" v-if="scope.row.type == 2">黑名单</span>-->
            </template>
          </el-table-column>
          <el-table-column label="联系人" align="left" width="180">
            <template slot-scope="scope">{{scope.row.contacts[0] && scope.row.contacts[0].contact}}</template>
          </el-table-column>
          <el-table-column label="职务" align="left" width="180">
            <template slot-scope="scope">{{scope.row.contacts[0] && scope.row.contacts[0].job}}</template>
          </el-table-column>
          <el-table-column label="联系电话" align="left" width="150">
            <template
              slot-scope="scope"
            >{{scope.row.contacts[0] && scope.row.contacts[0].contact_phone}}</template>
          </el-table-column>
          <el-table-column prop="project_count" label="项目数量" align="left" width="100"></el-table-column>
          <el-table-column prop="position_count" label="监测点数量" align="left" width="100"></el-table-column>
          <el-table-column label="操作" align="left">
            <template slot-scope="scope">
              <el-button type="text" v-btnRole="15" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                type="text"
                v-btnRole="16"
                @click="$router.push({name:'memberDetail',params:{id:scope.row.id}})"
              >查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <myPagination :pageInfo="pageInfo" @current-change="pageChange" />
        </div>
      </div>
      <el-dialog
        :title="(editId ? '编辑' : '新增') + '客户信息'"
        :visible.sync="dialogShow"
        :before-close="handleClose"
        :close-on-click-modal="false"
        width="700px"
      >
        <el-form
          :model="formData"
          :rules="rules"
          ref="warehouseForm"
          label-position="top"
          label-width="100px"
          class="warehouseForm"
        >
          <el-form-item label="公司名称" prop="company_name">
            <el-input size="small" v-model="formData.company_name" placeholder="请填写公司名称"></el-input>
          </el-form-item>
          <el-form-item label="公司简称" prop="company_addr" class="margin-50">
            <el-input size="small" v-model="formData.company_addr" placeholder="请填写公司简称"></el-input>
          </el-form-item>
          <el-form-item label="客户类型" prop="type">
            <el-select v-model="formData.type" size="small" placeholder="请选择客户类型">
              <el-option
                v-for="item in customType"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公司地址" prop="address" class="margin-50">
            <el-input size="small" v-model="formData.address" placeholder="请填写公司地址"></el-input>
          </el-form-item>
          <el-form-item label="系统LOGO" style="margin-right:500px">
            <div class="upload-logo-box">
              <uploadImg
                :imgUrl="formData.logo_path"
                @afterUpload="afterUpload"
                @afterRemove="afterRemove"
              />
            </div>
          </el-form-item>
          <div class="contact" v-for="(item, index) in formData.contacts" :key="index">
            <div class="contact-item">
              <el-form-item
                label="联系人"
                :prop="'contacts.' + index + '.contact'"
                :rules="{
                                    required:true,message:'请填写联系人姓名',trigger:'blur'
                                }"
                class="input-width"
              >
                <el-input
                  size="small"
                  v-model="formData.contacts[index].contact"
                  placeholder="请填写联系人姓名"
                ></el-input>
              </el-form-item>
            </div>
            <div class="contact-item">
              <el-form-item
                label="联系电话"
                :prop="'contacts.' + index + '.contact_phone'"
                :rules="[
                                    {required:true,message:'请填写联系电话',trigger:'blur'},
                                    { validator: checkPhone, trigger: 'blur' },
                                ]"
                class="margin-20 input-width"
              >
                <el-input
                  size="small"
                  maxlength="11"
                  v-model="formData.contacts[index].contact_phone"
                  placeholder="请填写联系电话"
                ></el-input>
              </el-form-item>
            </div>
            <div class="contact-item">
              <el-form-item label="职务" prop="job" class="margin-20 input-width">
                <el-input size="small" v-model="formData.contacts[index].job" placeholder="请填写职务"></el-input>
              </el-form-item>
            </div>
            <el-button
              v-if="index!==0"
              size="small"
              class="delt-contact"
              @click="handleDelContact(index)"
            >删除</el-button>
          </div>
          <el-form-item>
            <el-button size="small" type="primary" @click="addContact" class="button">添加</el-button>
          </el-form-item>
          <el-form-item label="数据屏模板" prop="checkList" style="position: relative;">
            <div class="checkAll_wrapper">
              <el-checkbox v-model="checkAll" @change="handleClickCheckAll">全选</el-checkbox>
            </div>
            <ul class="template_wrapper">
              <li>
                <img
                  src="../../assets/images/first_template.png"
                  class="template_img"
                  @click="showBigImg(1)"
                />
              </li>
              <li>
                <img
                  src="../../assets/images/second_template.png"
                  class="template_img"
                  style="margin:0 20px;"
                  @click="showBigImg(2)"
                />
              </li>
              <li>
                <img
                  src="../../assets/images/second_template.png"
                  class="template_img"
                  @click="showBigImg(3)"
                />
              </li>
            </ul>
            <div class="checkbox_wrapper">
              <el-checkbox-group v-model="formData.checkList" @change="handleCheckboxChange">
                <el-checkbox :label="1">模板一</el-checkbox>
                <el-checkbox :label="2" style="margin:0 20px;">模板二</el-checkbox>
                <el-checkbox :label="3">模板三</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
          <el-form-item label="备注" prop="memo" class="remarks">
            <el-input
              v-model="formData.memo"
              type="textarea"
              :show-word-limit="true"
              maxlength="100"
              rows="4"
              resize="none"
              placeholder="不超过100个字"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="handleCancel">取消</el-button>
            <el-button size="small" @click="handleSubmit" type="primary">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 模板图片1 -->
      <el-dialog title="数据屏模板图片" :visible.sync="dialogFirst">
        <img src="../../assets/images/first_template.png" class="big_img" />
      </el-dialog>
      <!-- 模板图片2/3 -->
      <el-dialog title="数据屏模板图片" :visible.sync="dialogSecond">
        <img src="../../assets/images/second_template.png" class="big_img" />
      </el-dialog>
    </template>
  </div>
</template>
<script>
import myPagination from "@/components/Public/myPagination";
import request from "@/utils/request";
import uploadImg from "@/components/Public/uploadImg";
import avatar from "@/assets/images/avatar.png";
export default {
  name: "memberList",
  components: {
    myPagination,
    uploadImg,
  },
  inject: ["reload"],
  data() {
    return {
      listShow: false,
      fileList: [],
      memberList: [],
      searchInfo: {
        name: "",
        contact: "",
      },
      dialogFirst: false,
      dialogSecond: false,
      bigImgUrl: "",
      editId: 0, //当前操作的 用户 id  0 为新增
      dialogShow: false,
      src: avatar,
      pageInfo: {
        total: 50,
        pageSize: 10,
        currentPage: 1,
      },
      customType: [],
      formData: {
        company_name: "",
        company_addr: "",
        logo_path: "",
        logo: "",
        type: "",
        email: "",
        address: "",
        memo: "",
        contacts: [
          {
            contact: "",
            contact_phone: "",
            job: "",
          },
        ],
        checkList: [],
      },
      rules: {
        company_name: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择客户类型", trigger: "blur" }],
        checkList: [
          {
            type: "array",
            required: true,
            message: "请选择数据屏模板",
            trigger: "change",
          },
        ],
      },
      checkAll: false,
    };
  },
  created() {
    this.customType = this.$store.getters.dictionary.filter((item) => {
      return item.nameflag === "kehuleixin";
    })[0].value;
    if (this.$route.name === "memberList") {
      //展示父组件列表
      this.listShow = true;
      this.getCustomsList();
    } else {
      //展示子组件路由
      this.listShow = false;
    }
  },
  methods: {
    checkPhone(rule, value, callback) {
      //验证手机号码
      if (value !== "") {
        let _reg = new RegExp("^[1][0-9]{10}$");
        if (!_reg.test(value)) {
          callback(new Error("请输入合规的手机号码"));
        } else {
          callback();
        }
      }
    },
    indexMethod(index) {
      return (
        (this.pageInfo.currentPage - 1) * this.pageInfo.pageSize + index + 1
      );
    },
    returnCustomType(type) {
      let result = this.customType.filter((item) => {
        return item.id === type;
      })[0];
      return result && result.name;
    },
    afterUpload(response, idx) {
      this.formData.logo_path = response.path;
      this.formData.logo = response.id;
    },
    afterRemove(idx) {
      this.formData.logo_path = "";
      this.formData.logo = "";
    },
    // 搜索
    handleSearch() {
      this.pageInfo.currentPage = 1;
      this.getCustomsList();
    },
    // 重置查询条件
    handleResize() {
      this.searchInfo = {
        name: "",
        contact: "",
      };
    },
    // 获取用户列表
    getCustomsList() {
      request(
        this.ajaxUrl.customsList,
        {
          pageSize: this.pageInfo.pageSize,
          page: this.pageInfo.currentPage,
          contact: this.searchInfo.contact,
          name: this.searchInfo.name,
        },
        "get"
      )
        .then((res) => {
          this.pageInfo.total = res.total;
          this.memberList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 新增
    handleCreate() {
      this.editId = 0;
      this.dialogShow = true;
    },
    // 编辑
    handleEdit(detail) {
      console.log(detail);
      this.editId = detail.id;
      this.dialogShow = true;
      this.formData.company_name = detail.company_name;
      this.formData.company_addr = detail.company_addr;
      this.formData.logo_path = detail.logos && detail.logos.path;
      this.formData.logo = detail.logos && detail.logos.id;
      this.formData.type = detail.type;
      this.formData.email = detail.email;
      this.formData.address = detail.address;
      this.formData.memo = detail.memo;
      this.formData.contacts = JSON.parse(JSON.stringify(detail.contacts));
      let checked = detail.template_ids.split(",").map(Number);
      this.formData.checkList = Array.from(new Set(checked));
      if (this.formData.checkList.length == 3) {
        this.checkAll = true;
      }
    },
    // 关闭弹框
    handleClose(done) {
      // this.resetForm();
      this.reload();
      done();
    },
    // 取消
    handleCancel() {
      // this.resetForm();
      this.reload();
      this.dialogShow = false;
    },
    // 新增联系人
    addContact() {
      this.formData.contacts.push({
        contact: "",
        contact_phone: "",
        job: "",
      });
    },
    handleDelContact(idx) {
      this.formData.contacts.splice(idx, 1);
    },
    // 提交
    handleSubmit() {
      this.$refs["warehouseForm"].validate((valid) => {
        if (valid) {
          let params = {
            company_name: this.formData.company_name,
            company_addr: this.formData.company_addr,
            logo: this.formData.logo,
            type: this.formData.type,
            address: this.formData.address,
            memo: this.formData.memo,
            contact: JSON.stringify(this.formData.contacts),
            template_ids: this.formData.checkList.sort().toString(),
          };
          if (this.editId) {
            request(
              this.ajaxUrl.editCustoms + this.editId,
              {
                ...params,
              },
              "put"
            )
              .then((res) => {
                this.$message.success("客户编辑成功");
                this.dialogShow = false;
                this.getCustomsList();
                this.reload();
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            request(this.ajaxUrl.addCustoms, {
              ...params,
            })
              .then((res) => {
                this.$message.success("客户新增成功");
                this.dialogShow = false;
                this.getCustomsList();
                this.reload();
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
    // 重置表单数据
    resetForm() {
      this.$refs["warehouseForm"].resetFields();
      this.formData = {
        company_name: "",
        company_addr: "",
        logo_path: "",
        logo: "",
        type: "",
        email: "",
        address: "",
        memo: "",
        contacts: [
          {
            contact: "",
            contact_phone: "",
            job: "",
          },
        ],
      };
    },
    // 翻页
    pageChange(val) {
      this.pageInfo.currentPage = val;
      this.getCustomsList();
    },
    // 全选
    handleClickCheckAll() {
      if (this.checkAll == true) {
        this.formData.checkList.push(1, 2, 3);
      } else {
        this.formData.checkList = [];
      }
    },
    // 多选
    handleCheckboxChange() {
      this.checkAll = false;
    },
    // 查看大图
    showBigImg(num) {
      if (num == 1) {
        this.dialogFirst = true;
      } else {
        this.dialogSecond = true;
      }
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.upload-logo-box {
  width: 60px;
  height: 60px;
  line-height: 60px;
  border: 1px dashed #eee;
}
.head-left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.block {
  width: 350px;
  height: 118px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 4px;
}
.images {
  height: 72px;
  float: left;
}
.header {
  height: 100%;
}
.member-acount {
  float: left;
  width: 208px;
  height: 100%;
  padding-top: 4px;
  color: #000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .font-color {
    font-size: 14px;
  }
  .number {
    > span {
      font-size: 36px;
      font-weight: 600;
      margin-right: 10px;
    }
  }
}
.box-input {
  margin-left: 10px;
  padding-left: 40px;
  padding-top: 20px;
  padding-bottom: 20px;
  height: 118px;
  flex: 1;
  background-color: #ffffff;
  border-radius: 4px;
}
.el-form-item {
  margin-bottom: 5px !important;
}
.box-card {
  background-color: #ffffff;
  padding: 20px;
  margin-top: 20px;
  border-radius: 4px;
}
.pagination {
  margin-top: 30px;
}
.warehouseForm {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}
.contact {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  align-items: flex-end;
  .contact-item {
    flex: 1;
    margin-bottom: 15px;
  }
  .delt-contact {
    margin-left: 10px;
    margin-bottom: 25px;
  }
}
.button {
  width: 640px;
}
.warehouseForm .el-input {
  width: 300px;
}
.margin-50 {
  margin-left: 50px;
}
.input-width .el-input {
  width: 100%;
}
.margin-20 {
  margin-left: 20px;
}
.remarks .el-textarea {
  width: 650px;
}
.template_wrapper {
  display: flex;
  height: 100px;
}
.template_wrapper .template_img {
  width: 200px;
  height: 100px;
}
.checkbox_wrapper {
  height: 35px;
}
/deep/ .checkbox_wrapper .el-checkbox {
  margin-right: 0;
  width: 200px;
}
.checkAll_wrapper {
  position: absolute;
  left: 85px;
  top: -50px;
}
.big_img {
  display: block;
  width: 6.6rem;
  height: 500px;
}
</style>