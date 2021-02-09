<template>
    <div class="msgDetail">
        <div class="project-item">
            <div class="item-title">项目信息</div>
            <ul class="info-list">
                <li>
                    <span>预警事件</span>
                    <span>{{warningDetail.threshold_keys}}</span>
                </li>
                <li>
                    <span>所属项目</span>
                    <span>{{warningDetail.project_name}}</span>
                </li>
                <li>
                    <span>所属客户</span>
                    <span>{{warningDetail.customs_name}}</span>
                </li>
                <li>
                    <span>预警时间</span>
                    <span>{{warningDetail.warning_time}}</span>
                </li>
                <li>
                    <span>检测标准</span>
                    <span>{{warningDetail.thresholds_name}}</span>
                </li>
                <li>
                    <span>现场反馈时间</span>
                    <span>{{warningDetail.first_sms_time}}</span>
                </li>
            </ul>
        </div>
        <div class="project-item">
            <div class="item-title">{{type=="send" ? '发送消息' : '信息'}}</div>
            <div class="feedback" v-if="type=='send'" @click="handleDialog('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595012358313&di=52ea311799d3d1cec36dfc74c76f8b5b&imgtype=0&src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201612%2F26%2F20161226105255_F3eCQ.jpeg')">
                请尽可能详细反馈现场情况，点击查看现场反馈模板
            </div>
            <div class="send-msg-box" v-if="type=='send'">
                <div class="send-msg-content">
                    <el-input class="no-border" maxlength="9999" v-model="sendMsgDetail.content" rows="3" resize="none" placeholder="请输入文本" type="textarea"></el-input>
                    <div class="send-img">
                        <div class="send-img-box" v-for="(imgItem,sendIdx) in sendMsgDetail.picsPath" :key="imgItem+sendIdx">
                            <uploadImg :idx="sendIdx" :imgUrl="imgItem" @afterUpload="sendAfterUpload" @afterRemove="sendAfterRemove"/>
                        </div>
                    </div>
                </div>
                <div class="send-msg-btn">
                    <el-button size="small" @click="handleSendMsg" type="primary">发送信息</el-button>
                    <el-button size="small" @click="handleSendUpload">上传图片</el-button>
                </div>
            </div>
            <ul class="msg-list">
                <li class="msg-item" v-for="(msgItem,parentIdx) in msgList" :key="msgItem.msgId">
                    <div class="user-info">
                        <div class="user-img">
                            <img :src="msgItem.user.img && msgItem.user.img.path || 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595009992994&di=f5efa6f786d5c7e328b04c92d0aa1883&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201410%2F09%2F20141009224754_AswrQ.jpeg'" alt="">
                        </div>
                        <p class="user-name">{{msgItem.user.truename}}</p>
                    </div>
                    <div class="msg-info">
                        <template v-if="msgItem.isEdit && JSON.stringify(editMsgItem) != '{}'">
                            <el-input class="no-border" rows="3" resize="none" type="textarea" v-model="editMsgItem.content"></el-input> 
                            <div class="edit-img-msg">
                                <div class="edit-img-box" v-for="(imgItem,childIdx) in editMsgItem.picsPath" :key="imgItem.id">
                                    <uploadImg :idx="childIdx" :imgUrl="imgItem" @afterUpload="afterUpload" @afterRemove="afterRemove"/>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <p class="text-msg">{{msgItem.content}}</p>
                            <div class="img-msg">
                                <img v-for="(imgItem,idx) in msgItem.pics_img" :key="idx" @click="handleDialog(imgItem)" :src="imgItem.path" alt="">
                            </div>
                        </template>
                        <div class="msg-footer">
                            <p class="msg-time">{{msgItem.updated_at}}</p>
                            <div class="msg-btn" v-if="type=='send'">
                                <template v-if="msgItem.isEdit">
                                    <el-button size="small" @click="handleEditUpload">上传图片</el-button>
                                    <el-button type="primary" size="small" @click="handleSaveEdit(msgItem,parentIdx)">确定</el-button>
                                    <el-button size="small" @click="handleCancleEdit(msgItem)">取消</el-button>
                                </template>
                                <el-button v-if="!msgItem.isEdit && msgItem.user.id === memberId" size="small" @click="handleEditMsg(msgItem)">编辑</el-button>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <myPagination :pageInfo="pageInfo" @current-change="pageChange"/>
        </div>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="bigImgUrl" alt="">
        </el-dialog>
    </div>
</template>
<script>
import uploadImg from '@/components/Public/uploadImg';
import request from "@/utils/request";
import myPagination from '@/components/Public/myPagination';
export default {
    name:'msgDetail',
    data(){
        return {
            warnig_id:'',
            memberId:0,
            dialogVisible:false,
            bigImgUrl:'',
            type:'',
            msgList:[],
            editMsgItem:{
                content:'',
                picsPath:[],
                picsId:[]
            },
            sendMsgDetail:{
                content:'',
                picsPath:[],
                picsId:[]
            },
            warningDetail:{
                threshold_keys:'',
                project_name:'',
                customs_name:'',
                warning_time:'',
                thresholds_name:'',
                feedback_time:''
            },
            pageInfo:{
				total:0,
				pageSize:10,
				currentPage:1,
            },
        }
    },
    created(){
        this.type = this.$route.query.type;
        this.warnig_id = this.$route.params.id;
        this.memberId = this.$store.getters.admin_detail.id;
        this.getMsgList();
        this.getWarningDetail();
    },
    methods:{
        // 预警警报详情
        getWarningDetail(){
            request(this.ajaxUrl.warningDetail + this.warnig_id,{

            },'get').then((res)=>{
                console.log(res,1111);
                this.warningDetail = {
                    threshold_keys:res.threshold_keys,
                    project_name:res.project&&res.project.name,
                    customs_name:res.project&&res.project.customs[0] && res.project.customs[0].company_name,
                    warning_time:res.waring_time,
                    first_sms_time:res.first_sms_time,
                    thresholds_name:res.thresholds_name
                }
                
            }).catch((err)=>{
                console.log(err)
            })
        },
        // 编辑消息 上传图片成功后
        afterUpload(response,idx){
            this.editMsgItem.picsId[idx] = response.id;
            this.editMsgItem.picsPath[idx] = response.path;
        },
        // 编辑消息 移除图片成功后
        afterRemove(idx){ 
            this.editMsgItem.picsId.splice(idx,1);
            this.editMsgItem.picsPath.splice(idx,1);
        },
        // 发送消息 上传图片成功后
        sendAfterUpload(response,idx){  
            this.sendMsgDetail.picsId[idx] = response.id;
            this.sendMsgDetail.picsPath[idx] = response.path;
        },
        // 发送消息 移除图片成功后
        sendAfterRemove(idx){
            this.sendMsgDetail.picsPath.splice(idx,1);
            this.sendMsgDetail.picsId.splice(idx,1);
        },
        handleDialog(imgItem){    //查看大图
            this.bigImgUrl = imgItem.path;
            this.dialogVisible = true;
        },
        //获取消息列表
        getMsgList(){  
            request(this.ajaxUrl.warningMsgist,{
                warnig_id:this.warnig_id,
                pageSize:this.pageInfo.pageSize,
                page:this.pageInfo.currentPage,
            },'get').then((res)=>{
                this.msgList = res.data.map((item,idx)=>{
                    item.isEdit = false;
                    
                    return item;
                });
                this.pageInfo.total = res.meta.total;
            }).catch((err)=>{
                console.log(err);
            })
        },
        pageChange(val){
            this.pageInfo.currentPage = val;
            this.getMsgList();
        },
        // 编辑消息
        handleEditMsg(msgItem){
            let childIdx;
            this.msgList.map((item,idx)=>{
                if(item.id != msgItem.id){
                    item.isEdit = false;
                }else{
                    childIdx = idx;
                }
            });
            this.$set(this.msgList[childIdx],'isEdit',true);
            // this.editMsgItem = JSON.parse(JSON.stringify(msgItem));
            this.editMsgItem = {
                content:msgItem.content,
                picsId:msgItem.pics_img.map((item)=>{return item.id}),
                picsPath:msgItem.pics_img.map((item)=>{return item.path})
            }
            console.log(this.editMsgItem);
        },
        // 编辑消息 - 上传图片
        handleEditUpload(){
            if(this.editMsgItem.picsId.length >= 10){
                this.$message.warning('最多只能上传10长图片');
                return;
            }
            this.editMsgItem.picsId.push('');
            this.editMsgItem.picsPath.push('');
        },
        // 发送消息 - 上传图片
        handleSendUpload(){
            if(this.sendMsgDetail.picsId.length >= 10){
                this.$message.warning('最多只能上传10长图片');
                return;
            }
            this.sendMsgDetail.picsId.push('');
            this.sendMsgDetail.picsPath.push('');
        },
        // 取消编辑消息
        handleCancleEdit(msgItem){
            msgItem.isEdit = false;
            this.editMsgItem = {};
        },
        // 确定编辑
        handleSaveEdit(msgItem,parentIdx){
            // this.$set(this.msgList,parentIdx,JSON.parse(JSON.stringify(this.editMsgItem)));
            this.msgList[parentIdx].isEdit = false;
            request(this.ajaxUrl.editWarningMsg + this.warnig_id + '/warnigssms/' + msgItem.id,{
                content:this.editMsgItem.content,
                pics:this.editMsgItem.picsId.join(',')
            },'patch').then((res)=>{
                this.$message.success('编辑成功');
                this.getMsgList();
            }).catch((err)=>{
                console.log(err)
            })
        },
        // 发送消息
        handleSendMsg(){
            let sendInfo = JSON.parse(JSON.stringify(this.sendMsgDetail));
            request(this.ajaxUrl.sendWarningMsg + this.warnig_id + '/warnigssms',{
                content:this.sendMsgDetail.content,
                pics:this.sendMsgDetail.picsId.join(',')
            },'post').then((res)=>{
                this.$message.success('发送成功');
                this.sendMsgDetail = {
                    content:'',
                    picsPath:[],
                    picsId:[]
                };
                this.getMsgList();
            }).catch((err)=>{
                console.log(err)
            })
        }
    },
    components:{
        uploadImg,
        myPagination
    }
}
</script>
<style lang="scss" scoped>
.msgDetail{
    font-size: 14px;
    .project-item{
        width: 100%;
        padding: 24px 22px;
        background-color: #fff;
        border-radius: 4px;
        margin-bottom: 20px;
        .item-title{
            margin-bottom: 20px;
            font-weight: 600;
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
                &:nth-of-type(5){
                    border-right: none;
                }
                &:nth-of-type(6){
                    border-right: none;
                }
                &:nth-of-type(7){
                    border-right: none;
                }
            }
        }
        .feedback{
            width: 100%;
            height: 44px;
            line-height: 44px;
            font-size: 14px;
            color: #249e69;
            background-color: #e9f9f2;
            border: 1px solid #89e2bb;
            padding-left: 12px;
            border-radius: 4px;
            cursor: pointer;
        }
        .msg-list{
            border: 1px solid #e4e4e4;
            margin-top: 20px;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            max-height:600px;
            overflow-y: auto;
            .msg-item{
                display: flex;
                border-bottom: 1px solid #e4e4e4;
                &:nth-last-of-type(1){
                    border-bottom: none;
                }
                .user-info{
                    width: 110px;
                    background-color: #f5f5f5;
                    .user-img{
                        width: 70px;
                        height: 70px;
                        box-sizing: border-box;
                        border: 1px solid #e4e4e4;
                        padding: 3px;
                        margin: 0 auto;
                        margin-top: 20px;
                        >img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .user-name{
                        text-align: center;
                        padding: 0 10px;
                        margin-top: 12px;
                    }
                }
                .msg-info{
                    flex: 1;
                    padding: 30px 15px 20px 20px;
                    .text-msg{
                        padding-right: 20%;
                    }
                    .img-msg{
                        margin-top: 30px;
                        font-size: 0;
                        img{
                            width: 100px;
                            height: 100px;
                            margin-right: 10px;
                        }
                    }
                    .edit-img-msg{
                        margin-top: 30px;
                        font-size: 0;
                        display: flex;
                        flex-wrap: wrap;
                        .edit-img-box{
                            display: inline-block;
                            border: 1px dashed #ddd;
                            width: 100px;
                            height: 100px;
                            margin-right: 10px;
                            margin-bottom: 10px;
                        }
                    }
                    .msg-footer{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 15px;
                        height: 32px;
                        .msg-time{
                            font-size: 12px;
                            color: #888888;
                        }
                    }
                }
            }
        }
        .send-msg-box{
            margin-top: 20px;
            .send-msg-content{
                border: 1px solid #e4e4e4;
                border-radius: 4px;
                padding: 10px;
                /deep/.el-textarea{
                    &.no-border{
                        textarea{
                            border: none;
                            padding-left: 0;
                        }
                    }
                }
                .send-img{
                    width: 100%;
                    margin-top: 10px;
                    display: flex;
                    flex-wrap: wrap;
                    .send-img-box{
                        border: 1px dashed #ddd;
                        width: 100px;
                        height: 100px;
                        margin-right: 10px;
                        margin-bottom: 10px;
                        line-height: 100px;
                    }
                }
            }
            .send-msg-btn{
                margin-top: 20px;
            }
        }
    }
}
</style>

