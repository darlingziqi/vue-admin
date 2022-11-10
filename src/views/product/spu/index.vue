<template>
  <div>
    <CategorySelect
      style="margin: 10px 0"
      @getCategoryId="getCategoryId"
      :show="scene !== 0"
    ></CategorySelect>
    <div v-show="scene === 0">
      <el-card>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin: 10px 0"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table
          style="width: 100%"
          border
          :data="spuList"
          v-loading="loading"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="80px"
          >
          </el-table-column>

          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>

          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>

          <el-table-column label="操作" width="width">
            <template slot-scope="scope">
              <el-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                @click="addSku(scope.row)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="edit(scope)"
              ></el-button>
              <el-button
                style="margin-right: 10px"
                type="info"
                icon="el-icon-info"
                size="mini"
                @click="seeSkuList(scope.row)"
              ></el-button>
              <el-popconfirm
                @onConfirm="delSpu(scope.row)"
                :title="`确定删除${scope.row.spuName}吗？`"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="getSpuList"
          :current-page="pageNum"
          style="text-align: center"
          :page-sizes="[3, 5, 7]"
          :page-size="pageSize"
          layout="prev,pager,next,jumper,->,sizes,total"
          :total="total"
        >
        </el-pagination>
      </el-card>
    </div>
    <SpuForm @getScene="getScene" v-show="scene === 1" ref="spuform" />
    <SkuForm v-show="scene === 2" ref="skuform" @getSceneP="getSceneP" />


    <!-- 查看某个spu的sku列表的对话框 -->
    <el-dialog :title="`${spu.spuName}的SKU列表`"  :visible.sync="dialogTableVisible" :before-close="closeDialog">
      <el-table :data="skuList" border v-loading="loading1">
        <el-table-column
          property="skuName"
          label="名称"
          width="150"
        ></el-table-column>
        <el-table-column
          property="price"
          label="价格"
          width="200"
        ></el-table-column>
        <el-table-column
          property="weight"
          label="重量"
          width="200"
        ></el-table-column>
        <el-table-column
          label="默认图片"
          width="150"
        >
        <template slot-scope="scope">
          <img style="height:100px" :src="scope.row.skuDefaultImg" alt="">
        </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import SkuForm from "./skuForm";
import SpuForm from "./spuForm";

export default {
  name: "Spu",
  components: {
    SkuForm,
    SpuForm,
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      total: 0,
      //一页有多少项
      pageSize: 3,
      //当前页码
      pageNum: 1,
      //表格展示的数据
      spuList: [],
      //异步请求时显示loading效果
      loading: false,
      scene: 0,
      spu: {},
      dialogTableVisible: false,
      skuList:[],
      //对话框的loading
      loading1:true,
    };
  },
  methods: {
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    async getSpuList(pageNum = 1) {
      const { pageSize, category3Id } = this;
      this.loading = true;
      let result = await this.$API.spu.reqSpuList(
        pageNum,
        pageSize,
        category3Id
      );
      this.pageNum = pageNum;
      console.log(result);
      if (result.code === 200) {
        this.loading = false;
        this.total = result.data.total;
        this.spuList = result.data.records;
      }
    },
    handleCurrentChange(page) {
      this.pageNum = page;
      this.getSpuList();
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getSpuList();
    },
    //点击编辑按钮
    edit(scope) {
      console.log(scope.row);
      //显示SpuForm标记
      this.scene = 1;
      //获取子组件SpuForm的属性和方法--
      this.$refs.spuform.getData(scope.row.id);
    },
    //自定义事件的回调函数--当点击保存子组件需要通知父组件返回场景为0的组件
    getScene(data) {
      this.scene = data.scene;
      if (data.updateOrAdd === "添加") {
        this.getSpuList();
      } else {
        //点击取消后data.updateOrAdd为空字符串，所以走else，此时页码不变
        this.getSpuList(this.pageNum);
      }
    },
    //点击添加Spu -需要发两次请求获取品牌和平台所有属性,发请求的代码在子组件spuform组件,在通过ref获取子组件的方法
    addSpu() {
      this.$refs.spuform.addSpu();
      this.$refs.spuform.spu.category3Id = this.category3Id;
      this.scene = 1;
    },
    //点击删除
    async delSpu(row) {
      console.log(row);
      let result = await this.$API.spu.reqDelSpu(row.id);
      console.log(result);
      //在此修改pageNum的值
      this.getSpuList(
        (this.pageNum =
          this.spuList.length === 1 ? this.pageNum - 1 : this.pageNum)
      );
    },

    addSku(row) {
      this.scene = 2;
      console.log(row);
      this.$refs.skuform.getData(this.category1Id, this.category2Id, row);
    },
    //skuForm 点击取消按钮，跳到场景0
    getSceneP(scene) {
      this.scene = scene;
    },
    //点击查看某个spu的sku列表
    async seeSkuList(row) {
      //收集row的数据，用于显示对话框的标题
      this.spu = row;
      //显示对话框
      this.dialogTableVisible=true;
      //获取sku列表
      let result=await this.$API.sku.reqSkuList(row.id)
      console.log(result)
      if(result.code===200){
        this.skuList=result.data
        //loading隐藏--但此处loading就一直为false，再点击下一次时没有loading效果-需要在关闭对话框时执行一个回调，来师loading再次为true
        this.loading1=false
      }
    },
    //关闭对话框的回调
    closeDialog(done){
      //loading赋为true
      this.loading1=true
      //否则再次点开，在loading时会显示原来的列表
      this.skuList=[]
      //关闭对话框
      done()
    }
  },
};
</script>
