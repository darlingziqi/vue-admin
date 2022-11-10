<template>
    <div>
        <el-button v-show="$store.state.user.buttons.includes('btn.Add1')">添加按钮1</el-button>
        <el-button v-show="$store.state.user.buttons.includes('btn.Add2')">添加按钮2</el-button>
    </div>
</template>
<script>
export default{
    name:"Test1"
}
</script>