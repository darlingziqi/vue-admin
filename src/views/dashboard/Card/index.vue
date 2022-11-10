<template>
    <div>
        <el-row class="row">
            <el-col :span="6">
                <el-card>
                    <Detail title="总销售额" count="￥ 126560">
                        <template v-slot:charts>
                            <span v-html="'周同比&nbsp;&nbsp;56.67%'"></span>
                            &nbsp;&nbsp;
                            <svg t="1667612495595" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3697" width="16" height="16"><path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z" p-id="3698" fill="#d81e06"></path></svg>
                            <span v-html="'&nbsp;&nbsp;日同比&nbsp;&nbsp;19.16%'"></span>
                            &nbsp;&nbsp;
                            <svg t="1667612585297" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4729" width="16" height="16"><path d="M941.808046 195.931415 512 828.068585 82.191954 195.931415Z" p-id="4730" fill="#1afa29"></path></svg>
                        </template>
                        <template v-slot:footer>
                            日销售额￥ 12423
                        </template>
                    </Detail>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <Detail title="访问量" count="88460">
                        <template v-slot:charts>
                            <LineChart></LineChart>
                        </template>

                        <template v-slot:footer>
                            日访问量 1234
                        </template>
                    </Detail>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <Detail title="支付笔数" count="88460">
                        <template v-slot:charts>
                            <BarChart></BarChart>
                        </template>
                        <template v-slot:footer>
                            转化率 65%
                        </template>
                    </Detail>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <Detail title="运营活动效果" count="78%">
                        <template v-slot:charts>
                            <ProgressChart></ProgressChart>
                        </template>
                        <template v-slot:footer>
                            <span v-html="'周同比&nbsp;&nbsp;56.67%'"></span>
                            &nbsp;&nbsp;
                            <svg t="1667612495595" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3697" width="16" height="16"><path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z" p-id="3698" fill="#d81e06"></path></svg>
                            <span v-html="'&nbsp;&nbsp;日同比&nbsp;&nbsp;19.16%'"></span>
                            &nbsp;&nbsp;
                            <svg t="1667612585297" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4729" width="16" height="16"><path d="M941.808046 195.931415 512 828.068585 82.191954 195.931415Z" p-id="4730" fill="#1afa29"></path></svg>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
  
<script>
import Detail from "./Detail"

import LineChart from "./lineChart"
import BarChart from "./barChart"
import ProgressChart from "./progressChart"
export default {
    name: 'Card',
    components: {
        Detail,
        LineChart,
        BarChart,
        ProgressChart
    }
}
</script>
  
<style scoped>
</style>
  