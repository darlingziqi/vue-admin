<template>
  <div>
    <el-input disabled :value="$route.query.roleName"></el-input>
    <el-tree style="margin: 20px 0" ref="tree" :data="allPermissions" node-key="id" show-checkbox default-expand-all :props="defaultProps" />
    <el-button :loading="loading" type="primary" @click="save">保存</el-button>
    <el-button @click="$router.replace({name: 'Role'})">取消</el-button>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  name: "roleAuth",
  data() {
    return {
      loading: false, // 用来标识是否正在保存请求中的标识, 防止重复提交
      allPermissions: [], // 所有
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  created() {
    console.log(this.$API)
    this.init();
  },
  computed:{
    ...mapState({
      role:state=>state.user.role
    })
  },
  methods: {
    /* 
      初始化
      */
    init() {
      const roleId = this.$route.params.id;
      this.getPermissions(roleId);
    },
    /* 
      获取指定角色的权限列表
      */
    getPermissions(roleId) {
      this.$API.permission.default.toAssign(roleId).then((result) => {
        const allPermissions = result.data.children;
        this.allPermissions = allPermissions;
        const checkedIds = this.getCheckedIds(allPermissions);
        this.$refs.tree.setCheckedKeys(checkedIds);
      });
    },
    /* 
      得到所有选中的id列表
      */
    getCheckedIds(auths, initArr = []) {
      return auths.reduce((pre, item) => {
        if (item.select && item.level === 4) {
          pre.push(item.id);
        } else if (item.children) {
          this.getCheckedIds(item.children, initArr);
        }
        return pre;
      }, initArr);
    },
    /* 
      保存权限列表
      */
    save() {
      var ids = this.$refs.tree.getCheckedKeys().join(",");
      this.loading = true;
      this.$API.permission
        .default.doAssign(this.$route.params.id, ids)
        .then((result) => {
          this.loading = false;
          this.$message.success(result.$message || "分配权限成功");
          // 必须在跳转前获取(跳转后通过this获取不到正确的数据了)
          const roleName = this.$route.query.roleName;
          this.$router.replace("/acl/role/list", () => {
            console.log("replace onComplete");
            // 跳转成功后, 判断如果更新的是当前用户对应角色的权限, 重新加载页面以获得最新的数据
            if (this.role.includes(roleName)) {
              console.log(this.role)
              window.location.reload();
            }
          });
        });
    },
  },
};
</script>