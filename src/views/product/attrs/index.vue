<template>
  <div>
    <CategorySelect @getCategoryId="getCategoryId" :show="!isShow"></CategorySelect>
    <el-card style="margin-top: 20px">
      <!-- 平台属性列表 -->
      <div v-show="isShow">
        <el-button
          :disabled="!category3Id"
          style="margin-bottom: 15px"
          icon="el-icon-plus"
          type="primary"
          @click="addAttr"
          >添加属性</el-button
        >
        <el-table border width="100%" :data="attrsList">
          <el-table-column label="序号" width="80" type="index" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{ row }">
              <el-tag
                style="margin-right: 10px"
                type="success"
                v-for="item in row.attrValueList"
                :key="item.id"
                >{{ item.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="date" label="操作" width="200">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                @click="editAttr(row)"
              ></el-button>
              <el-popconfirm
                :title="`确定删除${row.attrName}吗？`"
                @confirm="delAttrs(row)"
              >
                <el-button
                  style="margin-left:10px"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加和编辑组件 -->
      <div div v-show="!isShow">
        <el-form :inline="true" ref="form" label-width="60px">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="addAttrList.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          :disabled="!addAttrList.attrName"
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <!-- 点击取消，显示平台属性列表组件 -->
        <el-button @click="isShow = true">取消</el-button>
        <el-table
          style="margin: 15px 0"
          border
          :data="addAttrList.attrValueList"
        >
          <el-table-column label="序号" width="80" type="index" align="center">
          </el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{ row, $index }">
              <el-input
                size="mini"
                v-model="row.valueName"
                :ref="$index"
                v-show="row.flag"
                @blur="showSpan(row)"
                @keyup.native.enter="showSpan(row)"
              ></el-input>
              <span
                @click="showInput(row, $index)"
                style="display: block; height: 23px"
                v-show="!row.flag"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.valueName}属性值吗？`"
                @confirm="delAttrValue(row, $index)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="saveAttrs" :disabled='addAttrList.attrValueList.length<1'>保存</el-button>
        <el-button @click="isShow = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
//引入lodash中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attrs",
  data() {
    return {
      //子组件传过来的categoryId
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //平台属性列表数组
      attrsList: [],
      //用于显示隐藏平台属性列表（true）或者添加/编辑组件
      isShow: true,
      //收集数据，将来添加或修改，会收集到这些数据，点击保存后将这些收集到的数据发送给服务器
      addAttrList: {
        attrName: "",
        attrValueList: [],
        categoryId: "",
        categoryLevel: 3,
      },
    };
  },
  methods: {
    //自定义事件----收集一、二、三级ID
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        //将该组件的id清空--因为添加平台属性的禁用和this.catogory3Id有关，但重新选择一级分类，二级分类时，虽然Category组件的id清空了，但是本组件的this.3id,没有清，所以当重新
        //选择1id，2id时，添加按钮还是可用状态，但此时应该是禁用状态
        this.category2Id = "";
        this.category3Id = "";
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        //三级分类选择之后，触发自定义事件，执行此else，一二三级分类id全部获取到，此时可以直接获取属性列表
        this.getAttrs();
      }
    },
    //通过一、二、三级ID获取属性列表
    async getAttrs() {
      let result = await this.$API.attrs.reqAttrs(
        this.category1Id,
        this.category2Id,
        this.category3Id
      );
      console.log(result);
      if (result.code === 200) {
        this.attrsList = result.data;
      }
    },
    // 点击添加属性按钮触发的事件
    addAttr() {
      //显示添加或修改属性的组件界面
      this.isShow = false;
      //在添加的过程中，输入新的平台属性，通过v-model收集attrName，并获取catgory3Id,属性值先不用收集，在点击添加属性值时才收集，但需要这个对象属性，Level发送定值：3
      this.addAttrList = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },

    //点击编辑按钮触发的事件
    //此row是  attrsList 数组中的元素对象
    editAttr(row) {
      //显示添加或修改属性的组件界面
      this.isShow = false;
      console.log(row);
      /* 此处需要使用lodash的深拷贝，简单地{...row}是解决不了问题的，因为row的结构是
      {
        attrName: "手机系统";
        attrValueList: Array(2);数组里边又是两个对象
        categoryId: 2;
        categoryLevel: 1;
      }
      */
      row.attrValueList.forEach((item) => {
        //用于每个属性显示input还是span的标识，true为input
        item.flag = false;
      });
      this.addAttrList = cloneDeep(row);
    },

    //点击添加属性值
    addAttrValue() {
      this.addAttrList.attrValueList.push({
        //若是点击的编辑可直接this.addAttrList.id，若点击的添加获取的是undefined
        attrId: this.addAttrList.id,
        //属性值的input框 v-model的数据
        valueName: "",
        //最新添加的数据，初始是input输入框
        flag: true,
      });
      //此处input重绘重排需要时间，不能获取到input
      this.$nextTick(() => {
        //获取input框的焦点
        this.$refs[this.addAttrList.attrValueList.length - 1].focus();
      });
    },
    //删除属性值
    delAttrValue(row, index) {
      console.log(row, index);
      this.addAttrList.attrValueList.splice(index, 1);
    },
    
    //此row非彼row  此row是addAttrList.attrValueList中的一个对象
    //span之前的状态是input
    showSpan(row) {
      //如果属性值为空，则不能作为新的属性
      if (row.valueName.trim() == "") {
        this.$message.warning("请输入一个正确的属性值");
      }
      //不能添加重复的属性---使用数组的some方法，寻找是否有符合条件的，而every是看是否都符合条件
      let isRepeate = this.addAttrList.attrValueList.some((item) => {
        //row是新增的属性值
        if (row !== item) {
          //不用验证自身，只需验证其余的数组对象
          return row.valueName === item.valueName;
        }
      });
      if (isRepeate) {
        //如果重复，还是显示input
        row.flag = true;
        this.$message.warning("不能输入重复的属性值");
      } else {
        row.flag = false;
      }
    },
    showInput(row, index) {
      row.flag = true;

      //自动获取焦点--点击span，切换为input变为编辑模式，但是页面的重绘重排是耗时间的，不可能一点击span就立马获取到input
      // v-show v-if 都不行
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    async saveAttrs() {
      //传去的data不需要flag
      this.addAttrList.attrValueList = this.addAttrList.attrValueList.filter(
        (item) => {
          delete item.flag;
          return true;
        }
      );
      try {
        await this.$API.attrs.reqSaveAttrs(this.addAttrList);
        this.$message.success("保存成功");
        this.isShow = true;
        this.getAttrs();
      } catch (error) {
        alert(error.message);
      }
    },
    //删除属性
    async delAttrs(row) {
      try {
        await this.$API.attrs.reqDelAttrs(row.id);
        this.$message.success("删除成功");
        this.getAttrs();
      } catch (error) {
        this.$message.danger(error.message);
      }
    },
  },
};
</script>
