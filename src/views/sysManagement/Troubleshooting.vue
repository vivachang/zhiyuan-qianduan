<template>
<div class="Troubleshooting mainPage">
	<div class="filters">
		<div class="filterBox">
			<div class="filterItem">
				<span>设备ID</span>
				<el-input type="text" size="small" v-model="searchInfo.device_id" clearable placeholder="请输入设备ID"></el-input>
				<br>
			</div>
			<div class="filterItem">
				<span>项目名称</span>
				<el-select v-model="searchInfo.project_id" filterable clearable size="small" placeholder="请选择项目名称">
					<el-option v-for="item in projectList" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
				<br>
			</div>
			<br>
			<div class="filterItem">
				<span></span>
				<el-button type="primary" size="small" @click="handleSearch">查询</el-button>
				<el-button type="text" size="small" @click="handleResize">重置查询条件</el-button>
			</div>
		</div>
	</div>
	<div class="content">
		<el-table
			:data="tableData"
			border
			style="width: 100%">
			<el-table-column
				prop="id"
				width="120"
				label="故障ID">
			</el-table-column>
			<el-table-column
				prop="device_id"
				label="设备ID">
			</el-table-column>
			<el-table-column
				label="所属项目">
				<template slot-scope="scope">
					{{scope.row.project && scope.row.project.name}}
				</template>
			</el-table-column>
			<el-table-column
				prop="type"
				label="故障类型">
			</el-table-column>
			<!-- <el-table-column
				prop="name"
				label="持续频次(次/min)">
			</el-table-column> -->
			<el-table-column
				prop="happen_time"
				label="故障时间">
			</el-table-column>
			<el-table-column
				label="设备当前状态">
				<template slot-scope="scope">
					{{scope.row.devices && publicObj.runStatus[scope.row.devices.run_status]}}
				</template>
			</el-table-column>
		</el-table>
		<myPagination :pageInfo="pageInfo" @current-change="pageChange"/>
	</div>
</div>
</template>

<script>
import myPagination from '@/components/Public/myPagination'
import request from "@/utils/request";
export default {
	components:{
			myPagination
		},
	data(){
		return{
			searchInfo:{
				device_id:'',
				project_id:''
			},
			projectList:[],
			tableData:[

			],
			pageInfo:{
				pageSize:20,
				currentPage:1,
				total:0
			},
		}
	},
	created(){
		this.getBreakDownList();
		this.getProjectList();
	},
	methods:{
		// 获取可选项目列表
		getProjectList(){
			request(this.ajaxUrl.projectsList,{
                pageSize:99999,
                page:1,
            },'get').then((res)=>{
				this.projectList = res.data;
            }).catch((err)=>{
                console.log(err);
            })
		},
		// 搜索
		handleSearch(){
			this.pageInfo.currentPage = 1;
			this.getBreakDownList();
		},
		// 重置查询条件
		handleResize(){
			this.searchInfo = {
				device_id:'',
				project_id:''
			}
		},
		getBreakDownList(){
			request(this.ajaxUrl.breakDownList,{
				include:'project,devices',
				project_id:this.searchInfo.project_id,
				device_id:this.searchInfo.device_id,
				page:this.pageInfo.currentPage,
				pageSize:this.pageInfo.pageSize
			},'get').then((res)=>{
				this.tableData = res.data;
				this.pageInfo.total = res.meta.total;
			}).catch((err)=>{
				console.log(err)
			})
		},
		// 翻页
		pageChange(val){
			this.pageInfo.currentPage = val;
			this.getBreakDownList();
		}
	}
}
</script>

<style lang="less" scoped>
.Troubleshooting{
	.filters{
		background-color: #fff;
		padding: 20px 0 0 20px;
	}
	.content{
		margin-top: 20px;
	}
}
</style>