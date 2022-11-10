import service from "@/utils/request";

//获取一级分类 GET /admin/product/getCategory1
export const reqCategory1List=()=>service({url:"/product/getCategory1"})

//根据一级分类id获取二级分类 GET /admin/product/getCategory2/{category1Id}
export const reqCategory2List=(category1Id)=>service({url:`/product/getCategory2/${category1Id}`})

//根据二级分类id获取三级级分类 GET /admin/product/getCategory3/{category2Id}
export const reqCategory3List=(category2Id)=>service({url:`/product/getCategory3/${category2Id}`})

//GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrs=(category1Id,category2Id,category3Id)=>service({url:`/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`})

//添加属性 POST /admin/product/saveAttrInfo
export const reqAddAttrs=(data)=>service({"url":'/product/saveAttrInfo',data,method:"post"})

//保存新添的或修改的属性 POST /admin/product/saveAttrInfo
export const reqSaveAttrs=(data)=>service({url:'/product/saveAttrInfo',data,method:"post"})

//删除属性 DELETE /admin/product/deleteAttr/{attrId}
export const reqDelAttrs=(attrId)=>service({url:`/product/deleteAttr/${attrId}`,method:'delete'})
