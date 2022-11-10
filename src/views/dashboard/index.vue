<template>
  <div>
    <Card></Card>
    <el-card class="box-card" style="margin: 10px 0;">
      <div slot="header" class="clearfix">
        <el-tabs v-model="activeName" @tab-click="handleClick" class="tab">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visit"></el-tab-pane>
        </el-tabs>
        <div class="right">
          <span @click="day">今日</span>
          <span @click="week">本周</span>
          <span @click="month">本月</span>
          <span @click="year">本年</span>
          <el-date-picker v-model="date" value-format="yyyy-MM-dd" type="daterange" align="right" unlink-panels
            range-separator="-" size="mini" start-placeholder="开始日期" end-placeholder="结束日期"
            style="width: 300px; margin-left: 10px;">
          </el-date-picker>
        </div>

      </div>
      <div>
        <el-row>
          <el-col :span="18">
            <!-- 容器 -->
            <div class="charts" ref="charts"></div>
          </el-col>
          <el-col :span="6">
            <h3>门店{{ title }}排名</h3>
            <ul>
              <li>
                <span class="black">1</span>
                <span>肯德基</span>
                <span class="liright">323,234</span>
              </li>
              <li>
                <span class="black">2</span>
                <span>肯德基</span>
                <span class="liright">323,234</span>
              </li>
              <li>
                <span class="black">3</span>
                <span>肯德基</span>
                <span class="liright">323,234</span>
              </li>
              <li>
                <span>4</span>
                <span>肯德基</span>
                <span class="liright">323,234</span>
              </li>
              <li>
                <span>5</span>
                <span>肯德基</span>
                <span class="liright">323,234</span>
              </li>
              <li>
                <span>6</span>
                <span>肯德基</span>
                <span class="liright">323,234</span>
              </li>
              <li>
                <span>7</span>
                <span>肯德基</span>
                <span class="liright">323,234</span>
              </li>

            </ul>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <Observe></Observe>
  </div>
</template>

<script>
import Card from "./Card"
import * as echarts from "echarts"
import dayjs from "dayjs"
import Observe from "./observe"
import { mapState } from "vuex"
export default {
  name: 'Dashboard',
  components: {
    Card,
    Observe
  },
  mounted() {
    this.charts = echarts.init(this.$refs.charts)
    this.charts.setOption({
      title: {
        text: "销售额趋势"
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: []
        }
      ]
    })
    console.log(this.$store)
    this.$store.dispatch("getData")
  },
  computed: {
    title() {
      return this.activeName === "sale" ? "销售额" : "访问量"
    },
    ...mapState({
      list: state => state.home.data
    })
  },
  watch: {
    activeName() {
      this.charts.setOption({
        title: {
          text: this.title + "趋势"
        },
        xAxis: [
          {
            data: this.activeName === "sale" ? this.list.userFullYearAxis : this.list.orderFullYearAxis
          }
        ],
        series: [
          {
            data: this.activeName === "sale" ? this.list.userFullYear : this.list.orderFullYear
          }
        ]
      })
      // console.log(this.activeName)

    },
    //监听list，因为一开始没有数据，当list有数据时执行,重新设置x轴和y轴的数据
    list() {
      this.charts.setOption({
        xAxis: [
          {
            data: this.list.userFullYearAxis
          }
        ],
        series: [
          {
            data: this.list.userFullYear
          }
        ]
      })
    }

  },
  data() {
    return {
      activeName: 'sale',
      charts: null,

      //收集日历数据
      date: '',
      //vuexmock出来的数据
      // list:{}
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
      // this.activeName=tab._props.name
    },
    day() {
      const day = dayjs().format("YYYY-MM-DD")
      this.date = [day, day]
    },
    week() {
      const start = dayjs().startOf("week").subtract(6, "day").format("YYYY-MM-DD")
      const end = dayjs().endOf("week").subtract(6, "day").format("YYYY-MM-DD")
      this.date = [start, end]
    },
    month() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD")
      const end = dayjs().endOf("month").format("YYYY-MM-DD")
      this.date = [start, end]
    },
    year() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD")
      const end = dayjs().endOf("year").format("YYYY-MM-DD")
      this.date = [start, end]
    }
  }
};

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

>>>.el-card__header {
  border-bottom: none;
}

.clearfix {
  display: flex;
  position: relative;
}

.tab {
  width: 100%;
}

.right {
  position: absolute;
  right: 0;
}

.right span {
  margin: 0 10px;
}

.charts {
  width: 100%;
  height: 300px;
}

ul {
  height: 300px;
  width: 100%;
  padding: 0;
  list-style: none;
}

li {
  height: 8%;
  margin: 10px 0;
}

h3 {
  margin: 0;
}

li span {
  padding: 0 10px;
}

.liright {
  float: right;
}

.black {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: black;
  color: white;
  border-radius: 20px;
  margin: 0 5px;
  padding: 0 5px;
}
</style>
