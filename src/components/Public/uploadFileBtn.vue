<template>
    <div class="uploadFileBtn">
        <el-upload
            class="upload-demo"
            ref="uploadBtn"
            action="https://jsonplaceholder.typicode.com/posts/"
            :http-request="handleUpload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :limit="1"
            :on-exceed="handleExceed">
            <el-button size="small">{{btn}}</el-button>
        </el-upload>
    </div>
</template>
<script>
import {uploadFile} from "@/utils/tool.js"
import axios from 'axios';
export default {
    name:'uploadFileBtn',
    props:['btn','url'],
    data(){
        return {
            fileList:[]
        }
    },
    methods:{
        handleUpload(event){
            const data = new FormData();
            data.append('file',event.file);
            axios.post(this.url,data,{
                headers:{
                    'Content-Type': 'multipart/form-data',
                    'Authorization':'Bearer ' + sessionStorage.getItem('token')
                }
            }).then((res)=>{
                this.$emit('afterUpload',res);
                this.$refs.uploadBtn.clearFiles();
            }).catch((err)=>{
                console.log(err.response);
                this.$message.warning(err.response.data.message);
                this.$refs.uploadBtn.clearFiles();
            });
        },
        handlePreview(){
            console.log(file);
        },
        handleRemove(){

        },
        beforeRemove(){

        },
        handleExceed(){

        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.uploadFileBtn{
    display: inline-block;
    /deep/.el-upload-list--text{
        display: none;
    }
}
</style>

