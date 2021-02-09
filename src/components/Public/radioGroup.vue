<template>
    <ul class="radioGroup" :class="this.size">
        <!-- <li :class="{'on':active===1}" @click="handleClick(1)">本周</li> -->
        <li :class="{'on':active===2}" @click="handleClick(2)">本月</li>
        <li :class="{'on':active===3}" @click="handleClick(3)">本年</li>
        <li :class="{'on':active===4}" @click="handleClick(4)">全部</li>
    </ul>
</template>

<script>
export default {
    name:"radioGroup",
    // props:['size','timeType'],
    props:{
        size:{
            type:String,
            default:''
        },
        timeType:{
            type:Number,
            default:2
        }
    },
    data(){
        return {
            active:this.timeType
        }
    },
    mounted(){
        
    },
    methods:{
        handleClick(timeType){
            this.active = timeType;
            this.$emit('change',this.active);
        },
        reset(){
            this.active = "";
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.radioGroup{
    display: flex;
    width: 100%;
    height: 32px;
    background-color: #fff;
    li{
        flex: 1;
        line-height: 30px;
        box-sizing: border-box;
        color: #757575;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        border-left: 1px solid #ddd;
        text-align: center;
        font-size: 14px;
        cursor: pointer;
        &:nth-of-type(1){
            border-left: 1px solid #dddddd;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
        }
        &:nth-last-of-type(1){
            border-right: 1px solid #ddd;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
        };
        &.on{
            border-color: #5a66ff;
            border-right: 1px solid #5a66ff;
            & + li{
                border-left: none;
            }
        }
    }
    &.small{
        height: 24px;
        li{
            line-height: 22px;
            font-size: 12px;
        }
    }
    &.middle{
        height: 32px;
        li{
            line-height: 30px;
            font-size: 14px;
        }
    }
}
</style>
