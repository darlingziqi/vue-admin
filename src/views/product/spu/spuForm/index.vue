<template>
  <div>
    <el-card>
      <el-form ref="form" label-width="80px" :model="spu">
        <el-form-item label="SPU名称">
          <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select placeholder="请选择品牌" v-model="spu.tmId">
            <el-option
              v-for="item in brandList"
              :label="item.tmName"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
          <el-input
            placeholder="概述"
            type="textarea"
            v-model="spu.description"
            rows="4"
          ></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
          <el-upload
            action="/admin/product/upload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="spuImage"
            :on-success="upload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="销售属性">
          <el-select
            :placeholder="`还有${notSelectAttrs.length}未选择`"
            v-model="attrIdAndName"
          >
            <el-option
              :key="item.id"
              v-for="item in notSelectAttrs"
              :label="item.name"
              :value="`${item.id}:${item.name}`"
            ></el-option>
          </el-select>
          <el-button
            :disabled="!attrIdAndName"
            type="primary"
            icon="el-icon-plus"
            @click="addSaleAttrs"
            >添加销售属性</el-button
          >
          <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
            <el-table-column
              type="index"
              label="序号"
              width="80px"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="saleAttrName" label="属性名" width="width">
            </el-table-column>
            <el-table-column label="属性值名称列表" width="width">
              <template slot-scope="scope">
                <!-- 此处scope为spuSaleAttrList的数组对象 -->
                <el-tag
                  :key="item.id"
                  v-for="(item, index) in scope.row.spuSaleAttrValueList"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scope.row.spuSaleAttrValueList, index)"
                >
                  {{ item.saleAttrValueName }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  :ref="scope.$index"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope)"
                  @blur="handleInputConfirm(scope)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope)"
                  >添加属性值</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" width="width">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="spu.spuSaleAttrList.splice(scope.$index, 1)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addOrUpdate">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      data1: "",
      data2: "",
      //某个spu的信息
      //spuInfo: {},
      //所有品牌列表
      brandList: [],
      //某个spu图片
      spuImage: [],
      //所有销售属性
      allSaleAttrs: [],

      spu: {
        category3Id: undefined,
        description: "",
        spuName: "",
        tmId: undefined,
        id: undefined,
        spuImageList: [
          {
            id: undefined,
            imgName: "",
            imgUrl: "",
            spuId: undefined,
          },
        ],

        spuSaleAttrList: [
          //添加的时候不需要这些空数据，否则属性那会有一行空数据
          // {
            // baseSaleAttrId: undefined,
            // id: undefined,
            // saleAttrName: "",
            // spuId: undefined,
            // spuSaleAttrValueList: [
              // {
              //   baseSaleAttrId: undefined,
              //   id: undefined,
              //   isChecked: "",
              //   saleAttrName: "",
              //   saleAttrValueName: "",
              //   spuId: undefined,
              // },
            // ],
          // },
        ],
      },
      inputVisible: false,
      inputValue: "", //添加tag标签的input内容
      attrIdAndName: "", //收集未选择的销售属性Id和名字
    };
  },
  computed: {
    //   计算多少个未选择销售属性
    notSelectAttrs() {
      return this.allSaleAttrs.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name !== item1.saleAttrName;
        });
      });
    },
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.spuImage = fileList;
    },
    upload(response, file, fileList) {
      console.log(response, file, fileList);
      this.spuImage = fileList;
    },
    async getData(spuId) {
      let resultSpuInfo = await this.$API.spu.reqSpu(spuId);
      if (resultSpuInfo.code === 200) {
        this.spu = resultSpuInfo.data;
      }

      let resultBrand = await this.$API.spu.reqBrand();
      if (resultBrand.code === 200) {
        this.brandList = resultBrand.data;
      }

      let resultImage = await this.$API.spu.reqSpuImage(spuId);
      if (resultImage.code === 200) {
        let list = resultImage.data;
        list.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImage = list;
      }

      let resultAllSaleAttrs = await this.$API.spu.reqAllSaleAttrs();
      if (resultAllSaleAttrs.code === 200) {
        this.allSaleAttrs = resultAllSaleAttrs.data;
      }
    },

    //删除属性值
    handleClose(arr, index) {
      arr.splice(index, 1);
    },

    showInput(scope) {
      this.$set(scope.row, "inputVisible", true);
      this.$set(scope.row, "inputValue", "");
      this.$nextTick(() => {
        this.$refs[scope.$index].focus();
      });
    },

    handleInputConfirm(scope) {
      //判断是否有相同属性值
      let isSame = scope.row.spuSaleAttrValueList.some((item) => {
        return item.saleAttrValueName === scope.row.inputValue;
      });
      //如果属性值为空，则不能作为新的属性
      if (scope.row.inputValue.trim() == "") {
        this.$message.warning("请输入一个正确的属性值");
      } else if (isSame) {
        //每次按回车都会执行，因为既按回车又失去焦点 所以执行两次--此处不能有提示，用户体验不太好
        return;
      } else {
        scope.row.inputVisible = false;
        scope.row.spuSaleAttrValueList.push({
          saleAttrValueName: scope.row.inputValue,
          baseSaleAttrId: scope.row.baseSaleAttrId,
        });
      }
    },
    addSaleAttrs() {
      let [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(":");
      this.spu.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      });
      //选项框选中之后，继续显示还有几未显示
      this.attrIdAndName = "";
    },

    //保存数据的回调--通知父组件切换场景，并且若是修改，需保持当前页码，添加页码跳转到1，所以还需要个flag（updateOrAdd）标记
    async addOrUpdate(){
      this.spu.spuImageList=this.spuImage.map(item=>{
        //照片墙只需给服务器返回这两个属性
        return {
          //原有的和新增的图片都有name
          imgName:item.name,
          //新增的图片不能用本地的url，需要用到服务器返回的url，下面是区分新增和原有图片
          imgUrl:(item.response&&item.response.data)||item.imgUrl
        }
      })
      //向服务发请求
      let result=await this.$API.spu.reqUpdataOrAddInfo(this.spu)
      if(result.code===200){
        let updateOrAdd=this.spu.id?"修改":"添加"
        this.$emit("getScene",{scene:0,updateOrAdd})
        this.$message.success("保存成功")
      }
      //清除数据--点击完编辑之后再点击添加会有之前的数据
      Object.assign(this._data,this.$options.data())
    },
    
    async addSpu(){
      let resultBrand = await this.$API.spu.reqBrand();
      if (resultBrand.code === 200) {
        this.brandList = resultBrand.data;
      }

      let resultAllSaleAttrs = await this.$API.spu.reqAllSaleAttrs();
      if (resultAllSaleAttrs.code === 200) {
        this.allSaleAttrs = resultAllSaleAttrs.data;
      }
    },
    //点击取消通知父组件切换场景
    cancel(){
      this.$emit("getScene",{scene:0,updateOrAdd:""})
    }
  },
};
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>