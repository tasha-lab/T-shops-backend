import { client } from "../config/prismaClient"
import slugify from "slugify"

export const createCategoryService=async(name:string,parentId?:string)=>{
    const slug = slugify(name,{lower:true,strict:true})

    return await client.category.create({
        data:{
            name,slug,parentId
        }
    })
}