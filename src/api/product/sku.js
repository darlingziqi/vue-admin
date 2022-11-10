import service from "@/utils/request";
 
//获取图片 /admin/product/spuImageList/{spuId}
export const reqImageList=(spuId)=>service({url:`/product/spuImageList/${spuId}`})

//获取销售属性 GET /admin/product/spuSaleAttrList/{spuId}
export const reqSaleAttrs=(spuId)=>service({url:`/product/spuSaleAttrList/${spuId}`})

//获取平台属性
export const reqAttrsInfo=(category1Id,category2Id,category3Id)=>service({url:`/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`})

//保存sku POST /admin/product/saveSkuInfo
export const reqSaveSku=(data)=>service({url:"/product/saveSkuInfo",method:"post",data})

//通过spuId获取spu列表 GET /admin/product/findBySpuId/{spuId}
export const reqSkuList=(spuId)=>service({url:`/product/findBySpuId/${spuId}`})


//获取sku列表数据 GET /admin/product/list/{page}/{limit}
export const reqAllSkuList=(page,limit)=>service({url:`/product/list/${page}/${limit}`})

//商品上架 GET /admin/product/onSale/{skuId}
export const reqOnSale=(skuId)=>service({url:`/product/onSale/${skuId}`})

//商品下架 GET /admin/product/cancelSale/{skuId}
export const reqCancleSale=(skuId)=>service({url:`/product/cancelSale/${skuId}`})

//获取sku详情 GET /admin/product/getSkuById/{skuId}
export const reqSkuDetail=(skuId)=>service({url:`/product/getSkuById/${skuId}`})
