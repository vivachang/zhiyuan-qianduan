<template>
  <div id="box">
    <div class="box-flex">
      <div class="box-border box-width">
        <div class="item-title">订单信息</div>
          <ul class="info-list">
            <li>
                <span>订单编号</span>
                <span>{{orderInfo.order_number}}</span>
            </li>
            <li>
                <span>客户名称</span>
                <span>{{orderInfo.customs.company_name}}</span>
            </li>
            <li>
                <span>创建时间</span>
                <span>{{orderInfo.created_at}}</span>
            </li>
            <li>
                <span>订单金额</span>
                <span>{{orderInfo.money | formatPrice}}</span>
            </li>
            <li>
                <span>订单状态</span>
                <span :class="'color' + orderInfo.order_status">{{publicObj.orderStatus[orderInfo.order_status]}}</span>
            </li>
          </ul>
      </div>
    </div>
    <div style="margin-top: 20px">
      <div class="box-border">
        <div class="title">收退款详情</div>
        <div class="table-list">
            <el-table :data="financialLog" style="width: 100%" border fit>
                <el-table-column label="事件" width="80" align="left">
                  <template slot-scope="scope">
                    {{scope.row.type===1 ? '收款' : '退款'}}
                  </template>
                </el-table-column>
                <el-table-column label="收退款方式" width="120" align="left">
                  <template slot-scope="scope">
                    {{publicObj.payType[scope.row.pay_type]}}
                  </template>
                </el-table-column>
                <el-table-column label="收退款凭证" align="left">
                  <template slot-scope="scope">
                    <img v-for="imgItem in scope.row.files" :key='imgItem.id' class="financia-img" @click="handleShowBig(imgItem)" :src="imgItem.path" alt="">
                  </template>
                </el-table-column>
                <el-table-column prop="updated_at" label="操作日期" width="180" align="left"></el-table-column>
                <el-table-column label="操作人" width="180" align="left">
                  <template slot-scope="scope">
                    {{scope.row.user && scope.row.user.truename}}
                  </template>
                </el-table-column>
                <el-table-column prop="price" label="收付款金额" width="180" align="left">
                    <template slot-scope="scope">
                      <span>{{scope.row.money | formatPrice}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <myPagination :pageInfo="pageInfo" @current-change="pageChange"/>
            </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="bigImgShow" :append-to-body="true">
        <img width="100%" :src="bigImgPath" alt="">
    </el-dialog>
  </div>
</template>

<script>
import myPagination from '@/components/Public/myPagination';
import request from "@/utils/request";
export default {
  name: "financialDetail",
  components:{
		myPagination
    },
  data() {
    return {
        orderId:'',
        orderInfo:{
            customs:{}
        },
        bigImgShow:false,
        bigImgPath:'',
        pageInfo:{
            total:0,
            pageSize:20,
            currentPage:1,
        },
        financialLog: [],
    }
  },
  created() {
      this.orderId = this.$route.params.id;
      this.getOrderInfo();
      this.getFinanciLog();
  },
  methods: {
    // 查看大图
    handleShowBig(imgItem){
      this.bigImgPath = imgItem.path;
      this.bigImgShow = true;
    },
    getOrderInfo(){
        request(this.ajaxUrl.financialInfo + this.orderId,{

        },'get').then((res)=>{
            this.orderInfo = res;
        }).catch((err)=>{
            console.log(err);
        })
    },
    getFinanciLog(){
      request(this.ajaxUrl.financialLog + this.orderId + '/financeLog',{
        page:this.pageInfo.currentPage,
        pageSize:this.pageInfo.pageSize
      },'get').then((res)=>{
        this.financialLog = res.data;
        this.pageInfo.total = res.total;
      }).catch((err)=>{
        console.log(err);
      })
    },
    // 提交
    handleSubmit(){
      this.$refs['warehouseForm'].validate((valid) => {
          console.log(valid);
          if (valid) {
              if(this.isEdit){
                  console.log('编辑')
              }else{
                  console.log('提交')
              }
          } else {
              console.log('error submit!!');
              return false;
          }
      });
    },
    indexMethod(index) {
      return index * 2;
    },
    // 翻页
    pageChange(val){
        this.pageInfo.currentPage = val;
        this.getFinanciLog();
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
#box {
  .box-width {
  width: 100%;
  background-color: #ffffff;
  padding: 20px;
  }
  .margin-left {
    margin-left: 1%;
  }
  .title {
    background-color: #ffffff;
    padding: 15px;
  }
  .table {
    padding-left: 15px;
    background-color: #ffffff;
  }
  .table-list {
    padding: 15px;
    background-color: #ffffff;
  }
  .table-flex {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    padding-bottom: 81px;
  }
  .box-flex {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }
  .warehouseForm {
    width: 50%;
  }
  .warehouseForm .el-form-item {
    margin-bottom: 1px;
  }
}
.item-title{
    font-size: 14px;
    margin-bottom: 20px;
}
.info-list{
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    height: 90px;
    >li{
        font-size: 12px;
        color: #000;
        width: 50%;
        display: flex;
        line-height: 30px;
        margin-right: 20px;
        border-right: 1px solid #ddd;
        >span{
            display: inline-block;
            text-align: left;
            &:nth-of-type(1){
                width: 85px;
                color: #979797;
            }
            &:nth-of-type(2){
                flex: 1;
            }
        }
        &:nth-of-type(4){
            border-right: none;
        }
        &:nth-of-type(5){
            border-right: none;
        }
    }
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 30%;
}

.financia-img{
  width: 60px;
  height: 60px;
  margin-right: 10px;
  cursor: pointer;
}
.color1{
    color: #ffc13a;
}
.color2,.color3{
    color: #29cc85;
}
.color5,.color4{
    color: #FE4857;
}
</style>