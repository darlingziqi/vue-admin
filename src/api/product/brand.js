
import service from "@/utils/request.js"

//获取分页列表  /admin/product/baseTrademark/{page}/{limit}
export const reqBrandList=(page,limit)=>service({url:`/product/baseTrademark/${page}/${limit}`})

//新增品牌和修改品牌  /admin/product/baseTrademark/save     /admin/product/baseTrademark/update
export const reqAddOrUpdateBrand=(data)=>{
    if(data.id){
        return service({url:'/product/baseTrademark/update',method:"put",data})
    }else{
        return service({url:"/product/baseTrademark/save",method:"post",data})
    }
}

//删除品牌 DELETE /admin/product/baseTrademark/remove/{id}
export const reqDeleteBrand=(id)=>service({url:`/product/baseTrademark/remove/${id}`,method:"delete"})
