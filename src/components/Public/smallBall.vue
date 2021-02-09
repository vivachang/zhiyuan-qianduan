<template>
<!--  -->
    <div class="smallBall" :class="color[tag] || color[1]">
        <div class="ball-content">
            <div class="wave-front":class="color[tag] || color[1]"></div>
            <div class="wave-back":class="color[tag] || color[1]"></div>
        </div>
        <div class="ball-bg">
            <img src="@/static/img/ball-green.png" alt="">
            <img src="@/static/img/ball-yellow.png" alt="">
            <img src="@/static/img/ball-red.png" alt="">
        </div>
    </div>
</template>
<script>
export default {
    name:'smallBall',
    props:['tag'],
    created(){
        
    },
    data(){
        return {
            color:{
                '1':'green',
                '2':'yellow',
                '3':'red'
            }
        }
    },
    methods:{

    }
}
</script>
<style lang="scss" scoped>
.smallBall{
    margin: 0 auto;
    width: 30px;
    height: 30px;
    position: absolute;
    .ball-content{
        width: 22px;
        height: 22px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        border-radius: 50%;
        overflow: hidden;
        z-index: 8;
        .wave-front{
            width: 300px;
            height: 30px;
            position: absolute;
            bottom: 0;
            z-index: 2;
            transform: translateX(0px);
            animation:move_front 12s linear infinite;
            &::before{
                content:'';
                position: absolute;
                left: 0;
                top: -8px;
                height: 8px;
                width: 100%;
            }
            &.green{
                background-color: #058837;
                height: 40%;
                &::before{
                    background: url(../../static/img/wave-green-front.png) repeat-x center center/auto 100%;
                }
            }
            &.yellow{
                background-color: #fd6501;
                height: 55%;
                &::before{
                    background: url(../../static/img/wave-yellow-front.png) repeat-x center center/auto 100%;
                }
            }  
            &.red{
                background-color: #ee2518;
                height: 70%;
                &::before{
                    background: url(../../static/img/wave-red-front.png) repeat-x center center/auto 100%;
                }
            }  
        }
        .wave-back{
            width: 500px;
            height: 30px;
            position: absolute;
            bottom: 0;
            z-index: 1;
            transform: translateX(-70%);
            animation:move_back 12s linear infinite;
            &::before{
                content:'';
                position: absolute;
                left: 0;
                top: -8px;
                height: 8px;
                width: 100%;
            }
            &.green{
                background-color: #0b4b23;
                height: 40%;
                &::before{
                    background: url(../../static/img/wave-green-back.png) repeat-x center center/auto 100%;
                }
            }
            &.yellow{
                background-color: #8d3b05;
                height: 55%;
                &::before{
                    background: url(../../static/img/wave-yellow-back.png) repeat-x center center/auto 100%;
                }
            }  
            &.red{
                background-color: #871825;
                height: 70%;
                &::before{
                    background: url(../../static/img/wave-red-back.png) repeat-x center center/auto 100%;
                }
            }
        }
    }
    .ball-bg{
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        position: absolute;
        z-index: 9;
        >img{
            width: 100%;
            height: 100%;
            display: none;
        }
        .status-text{
            font-size: 20px;
            color: #fff;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
        }
    }
    &.green{
        .ball-bg{
            >img:nth-of-type(1){
                display: block;
            }
        }
    }
    &.yellow{
        .ball-bg{
            >img:nth-of-type(2){
                display: block;
            }
        }
    }
    &.red{
        .ball-bg{
            >img:nth-of-type(3){
                display: block;
            }
        }
    }
}
@keyframes move_front{
    0%{
        transform: translateX(0px);
    }
    100%{
        transform: translateX(-70%);
    }
}
@keyframes move_back{
    0%{
        transform: translateX(-70%);
    }
    100%{
        transform: translateX(0px);
    }
}
</style>

