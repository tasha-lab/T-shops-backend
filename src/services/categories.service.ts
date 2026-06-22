import { error } from "node:console";
import { client } from "../config/prismaClient";
import slugify from "slugify";

export const createCategoryService = async (
  name: string,
  parentId?: string
) => {
  const slug = slugify(name, { lower: true, strict: true });
  const existingCategory = await client.category.findUnique({
    where: { slug },
  });

  if (existingCategory) {
    throw new Error("CategoryExists");
  }

  if (parentId) {
    const parentexists = await client.category.findUnique({
      where: {
        id: parentId,
      },
    });
    if (!parentexists) throw new Error("Parent not found");
  }
  return await client.category.create({
    data: {
      name,
      slug,
      parentId,
    },
  });
};

export const getCategoryService = async (slug: string) => {
  return await client.category.findUnique({
    where: {
      slug,
    },
    include: {
      children: true,
    },
  });
};

export const getAllCategories = async () => {
  return await client.category.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      parentId: null,
    },
    include: {
      children: true,
    },
  });
};

export const updateCategoryService = async (
  slug: string,
  name?: string,
  parentId?: string | null
) => {
  const category = await client.category.findFirst({ where: { slug } });
  if (!category) throw new Error("Categorynotfound");

  let newSlug: string | undefined;

  if (name !== undefined) {
    newSlug = slugify(name, { lower: true, strict: true });
    const duplicate = await client.category.findFirst({
      where: { slug: newSlug, NOT: { id: category.id } },
    });
    if (duplicate) throw new Error("thiscategoryexists");
  }

  if (parentId !== undefined && parentId !== null) {
    if (parentId === category.id)
      throw new Error("Category cannot be its own parent");

    const parentExists = await client.category.findUnique({
      where: { id: parentId },
    });
    if (!parentExists) throw new Error("Parent not found");
  }

  return client.category.update({
    where: { id: category.id },
    data: {
      ...(name !== undefined && { name, slug: newSlug }),
      ...(parentId !== undefined && { parentId }),
    },
  });
};
export const deleteCategoryService=async(slug:string)=>{
  const category = await client.category.findUnique({
    where:{slug},
    include:{
      children:true,
      products:true
    }
  })
  if(!category) throw new Error("CategorynotFound")
  if(category.children.length>0) throw new Error("CategoryHasChildren")
  if(category.products.length>0)throw new Error("CategoryHasProducts")
  const deletingCategory = await client.category.delete({
    where:{slug}
  })
  return deletingCategory
}