<template>
    <div class="uploadImg">
        <el-upload
            class="region-uploader"
            action=""
            :http-request="handleUpload"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload">
            <img v-if="basiceImg" :src="basiceImg" style="background:#080941;" class="avatar" @click.stop="handleShowBig(basiceImg)">
            <i v-else slot="default" class="el-icon-plus"></i>
        </el-upload>
        <div class="close-btn" v-show="basiceImg" v-if="removeBtn" @click.stop="handleRemove"></div>
        <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
            <img width="100%" :src="bigImgUrl" alt="" style="background:#080941;">
        </el-dialog>
    </div>
</template>
<script>
import {uploadFile} from "@/utils/tool.js"
export default {
    name:'uploadImg',
    props:{
        imgUrl:{
            type:String,
            default:''
        },
        idx:{
            type:Number,
            default:0
        },
        removeBtn:{
            type:Boolean,
            default:true
        }
    },
    data(){
        return {
            dialogVisible:false,
            bigImgUrl:'',
            basiceImg:''
        }
    },
    created(){
        this.basiceImg = this.imgUrl;
    },
    beforeDestroy(){
        
    },
    methods:{
        handleUpload(event){  //上传图片
            uploadFile(event.file)
                .then((res)=>{
                    this.basiceImg = res.path;
                    this.$emit('afterUpload',res,this.idx);
                }).catch((err)=>{
                    console.log(err);
                })
        },
        beforeAvatarUpload(file){   //上传之前验证格式
            const isTYPE = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isTYPE) {
                this.$message.error('上传图片只能是 JPG或PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isTYPE&&isLt2M
        },
        handleShowBig(url){     //查看大图
            this.bigImgUrl = url;
            this.dialogVisible = true;
        },
        handleRemove(){  //移除图片
            this.basiceImg = '';
            this.$emit('afterRemove',this.idx);
        },

    },
    watch:{
        imgUrl(newUrl,oldUrl){
            this.basiceImg = newUrl;
        }
    }
}
</script>
<style lang="scss" scoped>
.uploadImg{
    width: 100%;
    height: 100%;
    position: relative;
    .region-uploader{
        text-align: center;
        width: 100%;
        height: 100%;
        /deep/.el-upload--text{
            width: 100%;
            height: 100%;
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
    .close-btn{
        width: 16px;
        height: 16px;
        position: absolute;
        top: -8px;
        right: -8px;
        background: url("../../static/icon/icon-close.png") no-repeat center center/100% 100%;
        cursor: pointer;
    }
}
</style>


