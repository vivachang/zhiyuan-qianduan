<template>
    <div class="earthVideo">
        <video ref="earth" :src="path" autoplay loop muted></video>
    </div>
</template>
<script>
import earth from '@/static/Main_1.mp4'
export default {
    name:'earthVideo',
    data(){
        return {
            path:earth,
            timer:null
        }
    },
    beforeDestroy(){
        clearInterval(this.timer);
    },
    mounted(){
        this.timer = setInterval(()=>{
            // console.log(this.$refs.earth.currentTime,222);
            let currentTime = this.$refs.earth.currentTime;
            if(currentTime>=39.9){
                this.$refs.earth.currentTime=1;
            }
        },60)
        // this.$refs.earth.currentTime = 10;
    },
}
</script>


<style rel="stylesheet/scss" lang="scss">
.earthVideo{
    width: 100%;
    height: 100%;
    pointer-events: none;
    // padding-left: 10%;
    // .a-enter-vr{
    //     display: none !important;
    // }
    // canvas{
    //     pointer-events: none;
    // }
}
</style>