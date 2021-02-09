<template>
    <div class="monitorPosition" click="$event.preventDefault()">
        <div class="imgBox">
            <img :src="options.img" alt="">
            <!-- <div class="dot other-dot" v-for="item in options.others" :key="item.id" :style="{left:item.left,top:item.top}"></div> -->
            <!-- <div class="dot default-dot" ref="defaultDot" :style="defaultPosition"></div> -->
            <i class="icon icon-other-position dot other-dot" v-for="item in options.others" :key="item.id" :style="{left:item.left,top:item.top}"></i>

            <i class="icon icon-my-position dot default-dot" ref="defaultDot" :style="defaultPosition"></i>
        </div>
        <div class="btnBox">
            <el-button type="primary" @click="handleSure">确定</el-button>
            <el-button @click="handleCancle">取消</el-button>
        </div>
    </div>
</template>
<script>
import { moveDom, getDomCoordinates } from '@/utils/tool.js'
export default {
    name:'dialogCom',
    props:['options'],
    data(){
        return {
            // defaultPosition:{
            //     left:this.options.position.left || '50%',
            //     top:this.options.position.top || '50%',
            // }
        }
    },
    mounted(){
        moveDom(this.$refs.defaultDot);
    },
    updated(){
        
    },
    computed:{
        defaultPosition(){
            return {
                left:this.options.position.left || '50%',
                top:this.options.position.top || '50%',
            }
        }
    },
    methods:{
        handleSure(){
            this.$emit('determine',getDomCoordinates(this.$refs.defaultDot))
        },
        handleCancle(){
             this.$emit('determine')
        }
    }
}
</script>
<style  rel="stylesheet/scss" lang="scss" scoped>
    .monitorPosition{
        .imgBox{
            position: relative;
             -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            background-color: #080941;
            margin-bottom: 20px;
            margin-top: 10px;
            >img{
                width: 100%;
            }
            .dot{
                position: absolute;
                &.default-dot{
                    
                }
                &.other-dot{
                    left: 0;
                    top: 0;
                }
            }
        }
        .btnBox{
            text-align: center;
        }
    }
</style>