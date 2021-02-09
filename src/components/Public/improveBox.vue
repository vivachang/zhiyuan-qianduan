<template>
    <div class="suggest-box">
        <div class="content-box">
            <div class="suggest-content">
                <div class="title">改善建议</div>
                <div class="content">
                    {{warningDetail.warning_msg}}
                </div>
            </div>
            <div class="suggest-img">
                <img :src="warningDetail.path" alt="">
            </div>
        </div>
        <div class="suggest-close">
            <el-button class="close-btn" size="small" type=primary @click="handleClose">关闭</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name:'improveBox',
    props:['warningDetail'],
    data(){
        return {

        }
    },
    methods:{
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
        width: 100%;
        display: flex;
        justify-content: space-between;
        >div{
            height: 393px;
            &.suggest-content{
                flex: 1;
                padding-right: 75px;
                display:flex;
                flex-direction: column;
                .title{
                    font-size: 36px;
                    font-weight: 600;
                    color: #fff;
                }
                .content{
                    font-size: 20px;
                    color: #acacb1;
                    margin-top: 60px;
                    flex: 1;
                    overflow-y: auto;
                }
            }
            &.suggest-img{
                width: 393px;
                border: 1px solid #653de7;
                padding: 12px;
                >img{
                    width: 100%;
                    height: 100%;
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
