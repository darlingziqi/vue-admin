import service from "@/utils/request";

//获取spu列表
export const reqSpuList=(page,limit,category3Id)=>service({url:`/product/${page}/${limit}`,params:{category3Id}})

//获取单个spu的所有数据 /admin/product/getSpuById/{spuId}
export const reqSpu=(spuId)=>service({url:`/product/getSpuById/${spuId}`})

//获取品牌 /admin/product/baseTrademark/getTrademarkList
export const reqBrand=()=>service({url:"/product/baseTrademark/getTrademarkList"})

//获取spu图片 /admin/product/spuImageList/{spuId}
export const reqSpuImage=(spuId)=>service({url:`/product/spuImageList/${spuId}`})

//获取平台全部销售属性 /admin/product/baseSaleAttrList
export const reqAllSaleAttrs=()=>service({url:`/product/baseSaleAttrList`})

//修改或新增spu信息 POST /admin/product/updateSpuInfo   POST /admin/product/saveSpuInfo

export const reqUpdataOrAddInfo=(data)=>{
    if(data.id){
        return service({url:"/product/updateSpuInfo",data,method:"post"})
    }else{
        return service({url:"/product/saveSpuInfo",data,method:"post"})
    }
}
//删除spu /admin/product/deleteSpu/{spuId}

export const reqDelSpu=(spuId)=>service({url:`/product/deleteSpu/${spuId}`,method:"delete"})