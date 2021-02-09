<template>
<div class="mySlider">
    <div class="mslider-box">
        <div class="block">
            <el-slider
            v-model="defaultValue"
            @change="handleChange"
            range
            :step="step || 0.01"
            :min="min"
            :max="max">
            </el-slider>
        </div>
        <div class="left" :style="{width:((defaultValue[0]-min)/(max-min)*100) + '%'}"></div>
        <div class="right" :style="{width:((max-defaultValue[1])/(max-min)*100) + '%'}"></div>
    </div>
    <div class="value-txt min-value">{{min || 0}}</div>
    <div class="value-txt max-value">{{max || 1}}</div>
</div>
</template>
<script>
export default {
    name:'mySlider',
    props:['value','min','max','step','idx'],
    data(){
        return {
            defaultValue:[]
        }
    },
    mounted(){
        this.defaultValue = [...this.value]
    },
    methods:{
        handleChange(newValue){
            this.$emit('change',newValue,(this.idx||0));
        }
    }
}
</script>



<style rel="stylesheet/scss" lang="scss">
.mySlider{
    width: 100%;
    position: relative;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .mslider-box{
        width: 100%;
        position: relative;
        .left,.right{
            height: 10px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
        }
        .left{
            left: 0;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
            background: #29cc85;
        }
        .right{
            right: 0;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
            background: #ff5e5e;
        }
    }
    .value-txt{
        font-size: 12px;
        color: #9d9d9d;
    }
}
    
</style>
