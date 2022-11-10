<template>
    <!-- 容器 -->
    <div ref="chart" class="chart">
    </div>
</template>
  
<script>
//必须这么写 否则报错
import * as echarts from "echarts"
export default {
    name: 'BarChart',
    mounted() {
        //初始化echarts实例
        let lineChart = echarts.init(this.$refs.chart)
        //配置数据
        lineChart.setOption({
            xAxis: {
                //隐藏x轴
                show: false,

                min:0,
                max:100
            },
            yAxis: {
                show: false,
                type: "category"

            },
            series: [
                {
                    type: "bar",
                    data: [78],
                    color:"yellowgreen",
                    barWidth:20,
                    showBackground:true,
                    backgroundStyle:{
                        color:"#eee"
                    },
                    label:{
                        show:true,
                        formatter:"|",
                        position:"right"
                    }
                }
            ],
            //布局
            grid: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            },
            //提示信息
            tooltip:{}
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
  