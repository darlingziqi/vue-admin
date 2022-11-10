<template>
  <div>
    <el-table style="width: 100%" :data="allSkuList" border>
      <el-table-column type="index" label="序号" align="center" width="80px">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="200">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="200">
      </el-table-column>
      <el-table-column label="默认图片" width="width">
        <template slot-scope="scope">
          <img :src="scope.row.skuDefaultImg" style="height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="150">
      </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="150">
      </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isSale === 0" @click="onSale(scope.row)" type="info" icon="el-icon-top"
            size="mini"></el-button>
          <el-button type="success" icon="el-icon-bottom" size="mini" v-else @click="cancleSale(scope.row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="detailInfo(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" align="center"
      :current-page="page" :page-sizes="[3, 5, 10]" :page-size="limit"
      layout=" prev, pager, next, jumper,->,sizes,total " :total="total">
    </el-pagination>
    <!-- 抽屉效果 -->
    <el-drawer size="50%" :visible.sync="drawer" :with-header="false" @close="
  skuDetailInfo = {};
loading = true;
    ">
      <div v-loading="loading">
        <el-row>
          <el-col :span="5">名称</el-col>
          <el-col :span="16">{{ skuDetailInfo.skuName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">描述</el-col>
          <el-col :span="16">{{ skuDetailInfo.skuDesc }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">价格</el-col>
          <el-col :span="16">{{ skuDetailInfo.price }}元</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">平台属性</el-col>
          <el-col :span="16">
            <el-tag :key="item.id" style="margin-left: 10px" v-for="item in skuDetailInfo.skuAttrValueList"
              type="success">{{ item.valueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">商品图片</el-col>
          <el-col :span="16">
            <div class="block">
              <el-carousel trigger="click" height="500px">
                <el-carousel-item v-for="item in skuDetailInfo.skuImageList" :key="item.id">
                  <img style="height:500px;width:512px" :src="item.imgUrl">
                </el-carousel-item>
              </el-carousel>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>
<script>
export default {
  name: "Sku",
  data() {
    return {
      //当前页码
      page: 1,
      //每页限制多少项
      limit: 10,
      //总项数
      total: undefined,
      //所有sku列表
      allSkuList: [],
      skuDetailInfo: {},
      drawer: false,
      loading: true,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      const { page, limit } = this;
      let result = await this.$API.sku.reqAllSkuList(page, limit);
      console.log(result);
      if (result.code === 200) {
        this.allSkuList = result.data.records;
        this.total = result.data.total;
      }
    },
    handleSizeChange(size) {
      this.limit = size;
      this.getData();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getData();
    },
    //目前为下架状态  点击则会上架商品
    async onSale(row) {
      let result = await this.$API.sku.reqOnSale(row.id);
      if (result.code === 200) {
        this.getData();
        this.$message.success("上架成功");
      }
    },
    //目前为上架状态  点击则会下架商品
    async cancleSale(row) {
      let result = await this.$API.sku.reqCancleSale(row.id);
      if (result.code === 200) {
        this.getData();
        this.$message.success("下架成功");
      }
    },
    //点击查看spu详情
    async detailInfo(row) {
      //打开抽屉
      this.drawer = true;
      let result = await this.$API.sku.reqSkuDetail(row.id);
      console.log(result);
      if (result.code === 200) {
        this.skuDetailInfo = result.data;
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.el-col {
  margin: 10px 10px;
}

.el-col-5 {
  font-size: 18px;
  text-align: right;
}

>>>.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

>>>.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

>>>.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>