<template>
  <div>
    <el-card>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="一级分类">
          <el-select
            v-model="categoryId.category1Id"
            placeholder="请选择"
            @change="handler1"
            :disabled="show"
          >
            <el-option
              :label="item.name"
              :value="item.id"
              :key="item.id"
              v-for="item in category1List"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" :model="categoryId">
          <el-select
            v-model="categoryId.category2Id"
            placeholder="请选择"
            @change="handler2"
            :disabled="show"
          >
            <el-option
              v-for="item in category2List"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类" :model="categoryId">
          <!-- 点击添加属性 不能再继续操作选择框 -->
          <el-select
            v-model="categoryId.category3Id"
            placeholder="请选择"
            @change="handler3"
            :disabled="show"
          >
            <el-option
              v-for="item in category3List"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "CategorySelect",
  data() {
    return {
      //el-option需要遍历的数组
      category1List: [],
      category2List: [],
      category3List: [],
      //选择下拉框的某个特定的项，会收集对应的id
      categoryId: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  props: ["show"],
  mounted() {
    //一开始就要获取到一级分类的下拉框目录
    this.getCategory1List();
  },
  methods: {
    //获取一级分类下拉框目录的函数
    async getCategory1List() {
      let result = await this.$API.attrs.reqCategory1List();
      console.log(result);
      if (result.code === 200) {
        this.category1List = result.data;
      }
    },
    // select的change事件对应的函数，当点击某个option项时触发，点击一级分类的特定项时触发
    async handler1() {
      //首先先将二、三级分类的option数组清空，作用是 修改一级分类  三级分类的option还是之前二级分类的下一级分类，此时应该是空数据
      //清空id，作用：在非第一次选择的情况下，若不清空，当选择第一项的时候，二三级分类还有之前一级分类对应的二三级分类
      this.category2List = [];
      this.category3List = [];
      this.categoryId.category2Id = "";
      this.categoryId.category3Id = "";
      //获取二级分类的option数组
      let result = await this.$API.attrs.reqCategory2List(
        this.categoryId.category1Id
      );
      console.log(result);
      if (result.code === 200) {
        this.category2List = result.data;
      }
      
      this.$emit("getCategoryId", {
        categoryId: this.categoryId.category1Id,
        //添加level的目的是为了区分传给父亲的是几级分类的id
        level: 1,
      });
    },
    async handler2() {
      this.category3List = [];
      this.categoryId.category3Id = "";

      let result = await this.$API.attrs.reqCategory3List(
        this.categoryId.category2Id
      );
      console.log(result);
      if (result.code === 200) {
        this.category3List = result.data;
      }
      this.$emit("getCategoryId", {
        categoryId: this.categoryId.category2Id,
        level: 2,
      });
    },
    handler3() {
      this.$emit("getCategoryId", {
        categoryId: this.categoryId.category3Id,
        level: 3,
      });
    },
  },
};
</script>
