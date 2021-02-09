<template>
    <div class="suggest-box">
        <div class="content-box">
            <ul class="msg-list">
                <li class="msg-item" v-for="msgItem in warningMsgList" :key="msgItem.msgId">
                    <div class="user-info">
                        <div class="user-img">
                            <img :src="msgItem.user.img && msgItem.user.img.path || 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595009992994&di=f5efa6f786d5c7e328b04c92d0aa1883&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201410%2F09%2F20141009224754_AswrQ.jpeg'" alt="">
                        </div>
                        <p class="user-name">{{msgItem.user.truename}}</p>
                    </div>
                    <div class="msg-info">
                        <p class="text-msg">{{msgItem.content}}</p>
                        <div class="img-msg">
                            <img v-for="(imgItem,idx) in msgItem.pics_img" :key="idx" @click="handleDialog(imgItem)" :src="imgItem.path" alt="">
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="suggest-close">
            <el-button class="close-btn" size="small" type=primary @click="handleClose">关闭</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name:'newImproveBox',
    props:['warningMsgList'],
    data(){
        return {
            bigImgUrl:'',
            dialogVisible:false
        }
    },
    methods:{
        handleDialog(imgItem){    //查看大图
            this.$emit('showBig',imgItem.path);
        },
        handleClose(){
            this.$emit('close');
        }
    }
}
</script>
<style lang="scss" scoped>
.suggest-box{
    width: 100%;
    height: 552px;
    background-color: #0e0e2f;
    border: 1px solid #613be0;
    box-shadow: 0px 0px 20px #613be0;
    box-sizing: border-box;
    padding: 60px 50px 30px 70px;
    .content-box{
        max-height: calc(100% - 88px);
        overflow-y: auto;
        .msg-list{
            border: 1px solid #613be0;
            margin-top: 20px;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            .msg-item{
                display: flex;
                border-bottom: 1px solid #613be0;
                color: #613be0;
                &:nth-last-of-type(1){
                    border-bottom: none;
                }
                .user-info{
                    width: 110px;
                    background-color: #0e0e2f;
                    .user-img{
                        width: 70px;
                        height: 70px;
                        box-sizing: border-box;
                        border: 1px solid #613be0;
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
    }
    .suggest-close{
        margin-top: 20px;
        .close-btn{
            width: 110px;
            height: 38px;
            font-size: 16px;
            color: #fff;
        }
    }
}
</style>


