<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>销售额类别占比</span>
            <div style="float: right;">
                <el-radio-group v-model="activeName" size="medium">
                    <el-radio-button label="全部渠道"></el-radio-button>
                    <el-radio-button label="线上"></el-radio-button>
                    <el-radio-button label="门店"></el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <div class="charts" ref="charts"></div>
    </el-card>
</template>
<script>
import * as echarts from "echarts"
export default {
    name: "Category",
    data() {
        return {
            activeName: '全部渠道'
        }
    },
    mounted() {
        let chart = echarts.init(this.$refs.charts)
        chart.setOption({
            title: {
                text: "Search Engine",
                subtext: "1048",
                left: "center",
                top: "center"
            },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        position: 'outside'
                    },
                    labelLine: {
                        show: true
                    },
                    data: [
                        { value: 1048, name: 'Search Engine' },
                        { value: 735, name: 'Direct' },
                        { value: 580, name: 'Email' },
                        { value: 484, name: 'Union Ads' },
                        { value: 300, name: 'Video Ads' }
                    ]
                }
            ]
        })
        chart.on('mouseover', function (params) {
            chart.setOption({
                title: {
                    text: params.data.name,
                    subtext: params.value
                }
            })
        });
    },
}
</script>
<style scoped>
.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}

.box-card {
    width: 100%;
}

.clearfix {
    height: 36px;
    line-height: 36px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;


}


.charts {
    width: 100%;
    height: 250px;
}
</style>