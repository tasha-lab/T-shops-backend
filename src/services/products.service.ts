import { client } from "../config/prismaClient";

export const createProduct = async (
  name: string,
  description: string,
  categoryId: string,
  userId: string,
  productImage: { url: string; isPrimary: boolean }[],
  productVariants: {
    sku: string;
    price: number;
    stockQty: number;
    attributes: object;
  }[]
) => {
  const vendor = await client.vendor.findUnique({ where: { userId } });
  if (!vendor) throw new Error("VendorNotFound");
  const product = await client.product.create({
    data: {
      name,
      description,
      categoryId,
      vendorId: vendor.id,
      productImage: { createMany: { data: productImage } },
      productVariant: { createMany: { data: productVariants } },
    },
  });
  return product;
};

export const getAllProducts = async () => {
  return await client.product.findMany({
    include: {
      vendor: {
        select: {
          shopname: true,
        },
      },
    },
  });
};
export const getoneProduct = async (id: string) => {
  return await client.product.findUnique({
    where: { id },
  });
};

export const editProduct = async (
  id: string,
  name: string,
  description: string,
  categoryId: string,
  productImage: { url: string; isPrimary: boolean }[],
  productVariants: {
    sku: string;
    price: number;
    stockQty: number;
    attributes: object;
  }[]
) => {
  const existingProduct = await client.product.findFirst({ where: { id } });
  if (!existingProduct) throw new Error("ProductNotFound");
  return await client.product.update({
    where: { id },
    data: {
      name,
      description,
      categoryId,
      productImage: {
        deleteMany: {},
        createMany: { data: productImage },
      },
      productVariant: {
        deleteMany: {},
        createMany: { data: productVariants },
      },
    },
  });
};

export const deleteThisProduct = async (id: string) => {
  const existingProduct = await client.product.findFirst({
    where: { id },
  });
  if (!existingProduct) throw new Error("ProductDoesNotExist");
  await client.productImage.deleteMany({ where: { productId: id } });
  await client.productVariant.deleteMany({ where: { productId: id } });
  await client.product.delete({ where: { id } });
};
export const vendorsProduct = async(userId:string)=>{
  const vendor = await client.vendor.findUnique({ where: { userId } });
  if (!vendor) throw new Error("VendorNotFound");
  return await client.product.findMany({
    where:{vendorId:vendor.id}
  })
}
