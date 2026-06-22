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
