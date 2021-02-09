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
					<span>{{orderInfo.customs && orderInfo.customs.company_name}}</span>
				</li>
				<li>
					<span>订单类型</span>
					<span>{{orderInfo.type===1 ? '销售订单' : '租赁订单'}}</span>
				</li>
				<li>
					<span>是否开票</span>
					<span>{{orderInfo.invoice===1 ? '否' : '是'}}</span>
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
			<div class="title">财务信息</div>
			<div class="table-list">
				<el-table :data="financialLog" style="width: 100%" border fit>
					<el-table-column label="事件" align="left">
						<template slot-scope="scope">
							{{scope.row.type===1 ? '收款' : '退款'}}
						</template>
					</el-table-column>
					<el-table-column label="收付款方式" align="left">
						<template slot-scope="scope">
							{{publicObj.payType[scope.row.pay_type]}}
						</template>
					</el-table-column>
					<el-table-column prop="updated_at" label="操作日期" align="left"></el-table-column>
					<el-table-column label="操作人" align="left">
						<template slot-scope="scope">
							{{scope.row.user && scope.row.user.truename}}
						</template>
					</el-table-column>
					<el-table-column prop="price" label="收付款金额" align="left">
						<template slot-scope="scope">
							<span>{{scope.row.money | formatPrice}}</span>
						</template>
					</el-table-column>
				</el-table>
				<myPagination :pageInfo="pageInfo" @current-change="pageChange"/>
			</div>
		</div>
	</div>
	<div style="margin-top: 20px">
		<div class="box-border">
			<div class="title">商品信息</div>
			<div class="table-list">
				<el-table :data="publicObj.productList" :default-expand-all="true" style="width: 100%" border fit>
					<el-table-column type="expand">
						<template slot-scope="props">
								<div class="expand-box">
									<p class="expand-title">设备信息</p>	
									<ul class="expand-list">
										<li v-for="(deviceItem,idx) in orderDeviceList" :key="deviceItem.id">
											<span>{{idx+1}}</span>
											<span>
												产品：{{props.row.name}}
											</span>
											<span>
												设备ID：{{deviceItem.device && deviceItem.device.device_number}}
											</span>
										</li>
									</ul>
								</div>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="产品名称" header-align="left"></el-table-column>
					<el-table-column prop="price" label="产品单价" align="left">
						<template slot-scope="scope">
							<span>{{orderInfo.price | formatPrice}}</span>
						</template>
					</el-table-column>
					<el-table-column label="产品数量" align="left">
						<template slot-scope="scope">
							<!-- <span>{{orderDeviceList.length}}</span> -->
							<span>{{orderInfo.num}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="totalnum" label="合计" align="left">
						<template slot-scope="scope">
							<!-- <span>{{orderInfo.money | formatPrice}}</span> -->
							<span>{{orderInfo.price*orderInfo.num | formatPrice}}</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import request from "@/utils/request";
import myPagination from '@/components/Public/myPagination';
export default {
	name: "memberDetail",
	data() {
		return {
			orderId:'',
			orderInfo:{},
			financialLog: [],
			pageInfo:{
				total:0,
				pageSize:10,
				currentPage:1
			},
			orderDeviceList: [],
		};
	},
	created() {
		this.orderId = this.$route.params.id;
		this.getOrderInfo();
		this.getFinanciLog();
	},
	methods: {
		// 获取订单详情
		getOrderInfo(){
			request(this.ajaxUrl.orderInfo + this.orderId,{

			},'get').then((res)=>{
				this.orderInfo = res;
				this.orderDeviceList = res.devices;
			}).catch((err)=>{
				console.log(err);
			})
		},
		// 获取财务信息 -- 收退款详情
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
		handleSubmit() {
			this.$refs["warehouseForm"].validate(valid => {
				console.log(valid);
				if (valid) {
				if (this.isEdit) {
					console.log("编辑");
				} else {
					console.log("提交");
				}
				} else {
				console.log("error submit!!");
				return false;
				}
			});
		},
		indexMethod(index) {
			return index * 2;
		},
		// 财务信息翻页
		pageChange(val){
			this.pageInfo.currentPage = val;
			this.getFinanciLog();
		}
	},
	components:{
		myPagination
	}
};
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
.item-title {
font-size: 14px;
margin-bottom: 20px;
}
.info-list {
display: flex;
flex-wrap: wrap;
flex-direction: column;
height: 120px;
> li {
	font-size: 12px;
	color: #000;
	width: 50%;
	display: flex;
	line-height: 30px;
	margin-right: 20px;
	border-right: 1px solid #ddd;
	> span {
	display: inline-block;
	text-align: left;
	&:nth-of-type(1) {
		width: 85px;
		color: #979797;
	}
	&:nth-of-type(2) {
		flex: 1;
	}
	}
	&:nth-of-type(4) {
	border-right: none;
	}
	&:nth-of-type(5) {
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

/deep/.el-table__expanded-cell{
	background-color: #f5f6ff;
} 
.expand-box{
	.expand-title{
		font-size: 14px;
		color: #000;
	}
	.expand-list{
		margin-top: 15px;
		>li{
			font-size: 12px;
			line-height: 20px;
			>span{
				margin-right: 10px;
				display: inline-block;
				&:nth-of-type(1){
					width: 50px;
				}
				&:nth-of-type(2){
					min-width: 200px;
				}
			}
		}
	}
}

.color1{
	color: #ffc13a;
}
.color2,.color3{
	color: #29cc85;
}
.color4,.color5,.color6{
	color: #FE4857;
}
</style>