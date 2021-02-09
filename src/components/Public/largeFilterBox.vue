<template>
    <div class="largeFilterBox" :class="size">
        <ul class="type-filter">
            <li :class="activeType==='formaldehyde' ? 'on' : ''" @click="handleChangeType('formaldehyde')">甲醛</li>
            <li :class="activeType==='TVOC' ? 'on' : ''" @click="handleChangeType('TVOC')">TVOC</li>
            <template v-if="others">
                <li :class="activeType==='PM25' ? 'on' : ''" @click="handleChangeType('PM25')">PM2.5</li>
                <li :class="activeType==='CO2' ? 'on' : ''" @click="handleChangeType('CO2')">CO2</li>
                <li :class="activeType==='temperature' ? 'on' : ''" @click="handleChangeType('temperature')">温度</li>
                <li :class="activeType==='humidity' ? 'on' : ''" @click="handleChangeType('humidity')">湿度</li>
            </template>
        </ul>
        <ul class="time-filter">
            <li :class="activeTime==='today' ? 'on' : ''" @click="handleChangeTime('today')">今天</li>
            <li :class="activeTime==='thirdDay' ? 'on' : ''" @click="handleChangeTime('thirdDay')">最近三天</li>
            <li :class="activeTime==='sevenDay' ? 'on' : ''" @click="handleChangeTime('sevenDay')">最近7天</li>
            <li :class="activeTime==='thirdtyDay' ? 'on' : ''" @click="handleChangeTime('thirdtyDay')">最近30天</li>
            <li :class="activeTime==='userDefined' ? 'on' : ''" @click="handleChangeTime('userDefined')">
                自定义
                <el-date-picker
                    class="userDefined"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm"
                    @change="handleDefined"
                    v-model="definedTime"
                    :picker-options="pickerOptionsDay"
                    size="small"
                    type="datetimerange"
                    :default-time="['00:00:00','23:59:59']"
                    range-separator="~"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>  
            </li>
        </ul>
    </div>
</template>
<script>
import moment from 'moment';
export default {
    name:'largeFilterBox',
    props:['size','others'],
    data(){
        return {
            activeType:'formaldehyde',
            activeTime:'today',
            timeRange:{
                startTime:moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                endTime:moment().format('YYYY-MM-DD HH:mm:ss')
            },
            definedTime:[],
            pickerOptionsDay:{
                disabledDate(time) {
                    return time.getTime() > moment() || time.getTime() < moment().subtract(1, 'year');
                }
            },
            timeObj:{
                today:moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                thirdDay:moment().subtract(2,'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                sevenDay:moment().subtract(6,'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                thirdtyDay:moment().subtract(29,'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                userDefined:''
            }
            
        }
    },
    methods:{
        // 选择 类型
        handleChangeType(type){
            this.activeType = type;
            this.$emit('filterChange',this.activeType,this.timeRange);
        },
        // 选择  时间
        handleChangeTime(time){
            // console.log(this.timeObj[time])
            if(time!='userDefined'){
                this.activeTime = time;
                this.timeRange.startTime = this.timeObj[time];
                this.timeRange.endTime = moment().format('YYYY-MM-DD HH:mm:ss');
                this.$emit('filterChange',this.activeType,this.timeRange);
            }
        },
        handleDefined(time){
            this.timeRange.startTime = time[0];
            this.timeRange.endTime = time[1];
            this.activeTime = 'userDefined';
            this.$emit('filterChange',this.activeType,this.timeRange);
        }
    }
}
</script>
<style lang="scss" scoped>
.largeFilterBox{
    display: flex;
    justify-content: space-between;
    >ul{
        display: flex;
        li{
            height: 50px;
            padding: 0 25px;
            color: #545464;
            background-color: #131544;
            border: 1px solid transparent;
            font-size: 16px;
            position: relative;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            &:nth-of-type(1){
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
            }
            &:last-of-type{
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
            }
            &.on{
                border-color: #3a3974;
                background-color: #15153c;
                color: #b1aeea;
            }
            .userDefined{
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                opacity: 0;
            }
        }
    }
    &.small{
        ul{
            li{
                height: 36px;
                font-size: 14px;
            }
        }
    }
}
</style>

