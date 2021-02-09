<template>
    <div class="newEarth" v-html="html">
        
    </div>
</template>
<script>
import {initEarth} from '@/utils/initEarth.js'
import earthBg from '@/static/img/newEarth.jpg'
export default {
    name:'newEarth',
    data(){
        return {
            html:`<a-scene>
                    <a-camera position='0 0 3' user-height='0'></a-camera>
                    <a-sphere src="${earthBg}" radius="1.8" segments-height="83"> 
                        <a-animation attribute="rotation"
                        dur="20000"
                        fill= "forwards"
                        to="0 -360 0"
                        easing="linear"
                        repeat="indefinite"></a-animation>
                    </a-sphere>
                </a-scene>`
        }
    },
    beforeDestroy(){
        this.html = '';
    },
    mounted(){
        setTimeout(()=>{
            initEarth();

        },500);
    },
}
</script>


<style rel="stylesheet/scss" lang="scss">
.newEarth{
    width: 100%;
    height: 100%;
    padding-left: 10%;
    .a-enter-vr{
        display: none !important;
    }
    canvas{
        pointer-events: none;
    }
}
</style>