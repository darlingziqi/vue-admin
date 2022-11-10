<template>
    <!-- 容器 -->
    <div ref="chart" class="chart">
    </div>
</template>
  
<script>
//必须这么写 否则报错
import * as echarts from "echarts"
export default {
    name: 'LineChart',
    mounted() {
        //初始化echarts实例
        let lineChart = echarts.init(this.$refs.chart)
        //配置数据
        lineChart.setOption({
            xAxis: {
                //隐藏x轴
                show: false,
                //不加的话会是一条直线，不是折线
                type: "category"
            },
            yAxis: {
                show: false
            },
            series: [
                {
                    type: "line",
                    data: [43, 17,23,32,54,12,29, 4, 40],
                    //拐点的样式的设置
                    itemStyle: {
                        opacity: 0
                    },
                    //线条的样式
                    lineStyle: {
                        color: "purple",
                    },
                    //填充颜色的设置
                    areaStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'purple' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#fff' // 100% 处的颜色
                            }],
                        }
                    },
                    //拐点平滑
                    smooth:true
                },

            ],
            //布局
            grid: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
        })
    }
}
</script>
  
<style scoped>
.chart {
    width: 100%;
    height: 100%
}
</style>
  