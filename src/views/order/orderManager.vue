<template>
	<div class="orderManager">
		<router-view></router-view>
		<template v-if="listShow">
			<div class="radio-box">
				<radio-group @change="handleChange" ref="radioGroup"/>
			</div>
			<div class="box-flex">
				<div class="block">
					<div class="text">
						<span class="font-color">订单数量</span><br/>
						<span class="number">{{orderCountDetail.order_count}}</span><span class="number-unit">个</span>
					</div>
					<div class="block-right">
						<div ref="myChartCount" :style="{width: '100px', height: '100%'}" class="myChartCount"></div>
						<ul class="number-color">
							<li>
								<span>已付款</span>
								<span>{{orderCountDetail.order_pay_count}}</span>
							</li>
							<li>
								<span>待付款</span>
								<span>{{orderCountDetail.order_wait_count}}</span>
							</li>
							<li>
								<span>部分付款</span>
								<span>{{orderCountDetail.order_section_pay_count}}</span>
							</li>
						</ul>
					</div>
				</div>
				<div class="block">
					<div class="text">
						<span class="font-color">订单金额</span><br/>
						<!-- <span class="number"><span>￥</span>{{Number(orderCountDetail.order_money_count).toFixed(2)}}</span> -->
						<span class="number"><span>￥</span>{{orderCountDetail.order_money_count | formatPrice('none')}}</span>
					</div>
					<div class="block-right">
						<div ref="myChartMoney" :style="{width: '100px', height: '100%'}" class="myChartMoney"></div>
						<ul class="number-color">
							<li>
								<span>已付款</span>
								<span>{{orderCountDetail.order_payment_money | formatPrice}}</span>
							</li>
							<li>
								<span>待付款</span>
								<span>{{orderCountDetail.order_wait_money | formatPrice}}</span>
							</li>
							<li>
								<span>已退款</span>
								<span>{{orderCountDetail.order_refund_money | formatPrice}}</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="box-input">
				<el-form :model="searchInfo" :inline="true" class="formItem">
					<el-form-item prop="namePy" label="客户名称" class="formItem1">
						<el-input size="small" placeholder="请输入" v-model.trim="searchInfo.name" clearable></el-input>
					</el-form-item>
					<el-form-item prop="namePy" label="订单状态" class="formItem2">
						<el-select size="small" clearable v-model="searchInfo.status" placeholder="请选择">
							<el-option v-for="item in payStatus" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<br/>
					<el-form-item prop="medicineName" label="创建日期" class="formItem3">
						<el-date-picker
							v-model="searchInfo.time"
							value-format='yyyy-MM-dd'
							size="small"
							type="date"
							placeholder="选择日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item prop="medicineName" label="订单金额" class="formItem4">
						<el-input size="small" placeholder="请输入金额范围 如0-100" v-model.trim="searchInfo.money" clearable></el-input>
					</el-form-item>
				</el-form>
				<el-button size="small" type="primary" @click="handleSearch">查 询</el-button>
				<el-button size="small" type="text" @click="handleReset">重置查询条件</el-button>
			</div>
			<div class="box-card">
				<div class="btns">
					<el-button size="small" v-btnRole="17" type="primary" @click="handleCreate(2)">新增订单</el-button>
				</div>
				<el-table :data="orderList" class="border-table" style="width: 100%; margin-top:20px" fit>
					<el-table-column prop="order_number" label="订单编号" header-align="left"></el-table-column>
					<el-table-column label="客户名称" align="left">
						<template slot-scope="scope">
							<span>{{scope.row.customs && scope.row.customs.company_name}}</span>
						</template>
					</el-table-column>
					<el-table-column label="订单类型" align="left">
						<template slot-scope="scope">
							<span v-if="scope.row.type===1">销售订单</span>
							<span v-if="scope.row.type===2">租赁订单</span>
						</template>
					</el-table-column>
					<el-table-column label="是否开票" align="left">
						<template slot-scope="scope">
							<span>{{scope.row.invoice===1 ? '否' : '是'}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="created_at" label="创建时间" align="left" width="160"></el-table-column>
					<el-table-column label="订单金额" align="right" width="180">
						<template slot-scope="scope">
							<span style="font-weight:600;">{{scope.row.money | formatPrice}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="status" label="订单状态" align="left" width="150">
						<template slot-scope="scope">
							<div class="table-status" clearable :class="'color' + scope.row.order_status"><span>{{publicObj.orderStatus[scope.row.order_status]}}</span></div>
						</template>
					</el-table-column>
					<el-table-column prop="approveNo" label="出库状态" align="left" width="150">
						<template slot-scope="scope">
							<div class="table-status" :class="'color' + scope.row.send_goods_status"><span>{{publicObj.sendStatus[scope.row.send_goods_status]}}</span></div>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="left">
					<template slot-scope="scope">
						<el-button type="text" v-btnRole="19" @click="$router.push({name:'orderDetail',params:{id:scope.row.id}})">查看</el-button>
						<el-button type="text" v-btnRole="18" v-if="scope.row.order_status === 1" @click="handleEdit(scope.row)">编辑</el-button>
						<el-button type="text" v-btnRole="21" v-if="(scope.row.order_status === 2 || scope.row.order_status === 3 || scope.row.order_status === 6) && scope.row.send_goods_status === 1" @click="handleSend(scope.row)">发货</el-button>
						<el-button type="text" v-btnRole="20" v-if="scope.row.order_status === 1" @click="handleCancelRoder(scope.row)">取消</el-button>
					</template>
					</el-table-column>
				</el-table>
				<div class="pagination">
					<myPagination :pageInfo="pageInfo" @current-change="pageChange"/>
				</div>
			</div>
			<!-- 新增/编辑订单弹框 -->
            <el-dialog
                :title="(editId ? '编辑' : '新增') + '订单'"
                :visible.sync="orderDialogShow"
                :before-close="handleClose"
                :close-on-click-modal='false'
                width="600px">
				<el-form :model="formData" :rules="rules" ref="orderForm" label-position="top" label-width="100px" class="form-inline">
					<el-form-item class="form-item-inline" label="客户名称" prop="cid">
						<el-select size="small" v-model="formData.cid" filterable placeholder="请选择客户名称">
							<el-option v-for="item in customsList" :key="item.id" :label="item.company_name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item class="form-item-inline" label="订单类型" prop="type">
						<el-select size="small" v-model="formData.type"  placeholder="请选择订单类型">
							<el-option label="销售订单" :value="1"></el-option>
							<el-option label="租赁订单" :value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item class="form-item-inline" label="是否开票" prop="invoice">
						<el-select size="small" v-model="formData.invoice"  placeholder="请选择是否开票">
							<el-option label="否" :value="1"></el-option>
							<el-option label="是" :value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item class="form-item-inline" label="订单金额" prop="money">
						<el-input class="moneyBefore" size="small" v-model="formData.money" placeholder="请填写订单金额"></el-input>
					</el-form-item>
						<!-- <el-input style="width:150px;" size="small" disabled :value="全能空气检测器"></el-input> -->
					<el-form-item label="订单详情" prop="num">
						<el-select style="width:150px;" size="small" disabled :value="1">
							<el-option v-for="item in publicObj.productList" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
						<el-input-number size="small" controls-position="right" v-model="formData.num" :min="1" :max="100" :step="1"></el-input-number>
						<el-input class="moneyBefore" placeholder="设备单价" style="width:100px;" size="small" v-model.trim="devicePrice"></el-input>
						<el-input style="width:150px;" size="small" disabled :value="'合计￥' + countPrice"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button size="small" @click="handleCancel">取消</el-button>
						<el-button size="small" @click="handleSubmit" type="primary">提交</el-button>
					</el-form-item>
				</el-form>
            </el-dialog>
			<!-- 发货弹框 -->
            <el-dialog
                title="订单发货"
                :visible.sync="sendDialogShow"
                :before-close="handleClose"
                :close-on-click-modal='false'
                width="600px">
				<el-form :model="sendFormData" :rules="sendRules" ref="sendForm" label-position="top" label-width="100px" class="form-inline">
					<div class="sendBox">
						<div class="sendTable">
							<div class="sendTable-title">订单信息</div>
							<el-table :data="publicObj.productList" style="width: 100%; margin-top:20px" border fit>
								<el-table-column prop="name" label="产品名称" align="left"></el-table-column>
								<el-table-column label="产品数量" align="left">
									<template slot-scope="scope">{{sendFormData.num}}</template>
								</el-table-column>
								<el-table-column prop="price" label="单价" align="left">
									<template slot-scope="scope">{{scope.row.price | formatPrice}}</template>
								</el-table-column>
								<el-table-column label="合计" align="left">
									<template slot-scope="scope">{{sendFormData.money| formatPrice}}</template>
								</el-table-column>
							</el-table>
						</div>
						<div class="sendTable">
							<div class="sendTable-title">设备信息</div>
							<el-table :data="devicesIdList" style="width: 100%; margin-top:20px" height="200" border fit>
								<el-table-column label="序号" type="index" align="left" width="80"></el-table-column>
								<el-table-column label="产品名称" align="left">
									<template slot-scope="scope">{{scope.row.name}}</template>
								</el-table-column>
								<el-table-column label="设备ID" align="left">
									<template slot-scope="scope">
										<el-select v-model="scope.row.device_id" filterable placeholder="请输入设备ID">
											<el-option
											v-for="item in allDevicesList"
											:key="item.id"
											:label="item.device_number"
											:value="item.id">
											</el-option>
										</el-select>
										<!-- <el-input v-model="scope.row.number" size="small" placeholder="请输入设备ID"></el-input> -->
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
					<div style="width:100%;margin-top:15px;">物流信息</div>
					<el-form-item class="form-item-inline" label="物流名称" prop="express_name">
						<el-input size="small" v-model="sendFormData.express_name" placeholder="请填写物流名称"></el-input>
					</el-form-item>
					<el-form-item class="form-item-inline" label="物流单号" prop="express_number">
						<el-input size="small" v-model="sendFormData.express_number" placeholder="请填写物流单号"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button size="small" @click="handleCancelSend">取消</el-button>
						<el-button size="small" @click="handleSubmitSend" type="primary">提交</el-button>
					</el-form-item>
				</el-form>
            </el-dialog>
		</template>
	</div>
</template>
<script>
import echarts from 'echarts';
import 'echarts-gl';
import radioGroup from '@/components/Public/radioGroup';
import myPagination from '@/components/Public/myPagination';
import request from "@/utils/request";
import regExp from '@/utils/regExp.js'
export default {
	name:"orderManager",
	components:{
		myPagination,
		radioGroup
    },
	data(){
		return {
			devicePrice:'',		//设备默认价格
			listShow: false,
			editId:0,			//0为新增
			timeType: 2,
			orderCountDetail:{

			},
			myChartCount: null,
			myChartMoney: null,
			orderDialogShow: false,
			sendDialogShow:false,
			customsList:[],
			searchInfo: {
				name:'',
				money:'',
				status:'',
				time:''
			},
			formData: {
				cid:'',
				money:'',
				type:'',
				invoice:'',
				num:1
			},
			sendFormData:{
				express_name:'',
				express_number:'',
				num:0,
				id:''
			},
			orderInfo:{},
			orderList: [],
			devicesIdList:[
				{
					name:'',
					number:''
				}
			],
			allDevicesList:[],
			payStatus: [
				{ value: 1, label: "待付款" },
				{ value: 2, label: "已付款" },
				{ value: 3, label: "部分付款" },
				// { value: 4, label: "部分退款" },
				{ value: 4, label: "已退款" },
				{ value: 5, label: "已取消" },
				{ value: 6, label: "部分退款" }
			],
			pageInfo:{
                total:0,
                pageSize:20,
                currentPage:1,
			},
			rules:{
                cid:[
                    { required: true, message: '请选择客户名称', trigger: 'blur' },
				],
				money:[
					{ required: true, message: '请输入订单金额', trigger: 'blur' },
					{ validator: regExp.checkMoney, trigger:'blur'}
				],
				num:[
					{ required: true, message: '请输入设备数量', trigger: 'blur' },
				],
				type:[
					{ required: true, message: '请选择订单类型', trigger: 'blur' },
				],
				invoice:[
					{ required: true, message: '请选择是否开票', trigger: 'blur' },
				]
			},
			sendRules:{
				express_name:[
					{ required: true, message: '请填写物流名称', trigger: 'blur' }
				],
				express_number:[
					{ required: true, message: '请填写物流单号', trigger: 'blur' }
				]
			}
		}
	},
	computed:{
		countPrice(){
			if(this.formData.num){
				let count = ((this.devicePrice || 0) * this.formData.num).toFixed(2);
				if(!this.editId){
					this.formData.money = count;
				}
				return count
			}else{
				this.formData.money = 0;
				return 0
			}
		}
	},
	created() {
		if(this.$route.name === 'orderManager'){   //展示父组件列表
			// this.devicePrice = this.publicObj.productList[0].price;		//初始化价格
            this.listShow = true;
        }else{                        //展示子组件路由
            this.listShow = false;
        } 
    },
	mounted() {
		if(this.$route.name === 'orderManager') {
			this.myChartCount = echarts.init(this.$refs.myChartCount);
			this.myChartMoney = echarts.init(this.$refs.myChartMoney);
			this.getOrderCount();
			this.getOrderList();
			this.getCustomsList();
			this.getNoUserDeviceList();
		}
	},
	methods:{
		// 获取客户列表
		getCustomsList(){
			request(this.ajaxUrl.customsList,{
				page:1,
				pageSize:99999
			},'get').then((res)=>{
				this.customsList = res.data;
			}).catch((err)=>{

			})
		},
		getNoUserDeviceList(){		//获取没有所属客户的设备
			request(this.ajaxUrl.noUserDevice,{
				
			},'get').then((res)=>{
				this.allDevicesList = res;
			}).catch((err)=>{
				console.log(err)
			})

		},
		// 创建饼状图
		initChart(){
			this.myChartCount.setOption({
				series: [
					{
						name: '订单数量',
						type: 'pie',
						radius: '75%',
						data: [
							{value: this.orderCountDetail.order_pay_count,name: "已付款", itemStyle: {color: "#29cc85"}},
							{value: this.orderCountDetail.order_wait_count, name: "待付款", itemStyle: {color: "#ffc13a"}},
							{value: this.orderCountDetail.order_section_pay_count, name: "部分付款", itemStyle: {color: "red"}}
						],
						label: {
							show: false
						}
					}
				]
			}),
			this.myChartMoney.setOption({
					series: [
						{
							name: '订单金额',
							type: 'pie',
							radius: '75%',
							data: [
								{value: this.orderCountDetail.order_payment_money,name: "已付款", itemStyle: {color: "#29cc85"}},
								{value: this.orderCountDetail.order_wait_money, name: "待付款", itemStyle: {color: "#ffc13a"}},
								{value: this.orderCountDetail.order_refund_money, name: "部分付款", itemStyle: {color: "red"}}
							],
							label: {
								show: false
							}
						}
				]
			})
		},
		// 统计时间切换
		handleChange(active){
			this.timeType = active;
			this.getOrderCount();
		},
		// 获取订单统计数据
		getOrderCount(){
			request(this.ajaxUrl.orderCount,{
				type:this.timeType
			},'get').then((res)=>{
				this.orderCountDetail = res;
				this.initChart();
			}).catch((err)=>{
				console.log(err)
			})
		},	
		// 搜索
		handleSearch(){
			this.pageInfo.currentPage = 1;
			this.getOrderList()
		},
		// 重置查询条件
		handleReset(){
			this.searchInfo = {
				name:'',
				money:'',
				status:'',
				time:''
			}
		},
		// 获取订单列表
		getOrderList(){
			request(this.ajaxUrl.orderList,{
				name:this.searchInfo.name,
				money:this.searchInfo.money,
				status:this.searchInfo.status,
				time:this.searchInfo.time,
				page:this.pageInfo.currentPage,
				pageSize:this.pageInfo.pageSize
			},'get').then((res)=>{
				this.orderList = res.data;
				this.pageInfo.total = res.total;
			}).catch((err)=>{
				console.log(err);
			})
		},
		// 新增
        handleCreate(){
            this.editId = 0;
			this.handleResizeForm();
			this.orderDialogShow = true;
		},
		// 编辑
		handleEdit(orderItem) {
            this.editId = orderItem.id;
			this.formData.cid = orderItem.cid;
			this.formData.num = orderItem.num;
			this.formData.type = orderItem.type;
			this.formData.invoice = orderItem.invoice;
			this.formData.money = orderItem.money;
			this.devicePrice = orderItem.price;
			this.orderDialogShow = true;
		},
		// 取消订单
		handleCancelRoder(orderItem){
			this.$confirm('确定取消该订单?','提示',{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(()=>{
				request(this.ajaxUrl.cancelOrder + orderItem.id + '/cancel',{

				},'put').then((res)=>{
					this.$message.success('订单取消成功');
					this.getOrderList();
					this.getOrderCount();
				}).catch((err)=>{
					console.log(err);
				})
			}).catch(()=>{})
		},
		handleResizeForm(){
			this.formData={
				cid:'',
				money:'',
				num:1
			};
			this.devicePrice = '';
		},
		// 关闭弹框
        handleClose(done){
			this.$refs['orderForm'] && this.$refs['orderForm'].resetFields();
			this.$refs['sendForm'] && this.$refs['sendForm'].resetFields();
			this.handleResizeForm();
            done();
		},
		// 取消 新增订单
        handleCancel(){
            this.$refs['orderForm'].resetFields();
			this.handleResizeForm();
            this.orderDialogShow = false;
		},
        // 提交 新增订单
        handleSubmit(){
			if(this.devicePrice==""){
				this.$message.error('请输入设备单价');
				return;
			}
            this.$refs['orderForm'].validate((valid) => {
                if (valid) {
                    if(this.editId){
						request(this.ajaxUrl.editOrder + this.editId,{
							cid:this.formData.cid,
							num:this.formData.num,
							type:this.formData.type,
							invoice:this.formData.invoice,
							price:this.devicePrice,
							money:this.formData.money
						},'put').then((res)=>{
							this.$message.success('订单编辑成功');
							this.$refs['orderForm'].resetFields();
            				this.orderDialogShow = false;
							this.getOrderList();
							this.getOrderCount();
						}).catch((err)=>{
							console.log(err);
						})
                    }else{
						request(this.ajaxUrl.addOrder,{
							cid:this.formData.cid,
							num:this.formData.num,
							type:this.formData.type,
							invoice:this.formData.invoice,
							price:this.devicePrice,
							money:this.formData.money
						}).then((res)=>{
							this.$message.success('订单新增成功');
							this.$refs['orderForm'].resetFields();
            				this.orderDialogShow = false;
							this.getOrderList();
							this.getOrderCount();
						}).catch((err)=>{
							console.log(err)
						})
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
		// 发货
		handleSend(orderItem){
			this.devicesIdList = [];
			this.sendDialogShow = true;
			this.sendFormData.num = orderItem.num;
			this.sendFormData.money = orderItem.money;
			this.sendFormData.id = orderItem.id;
			for(let i=0;i<orderItem.num;i++){
				this.devicesIdList.push({
					name:this.publicObj.productList[0].name,
					device_id:''
				})
			}
		},
		// 取消 发货
		handleCancelSend(){
			this.sendDialogShow = false;
		},
		// 提交 发货
		handleSubmitSend(){
			this.$refs['sendForm'].validate((valid)=>{
				if(valid){
					// console.log(this.sendFormData,this.devicesIdList);
					if(!this.checkDevicesId(this.devicesIdList)){
						this.$message.warning('设备ID未填写完整');
						return
					}else{
						let checkData = this.devicesIdList.map((item)=>{return item.device_id});
						if([...new Set(checkData)].length < checkData.length){
							this.$message.warning('设备id重复，请重新选择');
							return;
						}
						let data = JSON.stringify(this.devicesIdList.map((item)=>{return {device_id:item.device_id}}));
						request(this.ajaxUrl.orderSend + this.sendFormData.id + '/send',{
							express_name:this.sendFormData.express_name,
							express_number:this.sendFormData.express_number,
							data:data
						}).then((res)=>{
							this.$message.success('发货成功');
							this.sendDialogShow = false;
							this.getOrderList();
							this.getNoUserDeviceList();
						}).catch((err)=>{
							console.log(err);
						})
					}
				}else{
					console.log('未填写完整');
				}
			})
		},
		checkDevicesId(list){
			return list.every((item)=>{
				return Boolean(item.device_id)
			})
		},
		// 翻页
        pageChange(val){
			this.pageInfo.currentPage = val;
			this.getOrderList();
		},
	},
	watch:{
		devicePrice(newValue,oldValue){
			if(!regExp.checkDecimal(newValue)){
				this.devicePrice = oldValue;
			}
		}
	}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.box-flex {
	display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
	margin-top: 30px;
	justify-content: space-between;
	.block {
		width: 49.5%;
		height: 125px;
		background-color: #ffffff;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: nowrap;
		position: relative;
		.text {
			flex: 0.7;
			padding: 20px;
			height: 100%;
		}
		.block-right{
			width: 300px;
			display: flex;
			.myChartCount {
				width: 70px;
				height: 100%;
			}
			.number-color{
				flex: 1;
				margin-left: 20px;
				margin-right: 40px;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				>li{
					width: 100%;
					padding-left: 20px;
					display: flex;
					justify-content: space-between;
					line-height: 24px;
					position: relative;
					font-size: 12px;
					&::before{
						content: "";
						width: 8px;
						height: 8px;
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
					}
					&:nth-of-type(1){
						&::before{
							background-color: #29cc85;
						}
					}
					&:nth-of-type(2){
						&::before{
							background-color: #ffc13a;
						}
					}
					&:nth-of-type(3){
						&::before{
							background-color: red;
						}
					}
				}
			}
		}
	}
}
.el-form-item{
	margin-bottom: 16px !important;
}
.number {
	font-size: 36px;
	line-height: 60px;
	color: #000;
	font-weight: 600;
	>span{
		font-size: 16px;
		margin-right: 5px;
	}
}
.number-unit {
	font-size: 16px;
	margin: 5px;
}
.number-line {
	line-height: 40px;
	margin-top: 10px;
}
.font-color {
    font-size: 14px;
    color: #000;
	font-weight: 700;
}
.radio-box{
	width: 190px;
	margin-right: 20px;
}
.box-input {
    margin-top: 30px;
    padding-left: 20px;
    padding-top: 20px;
	// height: 200px;
	padding-bottom: 20px;
    background-color: #ffffff;
	.formItem {
		.el-input {
			width: 200px;
		}
	}
}
.formItem2 {
	margin-left: 50px;
}
.formItem4 {
	margin-left: 50px;
}
.box-card {
    background-color: #ffffff;
    padding: 20px;
    margin-top: 20px;
}
.table-status{
	>span{
		padding-left: 15px;
		position: relative;
		&::before{
			content: "";
			width:6px;
			height: 6px;
			border-radius: 50%;
			position: absolute;
			left: 3px;
			top: 50%;
			transform: translateY(-50%);
		}
	}
	
	&.color1{
		color: #ffc13a;
		>span{
			&::before{
				background-color: #ffc13a;
			}
		}
	}
	&.color2,&.color3{
		color: #29cc85;
		>span{
			&::before{
				background-color: #29cc85;
			}
		}
	}
	&.color5,&.color4,&.color6{
		color: #FE4857;
		>span{
			&::before{
				background-color: #FE4857;
			}
		}
	}
}
.moneyBefore{
	position: relative;
	&::before{
		content:'￥';
		position: absolute;
		font-size: 12px;
		color: #999;
		left: 10px;
		top: 50%;
		transform: translateY(-50%);
	}
	/deep/.el-input__inner{
		padding-left: 25px;
	} 
}
.sendBox{
	width: 100%;
	.sendTable{
		margin-top: 15px;
	}
}
.el-select--small{
	width:100% !important;
}
</style>