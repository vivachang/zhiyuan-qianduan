<template>
<div class="memberDetail mainPage">
	<div class="detail-header">
		<dl class="header-left">
			<dt class="title">客户基础信息</dt>
			<dd>
				<span class="item-tit">公司名称</span>
				<span class="item-content">{{customsInfo.company_name}}</span>
				<span class="item-tit">简称：{{customsInfo.company_addr}}</span>
			</dd>
			<dd>
				<span class="item-tit">公司地址</span>
				<span class="item-content">{{customsInfo.address}}</span>
			</dd>
			<dd>
				<span class="item-tit">客户类型</span>
				<span class="item-content">
					{{ returnCustomType(customsInfo.type) || '未知' }}
				</span>
			</dd>
			<dd>
				<span class="item-tit">备注</span>
				<span class="item-content">{{customsInfo.memo}}</span>
			</dd>
		</dl>
		<dl class="header-right">
			<dt class="title">联系人信息</dt>
			<div class="right-content">
				<div v-for="(item,idx) in customsInfo.contacts" :key="item.id">
					<dd>
						<span class="item-tit">联系人{{idx+1}}</span>
						<span class="item-content">{{item.contact}}</span>
					</dd>
					<dd>
						<span class="item-tit">联系电话</span>
						<span class="item-content">{{item.contact_phone}}</span>
					</dd>
					<dd>
						<span class="item-tit">职务</span>
						<span class="item-content">{{item.job}}</span>
					</dd>
				</div>
			</div>
		</dl>
	</div>
	<div class="content" style="margin-top: 20px">
		<div class="title">项目信息</div>
		<div class="table-list">
			<el-table :data="projectList" style="width: 100%" border fit>
				<el-table-column prop="number" label="项目编号" align="left"></el-table-column>
				<el-table-column prop="name" label="项目名称" align="left"></el-table-column>
				<el-table-column prop="address" label="项目地址" align="left"></el-table-column>
				<el-table-column prop="position_count" label="监测点数量" align="left"></el-table-column>
				<el-table-column prop="status" label="项目状态" align="left">
					<template slot-scope="scope">
						{{publicObj.projectStatus[scope.row.status]}}
					</template>
				</el-table-column>
			</el-table>
			<myPagination :pageInfo="pageInfo" @current-change="pageChange"/>
		</div>
	</div>
</div>
</template>

<script>
import request from "@/utils/request";
import myPagination from '@/components/Public/myPagination'
export default {
name: "memberDetail",
	data() {
		return {
			customsInfo:{

			},
			customType:[],
			customsId:'',
			projectList: [],
			pageInfo: {
				total: 0,
				pageSize: 20,
				currentPage: 1,
			},
			rules: {},
		};
	},
	created() {
        this.customType = this.$store.getters.dictionary.filter((item)=>{
			return item.nameflag==='kehuleixin'
		})[0].value;
		this.customsId = this.$route.params.id;
		this.getMenberDetail();
		this.getMenberProject();
	},
	watch: {},
	methods: {
        returnCustomType(type){
            let result = this.customType.filter((item)=>{return item.id === type})[0];
            return result && result.name
        },
		getMenberDetail() {
			request(this.ajaxUrl.customsDetail + "/" + this.customsId,{}, "get")
				.then((res) => {
					this.customsInfo = res;
				})
				.catch((err) => {
					console.log(err);
				});
		},
		getMenberProject() {
			request(this.ajaxUrl.customsDetail + "/" + this.customsId + "/projects",{
				pageSize:this.pageInfo.pageSize,
				page:this.pageInfo.currentPage,
			}, "get").then((res) => {
				this.projectList = res.data;
				this.pageInfo.total = res.total;
			})
			.catch((err) => {
				console.log(err);
			});
		},
        // 翻页
        pageChange(val){
            this.pageInfo.currentPage = val;
            this.getProjectList();
        },
	},
    components:{
        myPagination
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.memberDetail {
	.detail-header{
		display: flex;
		justify-content: space-between;
		>dl{
			width: 49%;
			height: 184px;
			border-radius: 4px;
			background-color: #fff;
			padding: 20px;
			dd{
				font-size: 12px;
				color: #000;
				line-height: 30px;
				.item-tit{
					color: #999;
					min-width:68px;
					display: inline-block;
				}
				.item-content{
					margin-left: 20px;
					margin-right: 15px;
				}
			}
		}
		.header-right{
			display: flex;
			flex-direction: column;
			.right-content{
				width: 100%;
				width: 100%;
				display: flex;
				justify-content: space-between;
				>div{
					flex: 1;
					&:nth-of-type(1){
						padding-right: 20px;
					}
					&:not(:nth-of-type(1)){
						padding-left: 20px;
						border-left: 1px solid #EAEAEA;
					}
				}
			}
		}
	}
	.title {
		background-color: #ffffff;
		font-weight: 600;
		margin-bottom: 10px;
	}
}
</style>