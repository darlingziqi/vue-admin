<template>
  <el-card>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <span>{{ spuName }}</span>
      </el-form-item>

      <el-form-item label="SKU名称">
        <el-input placeholder="sku名称" v-model="data.skuName"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input
          type="number"
          placeholder="价格(元)"
          v-model="data.price"
        ></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="data.weight"></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="规格描述"
          v-model="data.skuDesc"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form1" label-width="80px">
          <el-form-item
            :label="item.attrName"
            v-for="(item, index) in attrsInfo"
            :key="item.id"
          >
            <el-select placeholder="请选择" v-model="item.attrIdAndValueId">
              <el-option
                v-for="item1 in item.attrValueList"
                :key="item1.id"
                :label="item1.valueName"
                :value="`${item.id}:${item1.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form2" label-width="80px">
          <el-form-item
            :label="item.saleAttrName"
            v-for="(item, index) in saleAttrs"
            :key="item.id"
          >
            <el-select
              placeholder="请选择"
              v-model="item.saleAttrIdAndSaleValueId"
            >
              <el-option
                v-for="item1 in item.spuSaleAttrValueList"
                :key="item1.id"
                :label="item1.saleAttrValueName"
                :value="`${item.id}:${item1.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table
          border
          style="width: 100%"
          :data="imageHasDefaultList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="80px"> </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="scope">
              <img
                style="height: 100px; width: 100px"
                :src="scope.row.imgUrl"
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="scope">
              <el-button
                type="primary"
                v-if="scope.row.isDefault === 0"
                @click="setDefault(scope)"
                >设为默认</el-button
              >
              <el-button v-else @click="scope.row.isDefault = 0"
                >默认</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveSku">保存</el-button>
        <el-button @click="getSceneP">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      imageList: [],
      //销售属性
      saleAttrs: [],
      //平台属性
      attrsInfo: [],

      spuName: "",
      data: {
        category3Id: undefined,
        price: undefined,
        skuName: "",
        spuId: undefined,
        tmId: undefined,
        weight: undefined,
        skuDefaultImg: "",
        skuDesc: "",
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],

        skuImageList: [
          // {
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: undefined,
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        skuSaleAttrValueList: [
          // {
          //   saleAttrId: 0,
          //   saleAttrValueId: 0,
          // },
        ],
      },
      imageHasDefaultList: [],
      attrId: "",
      saleAttrId: "",
      imageList: [],
    };
  },
  methods: {
    async getData(category1Id, category2Id, row) {
      //收集父组件传过来的数据
      this.data.category3Id = row.category3Id;
      this.spuName = row.spuName;
      this.data.spuId = row.id;
      this.data.tmId = row.tmId;
      let result = await this.$API.sku.reqImageList(row.id);
      console.log(result);
      if (result.code === 200) {
        let list = result.data;
        list.forEach((item) => {
          //表示设置默认
          item.isDefault = 0;
        });
        this.imageHasDefaultList = list;
      }

      let result1 = await this.$API.sku.reqSaleAttrs(row.id);
      console.log(result1);
      if (result.code === 200) {
        this.saleAttrs = result1.data;
      }

      let result2 = await this.$API.sku.reqAttrsInfo(
        category1Id,
        category2Id,
        row.category3Id
      );
      console.log(result2);
      if (result.code === 200) {
        this.attrsInfo = result2.data;
      }
    },
    //点击设置默认的排他
    setDefault(scope) {
      this.imageHasDefaultList.forEach((item) => {
        item.isDefault = 0;
      });
      scope.row.isDefault = 1;
      this.data.skuDefaultImg = scope.row.imgUrl;
    },
    //子组件向父组件传值
    getSceneP() {
      this.$emit("getSceneP", 0);
    },

    handleSelectionChange(selection) {
      this.imageList = selection;
    },
    //点击保存按钮
    async saveSku() {
      const { attrsInfo, saleAttrs, imageList } = this;

      //收集平台属性的attrId,valueId
      this.data.skuAttrValueList = attrsInfo.reduce((prve, next) => {
        let [attrId, valueId] = next.attrIdAndValueId.split(":");
        prve.push({ attrId, valueId });
        return prve;
      }, []);

      //收集销售属性的
      this.data.skuSaleAttrValueList = saleAttrs.reduce((prve, next) => {
        let [saleAttrId, saleAttrValueId] =
          next.saleAttrIdAndSaleValueId.split(":");
        prve.push({ saleAttrId, saleAttrValueId });
        return prve;
      }, []);

      //收集图片的数据
      this.data.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });

      let result = await this.$API.sku.reqSaveSku(this.data);
      if (result.code === 200) {
        this.$message.success("保存成功");
        this.$emit("getSceneP", 0);
      }
      this.data = {
        category3Id: undefined,
        price: undefined,
        skuName: "",
        spuId: undefined,
        tmId: undefined,
        weight: undefined,
        skuDefaultImg: "",
        skuDesc: "",
      };
    },
  },
};
</script>

<style>
</style>