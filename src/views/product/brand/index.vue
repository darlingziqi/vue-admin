<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin-bottom: 20px"
      @click="showAddOrChange"
      >添加</el-button
    >
    <!-- 表格 -->
    <el-table :data="list" style="width: 100%" border>
      <el-table-column
        type="index"
        label="序号"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column prop="logoUrl" label="品牌Logo">
        <template slot-scope="scope">
          <img
            style="width: 100px; height: 100px"
            :src="scope.row.logoUrl"
            alt=""
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作">
        <template slot-scope="scope">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="showAddOrChange(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="del(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="text-align: center; margin-top: 10px"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[3, 5, 7]"
      :total="total"
      :pager-count="7"
      layout="prev,pager,next,jumper,->,sizes,total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <!-- 对话框 -->
    <el-dialog
      :title="(form.id ? '编辑' : '添加') + '品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" style="width: 80%" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌Logo" label-width="100px" prop="logoUrl">
          <!-- 上传图片 -->
          <el-upload
            class="avatar-uploader"
            action="/admin/product/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过2MB
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "Brand",
  data() {
    return {
      //当前页码
      page: 1,
      //每页有多少项
      limit: 3,
      //总项数
      total: 0,
      //需要渲染到表格中的数组
      list: [],
      //控制对话框显示隐藏
      dialogFormVisible: false,
      // 添加/修改的表单数据
      form: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change",
          },
        ],
        logoUrl: [{ required: true, message: "请选择品牌Logo" }],
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      let result = await this.$API.brand.reqBrandList(this.page, this.limit);
      console.log(result);
      if (result.code === 200) {
        this.list = result.data.records;
        // this.page = result.data.current;
        this.total = result.data.total;
      }
    },
    //点击添加或修改
    showAddOrChange(row) {
      if (row.id) {
        //this.form和row指向同一个地址，目前是浅拷贝 需要给用扩展运算符新建一个对象
        this.form = {...row} ;
      } else {
        this.form.tmName = "";
        this.form.logoUrl = "";
      }
      this.dialogFormVisible = true;
    },
    del(row) {
      this.$confirm(`此操作将永久删除${row.tmName}品牌, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.brand.reqDeleteBrand(row.id);
          console.log(result);
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            if (this.list.length === 1) {
              this.page -= 1;
            }
            this.getData();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getData();
    },
    handleSizeChange(limit) {
      console.log(limit);
      this.limit = limit;
      this.getData();
    },
    handleAvatarSuccess(res, file) {
      console.log(res.data)
      this.form.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片只能是 JPG或PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return (isPNG || isJPG) && isLt2M;
    },
    addOrUpdate() {
      this.$refs.ruleForm.validate(async (success) => {
        console.log(success);
        if (success) {
          this.dialogFormVisible = false;
          let result = await this.$API.brand.reqAddOrUpdateBrand(this.form);
          if (result.code === 200) {
            this.$message.success(
              (this.form.id ? "修改" : "添加") + "品牌成功"
            );
            this.getData();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #6d6c6c;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>