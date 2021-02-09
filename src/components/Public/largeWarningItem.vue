<template>
    <div class="largeWarningItem">
        <div class="warning-title">
            <div class="title-left">
                <i class="icon icon-warning"></i>
                <span :title="info.threshold_keys + '超标' || '未知预警事件'">{{(info.threshold_keys||'未知监测项') + '超标' || '未知预警事件'}}</span>
            </div>
            <div class="title-right">
                <i class="icon icon-chat" v-if="info.isnew===1" @click.stop="handleEmit"></i>
            </div>
        </div>
        <div class="warning-content">
            <p>{{info.project && info.project.name || '未知项目'}}</p>
            <p>{{info.projects_positions && info.projects_positions.area.area_name || '未知区域'}}</p>
            <p>{{info.projects_positions && info.projects_positions.name || '未知监测点'}}</p>
            <div class="footer-time">
                {{info.waring_time || '未知时间'}}
            </div>
        </div>
    </div>
</template>
<script>
import improveBox from '@/components/Public/improveBox';
export default {
    name:'largeWarningItem',
    props:['info'],
    components:{
        improveBox
    },
    data(){
        return {
            suggestVisible:false
        }
    },
    methods:{
        handleEmit(){
            this.$emit('chatMsg',this.info);
        }
    }
}
</script>
<style lang="scss" scoped>
.largeWarningItem{
    width: 100%;
    .warning-title{
        height: 50px;
        line-height: 50px;
        padding-left: 30px;
        padding-right: 18px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        // background: linear-gradient(to right,#1c1c3e,#121130); /* 标准语法 */
        // background-color: #f04641;
        background-color: rgba(23,18,48,0.6);
        .title-left{
            color: #f04641;
            font-size: 18px;
            white-space: nowrap;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            >span{
                vertical-align: middle;
            }
            >i{
                vertical-align: middle;
            }
        }
        .title-right{
            margin-left: 15px;
            i{
                cursor: pointer;
            }
        }
    }
    .warning-content{
        padding: 2.7vh 18px 0 30px;
        // background:linear-gradient(to right,#0f1233,#121130,0.7);
        background-color: rgba(18,17,48,0.5);
        >p{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #fff;
            font-size: 14px;
            margin-bottom: 5px;
        }
        .footer-time{
            color: #4e526d;
            // line-height: 4.6vh;
            height: 4.6vh;
            border-top: 1px solid #787887;
            font-size: 14px;
            margin-top: 15px;
            display: flex;
            align-items: center;
        }
    }
}
</style>


