<template>
	<div class="loginLog mainPage">
		<div class="loginLog-header">
			<div class="loginLog-search">
				<div class="filterBox">
					<div class="filterItem">
						<span>用户名或姓名</span>
						<el-input size="small" v-model="searchInfo.name" placeholder="请输入用户名或姓名"></el-input>
					</div>
					<br>
					<div class="filterItem">
						<span></span>
						<el-button type="primary" size="small" @click="handleSearch">查询</el-button>
						<el-button type="text" size="small" @click="handleReset">重置查询条件</el-button>
					</div>
				</div>
			</div>
		</div>
		<div class="laoginLog-content">
			<div class="content">
				<el-table
					:data="tableData"
					border
					style="width: 100%">
					<el-table-column
						prop="id"
						width="120"
						label="日志ID">
					</el-table-column>
					<el-table-column
						label="登录用户名">
						<template slot-scope="scope">
							{{scope.row.users.name}}
						</template>
					</el-table-column>
					<el-table-column
						prop="date"
						label="客户名称">
						<template slot-scope="scope">
							{{scope.row.users.customer && scope.row.users.customer.company_name}}
						</template>
					</el-table-column>
					<el-table-column
						label="姓名">
						<template slot-scope="scope">
							{{scope.row.users.truename}}
						</template>
					</el-table-column>
					<el-table-column
						prop="ip"
						label="登录IP">
					</el-table-column>
					<el-table-column
						prop="updated_at"
						label="登录时间">
					</el-table-column>
					<el-table-column
						prop="oncenotice"
						label="异常提示">
					</el-table-column>
				</el-table>
				<myPagination :pageInfo="pageInfo" @current-change="pageChange"/>
			</div>
		</div>
	</div>
</template>

<script>
import myPagination from '@/components/Public/myPagination'
import request from "@/utils/request";
export default {
	name:'loginLog',
	data(){
		return {
			tableData:[

			],
			searchInfo:{
				name:''
			},
			pageInfo:{
				pageSize:10,
				currentPage:1,
				total:0
			}
		}
	},
	created(){
		this.getLogList();
	},
	methods:{
		pageChange(val){
			this.pageInfo.currentPage = val;
			this.getLogList();
		},
		handleReset(){
			this.searchInfo = {
				name:''
			}
		},
		getLogList(){

			request(this.ajaxUrl.loginLog,{
				include:'users',
				reuse_param:this.searchInfo.name,
				// reuse_param:null,
				pageSize:this.pageInfo.pageSize,
				page:this.pageInfo.currentPage
			},'get').then((res)=>{
				this.tableData = res.data;
				this.pageInfo.total = res.meta.total;
			}).catch((err)=>{
				console.log(err)
			})
		},
		handleSearch(){
			this.pageInfo.currentPage = 1;
			this.getLogList();
		}
	},
	components:{
		myPagination
	}
}
</script>

<style lang="less" scoped>
	.loginLog{
		.loginLog-header{
			background-color: #fff;
			border-radius: 4px;
			padding: 20px;
			.filterBox{
				margin-bottom: 0;
				.filterItem:nth-last-of-type(1){
					margin-bottom: 0;
				}
			}
		}
		.laoginLog-content{
			margin-top: 20px;
			background-color: #fff;
			border-radius: 4px;
			padding: 20px;
		}
	}
</style>