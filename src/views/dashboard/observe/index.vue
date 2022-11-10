<template>
    <el-row>
        <el-col :span="12">
            <Search></Search>
        </el-col>
        <el-col :span="12">
            <Category></Category>
        </el-col>
    </el-row>
</template>
<script>
import Search from "./search"
import Category from "./category"
export default{
    name:"Observe",
    components:{
        Search,
        Category
    }
}
</script>
<style>
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
    width: 480px;
}
</style>