<template>
<div class="large">
    <!-- <div class="largeLayout"> -->
        <h3 class="largeLayout-top">
            健康空气实时监测系统
            <span v-show="showBack" class="goBack" @click="handleGoBack"><i class="icon icon-go-back"></i> <span>返回</span></span>
            <span class="exitFull" @click="handleToIndex"><i class="icon icon-exit-full"></i> <span>退出全屏</span></span>
        </h3>
        <h5 class="center-time">{{time}}</h5>
    <!-- </div> -->
    <div class="largeContent">
        <transition name="fade-transform" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</div>
    
</template>
<script>
import { exitFullScreen,fullScreen } from '@/utils/tool.js';
// import { fullScreen } from '@/utils/tool.js'
import moment from 'moment';
export default {
    name:'largeLayout',
    data(){
        return {
            showBack:this.$route.name !== 'largeIndex',
            time:moment().format('YYYY/MM/DD HH:mm:ss')
        }
    },
    beforeDestroy(){
        document.getElementsByTagName('body')[0].className = '';
        document.getElementsByTagName('html')[0].className = '';
    },
    mounted(){
        // fullScreen();
        setInterval(()=>{
            this.time = moment().format('YYYY/MM/DD HH:mm:ss');
        },1000);
        document.getElementsByTagName('body')[0].className +=' largeSizeBody';
    },
    methods:{
        // 返回首页
        handleToIndex(){
            exitFullScreen();
            this.$router.push({name:'Home'});
        },
        // 返回
        handleGoBack(){
            this.$router.go(-1);
        }
    },
    watch:{
        '$route':function(){
            if(this.$route.name === 'largeIndex'){
                this.showBack = false
            }else{
                this.showBack = true
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.largeLayout{
    width: 100%;
    height: 136px;
    background: url('../../static/img/large-header.png') no-repeat center center/100% 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 11;
    overflow: hidden;
}
.largeLayout-top{
    width: 100%;
    height: 67px;
    line-height: 87px;
    font-weight: 600;
    font-size: 36px;
    margin: 0;
    position: fixed;
    background: url('../../static/img/large-header-top.png') no-repeat center center/100% 100%;
    top: 0;
    left: 0;
    text-align: center;
    color: #fff;
    z-index: 12;
    >span{
        position: absolute;
        font-size: 24px;
        cursor: pointer;
        >i{
            margin-right: 10px;
            vertical-align: middle;
        }
        >span{
            vertical-align: middle;
        }

    }
    >.goBack{
        left: 5%;
        line-height: 63px;
        font-size: 20px;
        font-weight: normal;
    }
    >.exitFull{
        right: 5%;
        line-height: 63px;
        font-size: 20px;
        font-weight: normal;
    }
}
.center-time{
    width: 763px;
    height: 63px;
    line-height: 55px;
    font-weight: 600;
    font-size: 20px;
    background: url('../../static/img/large-header-bottom.png') no-repeat center center/100% 100%;
    margin: 0;
    display: inline-block;
    position: fixed;
    top: 67px;
    left: 50%;
    text-align: center;
    color: #fff;
    transform: translateX(-50%);
    z-index: 12;
}
.largeContent{
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: url('../../static/img/large-content-bg.png') no-repeat center center/cover;
}
</style>
