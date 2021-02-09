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
						<span class="font-color">订单总额</span>
						<p class="number"><span>￥</span>{{count.order_money_count | formatPrice('none')}}</p>
					</div>
                    <div class="text">
						<span class="font-color">待付款</span>
						<p class="number"><span>￥</span>{{count.wait_money_count | formatPrice('none')}}</p>
					</div>
                    <div class="text">
						<span class="font-color">已收款</span>
						<p class="number"><span>￥</span>{{count.receive_money_count | formatPrice('none')}}</p>
					</div>
                    <div class="text noborder">
						<span class="font-color">已退款</span>
						<p class="number"><span>￥</span>{{count.exit_money_count | formatPrice('none')}}</p>
					</div>
				</div>
			</div>
			<div class="box-input">
				<el-form :model="searchInfo" :inline="true" class="formItem">
					<el-form-item prop="namePy" label="客户名称" class="formItem2">
						<el-input placeholder="请输入" size="small" v-model.trim="searchInfo.name" clearable></el-input>
					</el-form-item>
					<el-form-item prop="namePy" label="订单状态" class="formItem4">
						<el-select v-model="searchInfo.status" clearable size="small" placeholder="请选择">
							<el-option v-for="item in payStatus" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<el-button size="small" type="primary" @click="handleSearch()">查 询</el-button>
				<el-button size="small" type="text" @click="handleReset()">重置查询条件</el-button>
			</div>
			<div class="box-card">
				<el-table :data="financialList" style="width: 100%; margin-top:20px" border fit>
					<el-table-column prop="order_number" label="订单编号" header-align="left"></el-table-column>
					<el-table-column label="客户名称" align="left">
						<template slot-scope="scope">
							{{scope.row.customs && scope.row.customs.company_name}}
						</template>
					</el-table-column>
					<el-table-column label="订单类型" align="left" width="100">
						<template slot-scope="scope">
							<span>{{scope.row.type===1 ? '销售订单' : '租赁订单'}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="created_at" label="创建时间" align="left" width="240"></el-table-column>
					<el-table-column label="订单金额" align="left" width="180">
						<template slot-scope="scope">
							<span>{{scope.row.money | formatPrice}}</span>
						</template>
					</el-table-column>
					<el-table-column label="实收金额" align="left" width="180">
						<template slot-scope="scope">
							<span>{{scope.row.payment | formatPrice}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="status" label="订单状态" align="left" width="150">
						<template slot-scope="scope">
							<div class="table-status" :class="'color' + scope.row.order_status"><span>{{publicObj.orderStatus[scope.row.order_status]}}</span></div>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="left">
						<template slot-scope="scope">
							<el-button type="text" v-btnRole="28" @click="$router.push({name:'financialDetail',params:{id:scope.row.id}})">查看</el-button>
							<el-button type="text" v-btnRole="29" v-if="scope.row.order_status===1 || scope.row.order_status===3" @click="handleFinance(scope.row,1)">收款</el-button>
							<el-button type="text" v-btnRole="30" v-if="scope.row.order_status===2 || scope.row.order_status===3" @click="handleFinance(scope.row,2)">退款</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="pagination">
					<myPagination :pageInfo="pageInfo" @current-change="pageChange"/>
				</div>
			</div>
		</template>
		<el-dialog
			:title="'订单' + (type===1 ? '收款' : '退款')"
			:visible.sync="dialogVisible"
			:close-on-click-modal="false"
			:before-close="handleBeforeClose"
			width="600px">
            <el-form :model="formData" :rules="rules" ref="financeForm" label-position="top" label-width="100px" class="warehouseForm form-inline">
                <el-form-item class="form-item-inline" label="客户名称">
                    <el-input :value="formData.name" disabled ></el-input>
                </el-form-item>
                <el-form-item class="form-item-inline" label="订单金额">
                    <el-input :value="'￥' + formData.orderMoney" disabled></el-input>
                </el-form-item>
                <el-form-item class="form-item-inline" :label="(type===1 ? '待付款金额' : '可退款金额')">
                    <el-input :value="'￥' + formData.waitMoney" disabled></el-input>
                </el-form-item>
                <el-form-item class="form-item-inline" :label="'本次' + (type===1 ? '付款' : '退款') + '金额'" prop="money">
                    <el-input v-model="formData.money" :placeholder="'请填写本次' + (type===1 ? '付款' : '退款') + '金额'"></el-input>
                </el-form-item>
                <el-form-item class="form-item-inline" :label="(type===1 ? '付款方式' : '退款方式')" prop="pay_type">
					<el-select v-model="formData.pay_type" placeholder="请选择">
						<el-option label="对公转账" value="1"></el-option>
						<el-option label="微信" value="2"></el-option>
						<el-option label="支付宝" value="3"></el-option>
						<el-option label="现金" value="4"></el-option>
						<el-option label="其他" value="5"></el-option>
					</el-select>
                </el-form-item>
                <el-form-item class="form-item-inline" :label="(type===1 ? '付款日期' : '退款日期')" prop="date">
					<el-date-picker
						v-model="formData.date"
						value-format="yyyy-MM-dd"
						type="date"
						placeholder="选择日期">
					</el-date-picker>
                </el-form-item>
				<el-form-item>
					<el-upload
						ref="uploadCom"
						action=""
						:http-request="handleUpload"
						:on-remove="handleRemove">
						<span class="evidence">{{(type===1 ? '付款凭证' : '退款凭证')}}</span><el-button size="small" type="primary">上传文件</el-button>
						<div slot="tip" class="el-upload__tip">只能上传jpg,png文件，单个文件不超过500kb</div>
					</el-upload>
				</el-form-item>
                <el-form-item>
                    <el-button size="small" @click="handleCancel">取消</el-button>
                    <el-button size="small" @click="handleSubmit" type="primary">提交</el-button>
                </el-form-item>
            </el-form>
		</el-dialog>
	</div>
</template>
<script>
import radioGroup from '@/components/Public/radioGroup';
import myPagination from '@/components/Public/myPagination';
import request from "@/utils/request";
import {uploadFile} from "@/utils/tool.js";
// const reg = /(?=\B(\d{3})+$)/g;
export default {
	name:"financialList",
	components:{
		myPagination,
		radioGroup
    },
	data(){
		return {
			listShow: false,
			financialId:'',
			searchInfo: {
				name:'',
				status:''
			},
			count:{},
			formData:{
				name:'',
				orderMoney:'',
				waitMoney:'',
				money:'',
				pay_type:'',
				date:'',
				file:''
			},
			uploadIdList:[],
			fileUidList:[],
			timeType:2,
			financialList: [],
			dialogVisible:false,
			type:'',
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
				money:[
					{ required: true, message: '请输入本次 付款/退款 金额', trigger: 'blur' }
				],
				pay_type:[
					{ required: true, message: '请选择 付款/退款 方式', trigger: 'blur' }
				],
				date:[
					{ required: true, message: '请选择 付款 日期', trigger: 'blur' }
				]
			}
		}
	},
	created() {
        if(this.$route.name === 'financialList'){   //展示父组件列表
			this.listShow = true;
			this.getCount();
			this.getList();
        }else{                        //展示子组件路由
            this.listShow = false;
        } 
    },
	mounted() {
	},
	methods:{
		// 上传凭证
		handleUpload(e){
			uploadFile(e.file)
				.then((res)=>{
					this.uploadIdList.push(res.id);
					this.fileUidList.push(e.file.uid);
				}).catch((err)=>{
					console.log(err);
				})
		},
		// 移除文件
		handleRemove(file){
			let idx = this.fileUidList.indexOf(file.uid);
			this.fileUidList.splice(idx,1);
			this.uploadIdList.splice(idx,1);
		},
		// 获取统计数据
		getCount(){
			request(this.ajaxUrl.financialCount,{
				type:this.timeType
			},'get').then((res)=>{
				this.count = res;
			}).catch((err)=>{
				console.log(err)
			})
		},
		// 查询
		handleSearch(){
			this.getList();
		},
		// 重置查询条件
		handleReset(){
			this.searchInfo = {
				name:'',
				status:''
			}
		},
		// 获取列表
		getList(){
			request(this.ajaxUrl.financialList,{
				pageSize:this.pageInfo.pageSize,
				page:this.pageInfo.currentPage,
				name:this.searchInfo.name,
				status:this.searchInfo.status
			},'get').then((res)=>{
				this.financialList = res.data;
				this.pageInfo.total = res.total;
			}).catch((err)=>{
				console.log(err);
			})
		},
		// 统计时间改变
		handleChange(active){
			this.timeType = active;
			this.getCount();
		},
		// 收款/退款 确定
        handleSubmit(){
			this.$refs['financeForm'].validate((valid)=>{
				if(valid){
					let fileIds = this.uploadIdList.join(',');
					if(!fileIds){
						this.$message.warning('请上传收款/退款凭证');
						return
					}
					request(this.ajaxUrl.financialMethods + this.financialId,{
						type:this.type,
						money:this.formData.money,
						pay_type:this.formData.pay_type,
						file:fileIds,
						date:this.formData.date
					},'put').then((res)=>{
						this.$message.success('操作成功');
						this.dialogVisible = false;
						this.getList();
						this.getCount();
						this.resetForm();
					}).catch((err)=>{
						console.log(err)
					})
				}else{
					console.log('error Submit');
					return false;
				}
			})
		},
		// 收款/退款 取消
		handleCancel(){
			this.dialogVisible = false;
			this.resetForm();
		},
		// 关闭弹框
		handleBeforeClose(done){
			this.resetForm();
			done();
		},
		// 重置表单数据
		resetForm(){
			this.formData = {
				name:'',
				orderMoney:'',
				waitMoney:'',
				money:'',
				pay_type:'',
				date:'',
				file:''
			};
			this.uploadIdList = [];
			this.fileUidList = [];
			this.$refs['uploadCom'].clearFiles();
		},
		// 翻页
        pageChange(val){
            this.pageInfo.currentPage = val;
			this.getList();
		},
		check() {
            this.$router.push({
            	name: "financialDetail"
            });
		},
        // 收款 / 退款
        handleFinance (item,type) {
			this.type = type;
			this.financialId = item.id;
			request(this.ajaxUrl.financialInfo + item.id,{

			},'get').then((res)=>{
				this.formData.name = res.customs.company_name;
				this.formData.orderMoney = res.money;
				this.formData.waitMoney = type===1 ? res.wait_put_moeny : res.wait_back_meony;
				this.formData.money =  type===1 ? res.wait_put_moeny : res.wait_back_meony;
				this.dialogVisible = true;
			}).catch((err)=>{
				console.log(err);
			})
        },
	},
	watch:{
		chartData(news,olds) {
			this.initChart(this.chartData);
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
	margin-top: 20px;
	}
	.block {
		width: 100%;
		background-color: #ffffff;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: nowrap;
		padding: 20px;
		.text {
			width: 24%;
            margin-right: 16px;
			border-right: 1px solid #ddd;
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
        .noborder {
            border-right: none;
        }
	}
	.block-two {
		margin-left: 1%;
	}
.number {
	font-size: 36px;
	height: 60px;
	line-height: 60px;
	color: #000;
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
    margin-top: 20px;
    padding-left: 20px;
    padding-top: 20px;
    height: 140px;
    background-color: #ffffff;
	.formItem {
		.el-input {
			width: 200px;
		}
	}
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
.evidence{
	margin-right: 10px;
	&::before{
		content: "*";
		color: red;
	}
}
</style>